package com.gastrocontrol.controller;

import com.gastrocontrol.dto.common.ApiResponse;
import com.gastrocontrol.dto.ficha.FichaTecnicaRequest;
import com.gastrocontrol.dto.ficha.FichaTecnicaResponse;
import com.gastrocontrol.dto.prato.PratoRequest;
import com.gastrocontrol.dto.prato.PratoResponse;
import com.gastrocontrol.service.PratoService;
import io.swagger.v3.oas.annotations.Operation;
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

import java.util.List;

/**
 * Controller REST para gerenciamento de pratos e fichas técnicas.
 */
@RestController
@RequestMapping("/pratos")
@RequiredArgsConstructor
@Tag(name = "Pratos", description = "Gerenciamento de pratos do cardápio e fichas técnicas")
public class PratoController {

    private final PratoService pratoService;

    @GetMapping
    @Operation(summary = "Listar pratos")
    public ResponseEntity<ApiResponse<Page<PratoResponse>>> listar(
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(required = false) boolean apenasAtivos) {

        Page<PratoResponse> pratos = apenasAtivos
                ? pratoService.listarAtivos(pageable)
                : pratoService.listarTodos(pageable);

        return ResponseEntity.ok(ApiResponse.sucesso(pratos));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar prato por ID")
    public ResponseEntity<ApiResponse<PratoResponse>> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.sucesso(pratoService.buscarPorId(id)));
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar pratos por nome")
    public ResponseEntity<ApiResponse<Page<PratoResponse>>> buscarPorNome(
            @RequestParam String nome,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(pratoService.buscarPorNome(nome, pageable)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar prato")
    public ResponseEntity<ApiResponse<PratoResponse>> criar(
            @Valid @RequestBody PratoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.criado(pratoService.criar(request), "Prato criado com sucesso"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar prato")
    public ResponseEntity<ApiResponse<PratoResponse>> atualizar(
            @PathVariable Long id, @Valid @RequestBody PratoRequest request) {
        return ResponseEntity.ok(ApiResponse.sucesso(
                pratoService.atualizar(id, request), "Prato atualizado com sucesso"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remover prato")
    public ResponseEntity<ApiResponse<Void>> deletar(@PathVariable Long id) {
        pratoService.deletar(id);
        return ResponseEntity.ok(ApiResponse.semConteudo());
    }

    @PatchMapping("/{id}/ativar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ativar prato")
    public ResponseEntity<ApiResponse<PratoResponse>> ativar(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.sucesso(pratoService.alterarStatus(id, true)));
    }

    @PatchMapping("/{id}/inativar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Inativar prato")
    public ResponseEntity<ApiResponse<PratoResponse>> inativar(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.sucesso(pratoService.alterarStatus(id, false)));
    }

    // ====================================================
    // FICHA TÉCNICA
    // ====================================================

    @GetMapping("/{id}/ficha-tecnica")
    @Operation(summary = "Listar ficha técnica", description = "Lista todos os ingredientes da ficha técnica do prato")
    public ResponseEntity<ApiResponse<List<FichaTecnicaResponse>>> listarFichaTecnica(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.sucesso(pratoService.listarFichasTecnicas(id)));
    }

    @PostMapping("/{id}/ficha-tecnica")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Adicionar ingrediente à ficha técnica")
    public ResponseEntity<ApiResponse<FichaTecnicaResponse>> adicionarIngrediente(
            @PathVariable Long id, @Valid @RequestBody FichaTecnicaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.criado(
                        pratoService.adicionarIngrediente(id, request),
                        "Ingrediente adicionado à ficha técnica"));
    }

    @PutMapping("/{id}/ficha-tecnica/{fichaId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar item da ficha técnica")
    public ResponseEntity<ApiResponse<FichaTecnicaResponse>> atualizarIngrediente(
            @PathVariable Long id, @PathVariable Long fichaId,
            @Valid @RequestBody FichaTecnicaRequest request) {
        return ResponseEntity.ok(ApiResponse.sucesso(
                pratoService.atualizarIngrediente(id, fichaId, request)));
    }

    @DeleteMapping("/{id}/ficha-tecnica/{fichaId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remover ingrediente da ficha técnica")
    public ResponseEntity<ApiResponse<Void>> removerIngrediente(
            @PathVariable Long id, @PathVariable Long fichaId) {
        pratoService.removerIngrediente(id, fichaId);
        return ResponseEntity.ok(ApiResponse.semConteudo());
    }
}
