package com.gastrocontrol.service;

import com.gastrocontrol.domain.entity.*;
import com.gastrocontrol.domain.enums.DemandaStatus;
import com.gastrocontrol.domain.enums.ListaComprasStatus;
import com.gastrocontrol.domain.enums.MovimentacaoTipo;
import com.gastrocontrol.dto.demanda.*;
import com.gastrocontrol.exception.RecursoNaoEncontradoException;
import com.gastrocontrol.exception.RegraDeNegocioException;
import com.gastrocontrol.repository.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ==========================================================
 * SERVIÇO CENTRAL DO GASTROCONTROL - DEMANDA
 * ==========================================================
 *
 * Implementa o fluxo principal orientado por DEMANDA:
 *
 * 1. Registro da demanda com pratos e quantidades
 * 2. Cálculo automático de ingredientes necessários (ficha técnica × quantidade)
 * 3. Consolidação de ingredientes repetidos entre pratos
 * 4. Verificação de estoque disponível (FEFO)
 * 5. Cálculo automático de déficit por ingrediente
 * 6. Geração automática de lista de compras
 * 7. Redução de estoque (baixa automática) ao finalizar
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DemandaService {

    private final DemandaRepository demandaRepository;
    private final PratoRepository pratoRepository;
    private final FichaTecnicaRepository fichaTecnicaRepository;
    private final EstoqueRepository estoqueRepository;
    private final ListaComprasRepository listaComprasRepository;
    private final ItemCompraRepository itemCompraRepository;
    private final MovimentacaoEstoqueRepository movimentacaoRepository;

    @Transactional(readOnly = true)
    public Page<DemandaResponse> listarTodas(Pageable pageable) {
        return demandaRepository.findAllByDeletedFalse(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<DemandaResponse> listarPorStatus(DemandaStatus status, Pageable pageable) {
        return demandaRepository.findAllByStatusAndDeletedFalse(status, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public DemandaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional
    public DemandaResponse criar(DemandaRequest request) {
        Demanda demanda = Demanda.builder()
                .titulo(request.getTitulo())
                .descricao(request.getDescricao())
                .dataInicio(request.getDataInicio())
                .dataFim(request.getDataFim())
                .tipo(request.getTipo())
                .status(DemandaStatus.PENDENTE)
                .observacoes(request.getObservacoes())
                .build();

        // Adicionar pratos à demanda
        for (DemandaPratoRequest pratoReq : request.getPratos()) {
            Prato prato = pratoRepository.findByIdAndDeletedFalse(pratoReq.getPratoId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Prato", pratoReq.getPratoId()));

            if (!prato.getAtivo()) {
                throw new RegraDeNegocioException("Prato '" + prato.getNome() + "' está inativo");
            }

            DemandaPrato demandaPrato = DemandaPrato.builder()
                    .demanda(demanda)
                    .prato(prato)
                    .quantidade(pratoReq.getQuantidade())
                    .observacoes(pratoReq.getObservacoes())
                    .build();

            demanda.getDemandaPratos().add(demandaPrato);
        }

        demanda = demandaRepository.save(demanda);
        log.info("Demanda criada: '{}' (ID: {})", demanda.getTitulo(), demanda.getId());
        return toResponse(demanda);
    }

    /**
     * ==========================================================
     * PRINCIPAL REGRA DE NEGÓCIO DO GASTROCONTROL
     * ==========================================================
     *
     * Processa a demanda executando o fluxo completo:
     * 1. Calcula ingredientes necessários (ficha técnica × quantidade de porções)
     * 2. Consolida ingredientes duplicados entre pratos
     * 3. Verifica estoque disponível por ingrediente (FEFO)
     * 4. Calcula déficit (necessário - disponível)
     * 5. Gera lista de compras automática para itens com déficit
     * 6. Atualiza status da demanda para PROCESSADA
     */
    @Transactional
    public ResultadoProcessamentoDemanda processarDemanda(Long demandaId) {
        Demanda demanda = buscarEntidade(demandaId);

        if (!demanda.isPendente()) {
            throw new RegraDeNegocioException(
                    "Demanda já foi processada. Status atual: " + demanda.getStatus());
        }

        log.info("Iniciando processamento da demanda ID: {}", demandaId);

        // PASSO 1: Calcular ingredientes necessários por prato
        Map<Long, NecessidadeIngrediente> necessidades = calcularNecessidades(demanda);

        log.debug("Ingredientes calculados: {} tipos distintos", necessidades.size());

        // PASSO 2: Verificar estoque e calcular déficit para cada ingrediente
        List<ItemDeficit> itensComDeficit = new ArrayList<>();

        for (NecessidadeIngrediente necessidade : necessidades.values()) {
            BigDecimal qtdDisponivel = estoqueRepository
                    .sumQtdDisponivelByIngredienteId(necessidade.getIngredienteId());

            BigDecimal deficit = necessidade.getQtdNecessaria().subtract(qtdDisponivel);

            if (deficit.compareTo(BigDecimal.ZERO) > 0) {
                itensComDeficit.add(new ItemDeficit(
                        necessidade.getIngredienteId(),
                        necessidade.getIngredienteNome(),
                        necessidade.getUnidade(),
                        necessidade.getQtdNecessaria(),
                        qtdDisponivel,
                        deficit,
                        necessidade.getFornecedorSugerido()
                ));
                log.warn("Déficit detectado: {} - necessário: {}, disponível: {}, déficit: {}",
                        necessidade.getIngredienteNome(),
                        necessidade.getQtdNecessaria(),
                        qtdDisponivel, deficit);
            }
        }

        // PASSO 3: Gerar lista de compras automática se houver déficits
        ListaCompras listaCompras = null;
        if (!itensComDeficit.isEmpty()) {
            listaCompras = gerarListaComprasAutomatica(demanda, itensComDeficit);
            log.info("Lista de compras gerada automaticamente - {} itens", itensComDeficit.size());
        }

        // PASSO 4: Atualizar status da demanda
        String usuarioAtual = obterUsuarioAtual();
        demanda.setStatus(DemandaStatus.PROCESSADA);
        demanda.setProcessadoEm(LocalDateTime.now());
        demanda.setProcessadoPor(usuarioAtual);
        demandaRepository.save(demanda);

        log.info("Demanda {} processada com sucesso. Déficits: {}", demandaId, itensComDeficit.size());

        return ResultadoProcessamentoDemanda.builder()
                .demandaId(demandaId)
                .totalIngredientes(necessidades.size())
                .totalItensComDeficit(itensComDeficit.size())
                .itensComDeficit(itensComDeficit)
                .listaComprasId(listaCompras != null ? listaCompras.getId() : null)
                .listaComprasGerada(listaCompras != null)
                .necessidades(new ArrayList<>(necessidades.values()))
                .build();
    }

    /**
     * Finaliza a demanda realizando baixa automática no estoque (FEFO).
     */
    @Transactional
    public DemandaResponse finalizarDemanda(Long demandaId) {
        Demanda demanda = buscarEntidade(demandaId);

        if (!demanda.isProcessada()) {
            throw new RegraDeNegocioException(
                    "Demanda deve estar PROCESSADA antes de ser finalizada. Status atual: " + demanda.getStatus());
        }

        // Calcular necessidades e realizar baixa no estoque
        Map<Long, NecessidadeIngrediente> necessidades = calcularNecessidades(demanda);
        String usuarioAtual = obterUsuarioAtual();

        for (NecessidadeIngrediente necessidade : necessidades.values()) {
            realizarBaixaEstoqueFEFO(necessidade, demandaId, usuarioAtual);
        }

        demanda.setStatus(DemandaStatus.FINALIZADA);
        demanda.setProcessadoEm(LocalDateTime.now());
        demandaRepository.save(demanda);

        log.info("Demanda {} finalizada. Baixas de estoque realizadas.", demandaId);
        return toResponse(demanda);
    }

    @Transactional
    public void cancelar(Long id) {
        Demanda demanda = buscarEntidade(id);
        if (DemandaStatus.FINALIZADA.equals(demanda.getStatus())) {
            throw new RegraDeNegocioException("Demanda já finalizada não pode ser cancelada");
        }
        demanda.setStatus(DemandaStatus.CANCELADA);
        demandaRepository.save(demanda);
    }

    // ====================================================
    // MÉTODOS PRIVADOS - LÓGICA CENTRAL
    // ====================================================

    /**
     * Calcula os ingredientes necessários para todos os pratos da demanda.
     * Consolida ingredientes repetidos somando as quantidades.
     */
    private Map<Long, NecessidadeIngrediente> calcularNecessidades(Demanda demanda) {
        Map<Long, NecessidadeIngrediente> necessidades = new HashMap<>();

        for (DemandaPrato demandaPrato : demanda.getDemandaPratos()) {
            Prato prato = demandaPrato.getPrato();
            int quantidade = demandaPrato.getQuantidade();

            List<FichaTecnica> fichas = fichaTecnicaRepository
                    .findAllByPratoIdWithIngrediente(prato.getId());

            for (FichaTecnica ficha : fichas) {
                Long ingredienteId = ficha.getIngrediente().getId();

                // Quantidade necessária = qtd_bruta (com fator de correção) × quantidade de porções
                BigDecimal qtdNecessaria = ficha.getQtdBruta()
                        .multiply(BigDecimal.valueOf(quantidade));

                // Consolidar: se ingrediente já existe, somar quantidade
                necessidades.merge(ingredienteId,
                        new NecessidadeIngrediente(
                                ingredienteId,
                                ficha.getIngrediente().getNome(),
                                ficha.getUnidade(),
                                qtdNecessaria,
                                ficha.getIngrediente().getCustoUnitario(),
                                ficha.getIngrediente().getFornecedor()
                        ),
                        (existing, novo) -> {
                            existing.setQtdNecessaria(
                                    existing.getQtdNecessaria().add(novo.getQtdNecessaria())
                            );
                            return existing;
                        });
            }
        }

        return necessidades;
    }

    /**
     * Gera lista de compras automática para itens com déficit.
     */
    private ListaCompras gerarListaComprasAutomatica(Demanda demanda, List<ItemDeficit> itensComDeficit) {
        ListaCompras lista = ListaCompras.builder()
                .titulo("Compras - " + demanda.getTitulo())
                .descricao("Lista gerada automaticamente ao processar demanda: " + demanda.getId())
                .dataCriacao(LocalDate.now())
                .status(ListaComprasStatus.ABERTA)
                .demanda(demanda)
                .build();

        lista = listaComprasRepository.save(lista);

        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemDeficit deficit : itensComDeficit) {
            Ingrediente ingrediente = new Ingrediente();
            ingrediente.setId(deficit.getIngredienteId());

            // Buscar custo unitário atual
            BigDecimal custoUnitario = estoqueRepository
                    .findAllByIngredienteId(deficit.getIngredienteId())
                    .stream()
                    .filter(e -> e.getCustoLote() != null)
                    .map(Estoque::getCustoLote)
                    .findFirst()
                    .orElse(BigDecimal.ZERO);

            BigDecimal valorItem = deficit.getDeficit().multiply(custoUnitario);

            ItemCompra item = ItemCompra.builder()
                    .listaCompras(lista)
                    .ingrediente(buscarIngredienteRef(deficit.getIngredienteId()))
                    .quantidade(deficit.getDeficit())
                    .unidade(deficit.getUnidade())
                    .valorUnitario(custoUnitario)
                    .valorTotal(valorItem)
                    .qtdEstoqueAtual(deficit.getQtdDisponivel())
                    .qtdNecessaria(deficit.getQtdNecessaria())
                    .deficit(deficit.getDeficit())
                    .fornecedorSugerido(deficit.getFornecedorSugerido())
                    .build();

            itemCompraRepository.save(item);
            valorTotal = valorTotal.add(valorItem);
        }

        lista.setValorTotal(valorTotal);
        return listaComprasRepository.save(lista);
    }

    /**
     * Realiza baixa no estoque seguindo FEFO (First Expired, First Out).
     */
    private void realizarBaixaEstoqueFEFO(NecessidadeIngrediente necessidade,
                                           Long demandaId, String usuarioAtual) {
        BigDecimal qtdRestante = necessidade.getQtdNecessaria();
        List<Estoque> lotes = estoqueRepository.findByIngredienteIdFEFO(necessidade.getIngredienteId());

        for (Estoque lote : lotes) {
            if (qtdRestante.compareTo(BigDecimal.ZERO) <= 0) break;

            BigDecimal qtdBaixar = qtdRestante.min(lote.getQtdDisponivel());
            BigDecimal qtdAnterior = lote.getQtdDisponivel();

            lote.setQtdDisponivel(lote.getQtdDisponivel().subtract(qtdBaixar));
            estoqueRepository.save(lote);

            // Registrar movimentação auditável
            MovimentacaoEstoque mov = MovimentacaoEstoque.builder()
                    .estoque(lote)
                    .tipo(MovimentacaoTipo.PRODUCAO)
                    .quantidade(qtdBaixar)
                    .qtdAnterior(qtdAnterior)
                    .qtdPosterior(lote.getQtdDisponivel())
                    .motivo("Baixa automática - Demanda ID: " + demandaId)
                    .referenciaId(demandaId)
                    .referenciaTipo("DEMANDA")
                    .createdBy(usuarioAtual)
                    .build();

            movimentacaoRepository.save(mov);
            qtdRestante = qtdRestante.subtract(qtdBaixar);
        }

        if (qtdRestante.compareTo(BigDecimal.ZERO) > 0) {
            log.warn("Estoque insuficiente para ingrediente ID {}. Falta: {}",
                    necessidade.getIngredienteId(), qtdRestante);
        }
    }

    private Ingrediente buscarIngredienteRef(Long id) {
        Ingrediente i = new Ingrediente();
        i.setId(id);
        return i;
    }

    private String obterUsuarioAtual() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "SYSTEM";
    }

    public Demanda buscarEntidade(Long id) {
        return demandaRepository.findByIdWithPratos(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Demanda", id));
    }

    private DemandaResponse toResponse(Demanda d) {
        DemandaResponse resp = new DemandaResponse();
        resp.setId(d.getId());
        resp.setTitulo(d.getTitulo());
        resp.setDescricao(d.getDescricao());
        resp.setDataInicio(d.getDataInicio());
        resp.setDataFim(d.getDataFim());
        resp.setTipo(d.getTipo());
        resp.setStatus(d.getStatus());
        resp.setObservacoes(d.getObservacoes());
        resp.setProcessadoEm(d.getProcessadoEm());
        resp.setProcessadoPor(d.getProcessadoPor());
        resp.setCreatedAt(d.getCreatedAt());
        resp.setUpdatedAt(d.getUpdatedAt());
        resp.setCreatedBy(d.getCreatedBy());

        List<DemandaPratoResponse> pratoResps = d.getDemandaPratos().stream().map(dp -> {
            DemandaPratoResponse pr = new DemandaPratoResponse();
            pr.setId(dp.getId());
            pr.setPratoId(dp.getPrato().getId());
            pr.setPratoNome(dp.getPrato().getNome());
            pr.setPratoCategoria(dp.getPrato().getCategoria().name());
            pr.setQuantidade(dp.getQuantidade());
            pr.setObservacoes(dp.getObservacoes());
            return pr;
        }).collect(Collectors.toList());

        resp.setPratos(pratoResps);
        resp.setTotalPratos(pratoResps.size());
        return resp;
    }
}
