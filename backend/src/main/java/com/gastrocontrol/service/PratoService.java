package com.gastrocontrol.service;

import com.gastrocontrol.domain.entity.FichaTecnica;
import com.gastrocontrol.domain.entity.Ingrediente;
import com.gastrocontrol.domain.entity.Prato;
import com.gastrocontrol.dto.ficha.FichaTecnicaRequest;
import com.gastrocontrol.dto.ficha.FichaTecnicaResponse;
import com.gastrocontrol.dto.prato.PratoRequest;
import com.gastrocontrol.dto.prato.PratoResponse;
import com.gastrocontrol.exception.ConflitoException;
import com.gastrocontrol.exception.RecursoNaoEncontradoException;
import com.gastrocontrol.exception.RegraDeNegocioException;
import com.gastrocontrol.repository.FichaTecnicaRepository;
import com.gastrocontrol.repository.PratoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço para gerenciamento de pratos e fichas técnicas.
 * Responsável pelo cálculo automático de custos baseado nas fichas técnicas.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PratoService {

    private final PratoRepository pratoRepository;
    private final FichaTecnicaRepository fichaTecnicaRepository;
    private final IngredienteService ingredienteService;

    @Transactional(readOnly = true)
    public Page<PratoResponse> listarTodos(Pageable pageable) {
        return pratoRepository.findAllByDeletedFalse(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<PratoResponse> listarAtivos(Pageable pageable) {
        return pratoRepository.findAllByAtivoTrueAndDeletedFalse(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public PratoResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public Page<PratoResponse> buscarPorNome(String nome, Pageable pageable) {
        return pratoRepository.searchByNome(nome, pageable).map(this::toResponse);
    }

    @Transactional
    public PratoResponse criar(PratoRequest request) {
        Prato prato = Prato.builder()
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .categoria(request.getCategoria())
                .precoVenda(request.getPrecoVenda())
                .tempoPreparo(request.getTempoPreparo())
                .porcoes(request.getPorcoes())
                .build();

        prato = pratoRepository.save(prato);
        log.info("Prato criado: {} (ID: {})", prato.getNome(), prato.getId());
        return toResponse(prato);
    }

    @Transactional
    public PratoResponse atualizar(Long id, PratoRequest request) {
        Prato prato = buscarEntidade(id);

        prato.setNome(request.getNome());
        prato.setDescricao(request.getDescricao());
        prato.setCategoria(request.getCategoria());
        prato.setPrecoVenda(request.getPrecoVenda());
        prato.setTempoPreparo(request.getTempoPreparo());
        prato.setPorcoes(request.getPorcoes());

        // Recalcular custo após atualização
        prato.recalcularCustoTotal();

        prato = pratoRepository.save(prato);
        return toResponse(prato);
    }

    @Transactional
    public void deletar(Long id) {
        Prato prato = buscarEntidade(id);
        prato.softDelete();
        pratoRepository.save(prato);
        log.info("Prato removido (soft delete): {}", id);
    }

    @Transactional
    public PratoResponse alterarStatus(Long id, boolean ativo) {
        Prato prato = buscarEntidade(id);
        prato.setAtivo(ativo);
        return toResponse(pratoRepository.save(prato));
    }

    // ====================================================
    // FICHA TÉCNICA
    // ====================================================

    @Transactional(readOnly = true)
    public List<FichaTecnicaResponse> listarFichasTecnicas(Long pratoId) {
        buscarEntidade(pratoId); // valida existência
        return fichaTecnicaRepository.findAllByPratoIdWithIngrediente(pratoId)
                .stream().map(this::toFichaResponse).collect(Collectors.toList());
    }

    @Transactional
    public FichaTecnicaResponse adicionarIngrediente(Long pratoId, FichaTecnicaRequest request) {
        Prato prato = buscarEntidade(pratoId);
        Ingrediente ingrediente = ingredienteService.buscarEntidade(request.getIngredienteId());

        if (fichaTecnicaRepository.existsByPratoIdAndIngredienteId(pratoId, request.getIngredienteId())) {
            throw new ConflitoException("Ingrediente já adicionado à ficha técnica deste prato");
        }

        FichaTecnica ficha = FichaTecnica.builder()
                .prato(prato)
                .ingrediente(ingrediente)
                .qtdPorPorcao(request.getQtdPorPorcao())
                .unidade(request.getUnidade())
                .fatorCorrecao(request.getFatorCorrecao() != null ? request.getFatorCorrecao() : BigDecimal.ONE)
                .observacoes(request.getObservacoes())
                .build();

        ficha = fichaTecnicaRepository.save(ficha);

        // Recalcular custo do prato
        recalcularCustoPrato(prato);

        log.info("Ingrediente '{}' adicionado ao prato '{}'", ingrediente.getNome(), prato.getNome());
        return toFichaResponse(ficha);
    }

    @Transactional
    public FichaTecnicaResponse atualizarIngrediente(Long pratoId, Long fichaId, FichaTecnicaRequest request) {
        Prato prato = buscarEntidade(pratoId);
        FichaTecnica ficha = fichaTecnicaRepository.findById(fichaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Item de ficha técnica", fichaId));

        if (!ficha.getPrato().getId().equals(pratoId)) {
            throw new RegraDeNegocioException("Item não pertence a este prato");
        }

        Ingrediente ingrediente = ingredienteService.buscarEntidade(request.getIngredienteId());

        ficha.setIngrediente(ingrediente);
        ficha.setQtdPorPorcao(request.getQtdPorPorcao());
        ficha.setUnidade(request.getUnidade());
        ficha.setFatorCorrecao(request.getFatorCorrecao() != null ? request.getFatorCorrecao() : BigDecimal.ONE);
        ficha.setObservacoes(request.getObservacoes());

        ficha = fichaTecnicaRepository.save(ficha);
        recalcularCustoPrato(prato);

        return toFichaResponse(ficha);
    }

    @Transactional
    public void removerIngrediente(Long pratoId, Long fichaId) {
        Prato prato = buscarEntidade(pratoId);
        FichaTecnica ficha = fichaTecnicaRepository.findById(fichaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Item de ficha técnica", fichaId));

        if (!ficha.getPrato().getId().equals(pratoId)) {
            throw new RegraDeNegocioException("Item não pertence a este prato");
        }

        fichaTecnicaRepository.delete(ficha);
        recalcularCustoPrato(prato);
    }

    private void recalcularCustoPrato(Prato prato) {
        List<FichaTecnica> fichas = fichaTecnicaRepository.findAllByPratoIdWithIngrediente(prato.getId());
        BigDecimal custoTotal = fichas.stream()
                .map(FichaTecnica::getCustoCalculado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        prato.setCustoTotal(custoTotal);
        if (prato.getPrecoVenda() != null && prato.getPrecoVenda().compareTo(BigDecimal.ZERO) > 0) {
            prato.recalcularCustoTotal();
        }
        pratoRepository.save(prato);
    }

    public Prato buscarEntidade(Long id) {
        return pratoRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Prato", id));
    }

    private PratoResponse toResponse(Prato p) {
        PratoResponse resp = new PratoResponse();
        resp.setId(p.getId());
        resp.setNome(p.getNome());
        resp.setDescricao(p.getDescricao());
        resp.setCustoTotal(p.getCustoTotal());
        resp.setPrecoVenda(p.getPrecoVenda());
        resp.setMargemLucro(p.getMargemLucro());
        resp.setCategoria(p.getCategoria());
        resp.setImagemUrl(p.getImagemUrl());
        resp.setTempoPreparo(p.getTempoPreparo());
        resp.setPorcoes(p.getPorcoes());
        resp.setAtivo(p.getAtivo());
        resp.setTotalIngredientes(p.getFichasTecnicas().size());
        resp.setCreatedAt(p.getCreatedAt());
        resp.setUpdatedAt(p.getUpdatedAt());
        return resp;
    }

    private FichaTecnicaResponse toFichaResponse(FichaTecnica ft) {
        FichaTecnicaResponse resp = new FichaTecnicaResponse();
        resp.setId(ft.getId());
        resp.setPratoId(ft.getPrato().getId());
        resp.setPratoNome(ft.getPrato().getNome());
        resp.setIngredienteId(ft.getIngrediente().getId());
        resp.setIngredienteNome(ft.getIngrediente().getNome());
        resp.setUnidade(ft.getUnidade());
        resp.setQtdPorPorcao(ft.getQtdPorPorcao());
        resp.setFatorCorrecao(ft.getFatorCorrecao());
        resp.setQtdBruta(ft.getQtdBruta());
        resp.setCustoUnitarioIngrediente(ft.getIngrediente().getCustoUnitario());
        resp.setCustoCalculado(ft.getCustoCalculado());
        resp.setObservacoes(ft.getObservacoes());
        return resp;
    }
}
