package com.gastrocontrol.controller;

import com.gastrocontrol.dto.common.ApiResponse;
import com.gastrocontrol.service.DashboardService;
import com.gastrocontrol.dto.dashboard.DashboardResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "KPIs e métricas gerais do restaurante")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Dashboard geral",
               description = "Retorna todos os KPIs e métricas consolidadas do restaurante")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.sucesso(dashboardService.getDashboard()));
    }
}
