package com.gastrocontrol.service;

import com.gastrocontrol.domain.entity.Estoque;
import com.gastrocontrol.domain.entity.Ingrediente;
import com.gastrocontrol.domain.entity.MovimentacaoEstoque;
import com.gastrocontrol.domain.enums.MovimentacaoTipo;
import com.gastrocontrol.dto.estoque.*;
import com.gastrocontrol.exception.RecursoNaoEncontradoException;
import com.gastrocontrol.exception.RegraDeNegocioException;
import com.gastrocontrol.repository.EstoqueRepository;
import com.gastrocontrol.repository.MovimentacaoEstoqueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço de gestão de estoque com controle FEFO e alertas automáticos.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EstoqueService {

    private final EstoqueRepository estoqueRepository;
    private final MovimentacaoEstoqueRepository movimentacaoRepository;
    private final IngredienteService ingredienteService;

    @Transactional(readOnly = true)
    public Page<EstoqueResponse> listarTodos(Pageable pageable) {
        return estoqueRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public EstoqueResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public List<EstoqueResponse> buscarPorIngrediente(Long ingredienteId) {
        return estoqueRepository.findAllByIngredienteId(ingredienteId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EstoqueAlertaResponse> alertasEstoqueBaixo() {
        return estoqueRepository.findEstoquesBaixos()
                .stream().map(this::toAlertaResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EstoqueAlertaResponse> alertasVencimento(int diasAntecedencia) {
        LocalDate dataLimite = LocalDate.now().plusDays(diasAntecedencia);
        return estoqueRepository.findVencendoAte(dataLimite)
                .stream().map(this::toAlertaResponse).collect(Collectors.toList());
    }

    @Transactional
    public EstoqueResponse adicionarEstoque(EstoqueRequest request) {
        Ingrediente ingrediente = ingredienteService.buscarEntidade(request.getIngredienteId());

        Estoque estoque = Estoque.builder()
                .ingrediente(ingrediente)
                .qtdDisponivel(request.getQtdDisponivel())
                .qtdMinima(request.getQtdMinima() != null ? request.getQtdMinima() : BigDecimal.ZERO)
                .qtdMaxima(request.getQtdMaxima())
                .dataValidade(request.getDataValidade())
                .lote(request.getLote())
                .localizacao(request.getLocalizacao())
                .custoLote(request.getCustoLote())
                .build();

        estoque = estoqueRepository.save(estoque);

        // Registrar movimentação de entrada
        registrarMovimentacao(estoque, MovimentacaoTipo.ENTRADA,
                request.getQtdDisponivel(), BigDecimal.ZERO,
                "Entrada inicial de estoque - Lote: " + request.getLote(), null, null);

        log.info("Estoque adicionado: {} - Lote: {}, Qtd: {}",
                ingrediente.getNome(), request.getLote(), request.getQtdDisponivel());

        return toResponse(estoque);
    }

    @Transactional
    public EstoqueResponse registrarMovimento(Long estoqueId, MovimentacaoRequest request) {
        Estoque estoque = buscarEntidade(estoqueId);
        BigDecimal qtdAnterior = estoque.getQtdDisponivel();

        switch (request.getTipo()) {
            case ENTRADA -> estoque.setQtdDisponivel(qtdAnterior.add(request.getQuantidade()));
            case SAIDA, PRODUCAO, DESCARTE -> {
                if (request.getQuantidade().compareTo(qtdAnterior) > 0) {
                    throw new RegraDeNegocioException(
                            "Quantidade para saída (" + request.getQuantidade() +
                            ") maior que disponível (" + qtdAnterior + ")");
                }
                estoque.setQtdDisponivel(qtdAnterior.subtract(request.getQuantidade()));
            }
            case AJUSTE -> estoque.setQtdDisponivel(request.getQuantidade());
        }

        estoque = estoqueRepository.save(estoque);

        registrarMovimentacao(estoque, request.getTipo(), request.getQuantidade(),
                qtdAnterior, request.getMotivo(), null, null);

        log.info("Movimentação registrada: {} - Tipo: {}, Qtd: {}",
                estoque.getIngrediente().getNome(), request.getTipo(), request.getQuantidade());

        return toResponse(estoque);
    }

    private void registrarMovimentacao(Estoque estoque, MovimentacaoTipo tipo,
                                        BigDecimal quantidade, BigDecimal qtdAnterior,
                                        String motivo, Long referenciaId, String referenciaTipo) {
        String usuario = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : "SYSTEM";

        MovimentacaoEstoque mov = MovimentacaoEstoque.builder()
                .estoque(estoque)
                .tipo(tipo)
                .quantidade(quantidade)
                .qtdAnterior(qtdAnterior)
                .qtdPosterior(estoque.getQtdDisponivel())
                .motivo(motivo)
                .referenciaId(referenciaId)
                .referenciaTipo(referenciaTipo)
                .createdBy(usuario)
                .build();

        movimentacaoRepository.save(mov);
    }

    public Estoque buscarEntidade(Long id) {
        return estoqueRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Estoque", id));
    }

    private EstoqueResponse toResponse(Estoque e) {
        EstoqueResponse resp = new EstoqueResponse();
        resp.setId(e.getId());
        resp.setIngredienteId(e.getIngrediente().getId());
        resp.setIngredienteNome(e.getIngrediente().getNome());
        resp.setUnidadeMedida(e.getIngrediente().getUnidadeMedida());
        resp.setQtdDisponivel(e.getQtdDisponivel());
        resp.setQtdReservada(e.getQtdReservada());
        resp.setQtdMinima(e.getQtdMinima());
        resp.setQtdReal(e.getQtdReal());
        resp.setDataValidade(e.getDataValidade());
        resp.setLote(e.getLote());
        resp.setLocalizacao(e.getLocalizacao());
        resp.setEstoqueBaixo(e.isEstoqueBaixo());
        resp.setVencido(e.isVencido());
        resp.setVencendoEm7Dias(e.isVencendoEm(7));
        resp.setCreatedAt(e.getCreatedAt());
        return resp;
    }

    private EstoqueAlertaResponse toAlertaResponse(Estoque e) {
        EstoqueAlertaResponse resp = new EstoqueAlertaResponse();
        resp.setEstoqueId(e.getId());
        resp.setIngredienteId(e.getIngrediente().getId());
        resp.setIngredienteNome(e.getIngrediente().getNome());
        resp.setCategoriaRisco(e.getIngrediente().getCategoriaRisco());
        resp.setQtdDisponivel(e.getQtdDisponivel());
        resp.setQtdMinima(e.getQtdMinima());
        resp.setDataValidade(e.getDataValidade());
        resp.setLote(e.getLote());
        resp.setEstoqueBaixo(e.isEstoqueBaixo());
        resp.setVencido(e.isVencido());
        resp.setVencendoEm7Dias(e.isVencendoEm(7));
        return resp;
    }
}
