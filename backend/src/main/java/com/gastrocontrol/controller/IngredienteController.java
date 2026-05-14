package com.gastrocontrol.controller;

import com.gastrocontrol.dto.common.ApiResponse;
import com.gastrocontrol.dto.ingrediente.IngredienteRequest;
import com.gastrocontrol.dto.ingrediente.IngredienteResponse;
import com.gastrocontrol.service.IngredienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST para gerenciamento de ingredientes.
 */
@RestController
@RequestMapping("/ingredientes")
@RequiredArgsConstructor
@Tag(name = "Ingredientes", description = "CRUD e gestão de ingredientes/insumos")
public class IngredienteController {

    private final IngredienteService ingredienteService;

    @GetMapping
    @Operation(summary = "Listar ingredientes", description = "Lista todos os ingredientes com paginação")
    public ResponseEntity<ApiResponse<Page<IngredienteResponse>>> listar(
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(required = false) boolean apenasAtivos) {

        Page<IngredienteResponse> ingredientes = apenasAtivos
                ? ingredienteService.listarAtivos(pageable)
                : ingredienteService.listarTodos(pageable);

        return ResponseEntity.ok(ApiResponse.sucesso(ingredientes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar por ID")
    public ResponseEntity<ApiResponse<IngredienteResponse>> buscarPorId(
            @Parameter(description = "ID do ingrediente") @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.sucesso(ingredienteService.buscarPorId(id)));
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar por nome", description = "Busca ingredientes por nome (fulltext)")
    public ResponseEntity<ApiResponse<Page<IngredienteResponse>>> buscarPorNome(
            @RequestParam String nome,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(ingredienteService.buscarPorNome(nome, pageable)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar ingrediente")
    public ResponseEntity<ApiResponse<IngredienteResponse>> criar(
            @Valid @RequestBody IngredienteRequest request) {
        IngredienteResponse response = ingredienteService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.criado(response, "Ingrediente criado com sucesso"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar ingrediente")
    public ResponseEntity<ApiResponse<IngredienteResponse>> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody IngredienteRequest request) {
        return ResponseEntity.ok(ApiResponse.sucesso(
                ingredienteService.atualizar(id, request), "Ingrediente atualizado com sucesso"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remover ingrediente (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deletar(@PathVariable Long id) {
        ingredienteService.deletar(id);
        return ResponseEntity.ok(ApiResponse.semConteudo());
    }

    @PatchMapping("/{id}/ativar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ativar ingrediente")
    public ResponseEntity<ApiResponse<IngredienteResponse>> ativar(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.sucesso(
                ingredienteService.alterarStatus(id, true), "Ingrediente ativado"));
    }

    @PatchMapping("/{id}/inativar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Inativar ingrediente")
    public ResponseEntity<ApiResponse<IngredienteResponse>> inativar(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.sucesso(
                ingredienteService.alterarStatus(id, false), "Ingrediente inativado"));
    }
}
