package com.gastrocontrol.service;

import com.gastrocontrol.domain.entity.Estoque;
import com.gastrocontrol.domain.entity.Ingrediente;
import com.gastrocontrol.domain.entity.HistoricoPrecoIngrediente;
import com.gastrocontrol.dto.ingrediente.IngredienteRequest;
import com.gastrocontrol.dto.ingrediente.IngredienteResponse;
import com.gastrocontrol.exception.ConflitoException;
import com.gastrocontrol.exception.RecursoNaoEncontradoException;
import com.gastrocontrol.exception.RegraDeNegocioException;
import com.gastrocontrol.repository.EstoqueRepository;
import com.gastrocontrol.repository.FichaTecnicaRepository;
import com.gastrocontrol.repository.HistoricoPrecoIngredienteRepository;
import com.gastrocontrol.repository.IngredienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Serviço responsável pelo CRUD e lógica de negócio de ingredientes.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class IngredienteService {

    private final IngredienteRepository ingredienteRepository;
    private final EstoqueRepository estoqueRepository;
    private final FichaTecnicaRepository fichaTecnicaRepository;
    private final HistoricoPrecoIngredienteRepository historicoPrecoRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "ingredientes", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<IngredienteResponse> listarTodos(Pageable pageable) {
        return ingredienteRepository.findAllByDeletedFalse(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<IngredienteResponse> listarAtivos(Pageable pageable) {
        return ingredienteRepository.findAllByAtivoTrueAndDeletedFalse(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public IngredienteResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public Page<IngredienteResponse> buscarPorNome(String nome, Pageable pageable) {
        return ingredienteRepository.searchByNome(nome, pageable).map(this::toResponse);
    }

    @Transactional
    @CacheEvict(value = "ingredientes", allEntries = true)
    public IngredienteResponse criar(IngredienteRequest request) {
        if (ingredienteRepository.existsByNomeAndDeletedFalse(request.getNome())) {
            throw new ConflitoException("Ingrediente já cadastrado com o nome: " + request.getNome());
        }

        Ingrediente ingrediente = Ingrediente.builder()
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .unidadeMedida(request.getUnidadeMedida())
                .custoUnitario(request.getCustoUnitario())
                .fornecedor(request.getFornecedor())
                .categoriaRisco(request.getCategoriaRisco())
                .codigoInterno(request.getCodigoInterno())
                .build();

        ingrediente = ingredienteRepository.save(ingrediente);
        log.info("Ingrediente criado: {} (ID: {})", ingrediente.getNome(), ingrediente.getId());
        return toResponse(ingrediente);
    }

    @Transactional
    @CacheEvict(value = "ingredientes", allEntries = true)
    public IngredienteResponse atualizar(Long id, IngredienteRequest request) {
        Ingrediente ingrediente = buscarEntidade(id);

        // Registrar histórico se custo mudou
        if (!ingrediente.getCustoUnitario().equals(request.getCustoUnitario())) {
            registrarHistoricoPreco(ingrediente, request.getCustoUnitario());
        }

        ingrediente.setNome(request.getNome());
        ingrediente.setDescricao(request.getDescricao());
        ingrediente.setUnidadeMedida(request.getUnidadeMedida());
        ingrediente.setCustoUnitario(request.getCustoUnitario());
        ingrediente.setFornecedor(request.getFornecedor());
        ingrediente.setCategoriaRisco(request.getCategoriaRisco());
        ingrediente.setCodigoInterno(request.getCodigoInterno());

        ingrediente = ingredienteRepository.save(ingrediente);
        log.info("Ingrediente atualizado: {} (ID: {})", ingrediente.getNome(), id);
        return toResponse(ingrediente);
    }

    @Transactional
    @CacheEvict(value = "ingredientes", allEntries = true)
    public void deletar(Long id) {
        Ingrediente ingrediente = buscarEntidade(id);

        // Verificar se ingrediente está sendo usado em fichas técnicas
        long fichasUso = fichaTecnicaRepository.countByIngredienteId(id);
        if (fichasUso > 0) {
            throw new RegraDeNegocioException(
                    "Não é possível excluir: ingrediente está em uso em " + fichasUso + " ficha(s) técnica(s). " +
                    "Inative o ingrediente ao invés de excluir.");
        }

        ingrediente.softDelete();
        ingredienteRepository.save(ingrediente);
        log.info("Ingrediente removido (soft delete): {}", id);
    }

    @Transactional
    @CacheEvict(value = "ingredientes", allEntries = true)
    public IngredienteResponse alterarStatus(Long id, boolean ativo) {
        Ingrediente ingrediente = buscarEntidade(id);
        ingrediente.setAtivo(ativo);
        return toResponse(ingredienteRepository.save(ingrediente));
    }

    public Ingrediente buscarEntidade(Long id) {
        return ingredienteRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Ingrediente", id));
    }

    private void registrarHistoricoPreco(Ingrediente ingrediente, BigDecimal novoCusto) {
        String usuarioAtual = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : "SYSTEM";

        HistoricoPrecoIngrediente historico = HistoricoPrecoIngrediente.builder()
                .ingrediente(ingrediente)
                .custoAnterior(ingrediente.getCustoUnitario())
                .custoNovo(novoCusto)
                .dataAlteracao(LocalDateTime.now())
                .alteradoPor(usuarioAtual)
                .build();

        historicoPrecoRepository.save(historico);
    }

    private IngredienteResponse toResponse(Ingrediente i) {
        IngredienteResponse resp = new IngredienteResponse();
        resp.setId(i.getId());
        resp.setNome(i.getNome());
        resp.setDescricao(i.getDescricao());
        resp.setUnidadeMedida(i.getUnidadeMedida());
        resp.setCustoUnitario(i.getCustoUnitario());
        resp.setFornecedor(i.getFornecedor());
        resp.setCategoriaRisco(i.getCategoriaRisco());
        resp.setCodigoInterno(i.getCodigoInterno());
        resp.setAtivo(i.getAtivo());
        resp.setCreatedAt(i.getCreatedAt());
        resp.setUpdatedAt(i.getUpdatedAt());
        resp.setCreatedBy(i.getCreatedBy());

        // Estoque total
        BigDecimal qtdTotal = estoqueRepository.sumQtdDisponivelByIngredienteId(i.getId());
        resp.setQtdEstoqueTotal(qtdTotal);

        // Verificar se estoque está baixo
        boolean estoqueBaixo = estoqueRepository.findAllByIngredienteId(i.getId())
                .stream().anyMatch(Estoque::isEstoqueBaixo);
        resp.setEstoqueBaixo(estoqueBaixo);

        return resp;
    }
}
