package com.gastrocontrol.dto.dashboard;

import com.gastrocontrol.dto.estoque.EstoqueAlertaResponse;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardResponse {

    // Resumo geral
    private Long totalPratos;
    private Long pratosSemFichaTecnica;
    private Long totalIngredientes;
    private Long ingredientesAtivos;

    // Estoque
    private Long totalItensEstoque;
    private Long itensEstoqueBaixo;
    private Long itensVencendo;
    private Long itensVencidos;

    // Demandas
    private Long demandasPendentes;
    private Long demandasProcessadas;
    private Long demandasFinalizadas;
    private Long demandasMes;

    // Financeiro
    private BigDecimal valorTotalComprasMes;
    private BigDecimal custoMedioPorPrato;

    // Alertas
    private List<EstoqueAlertaResponse> alertasEstoqueBaixo;
    private List<EstoqueAlertaResponse> alertasVencimento;
    private List<String> alertasGerais;
}
