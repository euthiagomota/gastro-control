package com.gastrocontrol.controller;

import com.gastrocontrol.domain.enums.DemandaStatus;
import com.gastrocontrol.dto.common.ApiResponse;
import com.gastrocontrol.dto.demanda.DemandaRequest;
import com.gastrocontrol.dto.demanda.DemandaResponse;
import com.gastrocontrol.service.DemandaService;
import com.gastrocontrol.service.ResultadoProcessamentoDemanda;
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
import org.springframework.web.bind.annotation.*;

/**
 * Controller do módulo de Demandas - núcleo do GastroControl.
 * Expõe o fluxo principal: criação → processamento → finalização.
 */
@RestController
@RequestMapping("/demandas")
@RequiredArgsConstructor
@Tag(name = "Demandas", description = "Planejamento de produção - fluxo principal do GastroControl")
public class DemandaController {

    private final DemandaService demandaService;

    @GetMapping
    @Operation(summary = "Listar demandas", description = "Lista todas as demandas com filtro por status")
    public ResponseEntity<ApiResponse<Page<DemandaResponse>>> listar(
            @PageableDefault(size = 20, sort = "dataInicio", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) DemandaStatus status) {

        Page<DemandaResponse> demandas = status != null
                ? demandaService.listarPorStatus(status, pageable)
                : demandaService.listarTodas(pageable);

        return ResponseEntity.ok(ApiResponse.sucesso(demandas));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar demanda por ID")
    public ResponseEntity<ApiResponse<DemandaResponse>> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.sucesso(demandaService.buscarPorId(id)));
    }

    @PostMapping
    @Operation(summary = "Criar demanda",
               description = "Cria uma nova previsão de produção com pratos e quantidades")
    public ResponseEntity<ApiResponse<DemandaResponse>> criar(
            @Valid @RequestBody DemandaRequest request) {
        DemandaResponse demanda = demandaService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.criado(demanda, "Demanda criada com sucesso"));
    }

    @PostMapping("/{id}/processar")
    @Operation(
        summary = "Processar demanda",
        description = """
            **Regra de negócio principal do GastroControl.**
            
            Ao processar uma demanda:
            1. Calcula ingredientes necessários (ficha técnica × quantidade)
            2. Consolida ingredientes repetidos entre pratos
            3. Verifica estoque disponível (FEFO)
            4. Calcula déficit por ingrediente
            5. Gera lista de compras automática para itens com déficit
            """
    )
    public ResponseEntity<ApiResponse<ResultadoProcessamentoDemanda>> processar(
            @PathVariable Long id) {
        ResultadoProcessamentoDemanda resultado = demandaService.processarDemanda(id);
        return ResponseEntity.ok(ApiResponse.sucesso(resultado,
                "Demanda processada! " +
                resultado.getTotalItensComDeficit() + " itens com déficit. " +
                (resultado.isListaComprasGerada() ? "Lista de compras gerada automaticamente." : "")));
    }

    @PostMapping("/{id}/finalizar")
    @Operation(
        summary = "Finalizar demanda",
        description = "Finaliza a demanda realizando baixa automática no estoque (FEFO)"
    )
    public ResponseEntity<ApiResponse<DemandaResponse>> finalizar(@PathVariable Long id) {
        DemandaResponse demanda = demandaService.finalizarDemanda(id);
        return ResponseEntity.ok(ApiResponse.sucesso(demanda,
                "Demanda finalizada. Estoque atualizado automaticamente."));
    }

    @PostMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar demanda")
    public ResponseEntity<ApiResponse<Void>> cancelar(@PathVariable Long id) {
        demandaService.cancelar(id);
        return ResponseEntity.ok(ApiResponse.semConteudo());
    }
}
