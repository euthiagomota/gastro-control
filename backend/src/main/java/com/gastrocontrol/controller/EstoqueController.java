package com.gastrocontrol.controller;

import com.gastrocontrol.dto.common.ApiResponse;
import com.gastrocontrol.dto.estoque.*;
import com.gastrocontrol.service.EstoqueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estoque")
@RequiredArgsConstructor
@Tag(name = "Estoque", description = "Controle de estoque com FEFO e alertas automáticos")
public class EstoqueController {

    private final EstoqueService estoqueService;

    @GetMapping
    @Operation(summary = "Listar estoque com paginação")
    public ResponseEntity<ApiResponse<Page<EstoqueResponse>>> listar(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(estoqueService.listarTodos(pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar estoque por ID")
    public ResponseEntity<ApiResponse<EstoqueResponse>> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.sucesso(estoqueService.buscarPorId(id)));
    }

    @GetMapping("/ingrediente/{ingredienteId}")
    @Operation(summary = "Buscar todos os lotes de um ingrediente")
    public ResponseEntity<ApiResponse<List<EstoqueResponse>>> buscarPorIngrediente(
            @PathVariable Long ingredienteId) {
        return ResponseEntity.ok(ApiResponse.sucesso(estoqueService.buscarPorIngrediente(ingredienteId)));
    }

    @PostMapping
    @Operation(summary = "Adicionar entrada de estoque")
    public ResponseEntity<ApiResponse<EstoqueResponse>> adicionar(
            @Valid @RequestBody EstoqueRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.criado(estoqueService.adicionarEstoque(request),
                        "Estoque adicionado com sucesso"));
    }

    @PostMapping("/{id}/movimentacao")
    @Operation(summary = "Registrar movimentação de estoque",
               description = "Registra entrada, saída, ajuste ou descarte no estoque")
    public ResponseEntity<ApiResponse<EstoqueResponse>> registrarMovimento(
            @PathVariable Long id, @Valid @RequestBody MovimentacaoRequest request) {
        return ResponseEntity.ok(ApiResponse.sucesso(
                estoqueService.registrarMovimento(id, request),
                "Movimentação registrada com sucesso"));
    }

    @GetMapping("/alertas/estoque-baixo")
    @Operation(summary = "Alertas de estoque baixo",
               description = "Lista ingredientes com quantidade abaixo do mínimo")
    public ResponseEntity<ApiResponse<List<EstoqueAlertaResponse>>> alertasEstoqueBaixo() {
        return ResponseEntity.ok(ApiResponse.sucesso(estoqueService.alertasEstoqueBaixo()));
    }

    @GetMapping("/alertas/vencimento")
    @Operation(summary = "Alertas de vencimento",
               description = "Lista lotes próximos do vencimento (padrão: 7 dias)")
    public ResponseEntity<ApiResponse<List<EstoqueAlertaResponse>>> alertasVencimento(
            @RequestParam(defaultValue = "7") int diasAntecedencia) {
        return ResponseEntity.ok(ApiResponse.sucesso(
                estoqueService.alertasVencimento(diasAntecedencia)));
    }
}
