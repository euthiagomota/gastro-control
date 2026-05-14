package com.gastrocontrol.service;

import com.gastrocontrol.domain.enums.DemandaStatus;
import com.gastrocontrol.dto.dashboard.DashboardResponse;
import com.gastrocontrol.dto.estoque.EstoqueAlertaResponse;
import com.gastrocontrol.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Serviço do Dashboard - agrega KPIs de todos os módulos.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final PratoRepository pratoRepository;
    private final IngredienteRepository ingredienteRepository;
    private final EstoqueRepository estoqueRepository;
    private final DemandaRepository demandaRepository;
    private final ListaComprasRepository listaComprasRepository;
    private final EstoqueService estoqueService;

    @Transactional(readOnly = true)
    @Cacheable(value = "dashboard", key = "'geral'")
    public DashboardResponse getDashboard() {
        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = hoje.withDayOfMonth(1);

        // Alertas de estoque
        List<EstoqueAlertaResponse> alertasEstoqueBaixo = estoqueService.alertasEstoqueBaixo();
        List<EstoqueAlertaResponse> alertasVencimento = estoqueService.alertasVencimento(7);

        // Gerar alertas textuais
        List<String> alertasGerais = new ArrayList<>();
        if (!alertasEstoqueBaixo.isEmpty()) {
            alertasGerais.add("⚠️ " + alertasEstoqueBaixo.size() + " ingrediente(s) com estoque abaixo do mínimo");
        }
        if (!alertasVencimento.isEmpty()) {
            alertasGerais.add("🗓️ " + alertasVencimento.size() + " lote(s) vencendo em 7 dias");
        }
        long demandasPendentes = demandaRepository.countByStatus(DemandaStatus.PENDENTE);
        if (demandasPendentes > 0) {
            alertasGerais.add("📋 " + demandasPendentes + " demanda(s) aguardando processamento");
        }

        // Valor de compras do mês
        BigDecimal comprasMes = listaComprasRepository.sumValorTotalByPeriodo(inicioMes, hoje);

        // Custo médio dos pratos
        BigDecimal custoMedio = pratoRepository.findAllByAtivoTrueAndDeletedFalse()
                .stream()
                .map(p -> p.getCustoTotal())
                .filter(c -> c.compareTo(BigDecimal.ZERO) > 0)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalPratosAtivos = pratoRepository.countAtivos();
        if (totalPratosAtivos > 0) {
            custoMedio = custoMedio.divide(BigDecimal.valueOf(totalPratosAtivos), 2, java.math.RoundingMode.HALF_UP);
        }

        return DashboardResponse.builder()
                .totalPratos(pratoRepository.countAtivos())
                .totalIngredientes(ingredienteRepository.count())
                .ingredientesAtivos(ingredienteRepository.countAtivos())
                .totalItensEstoque((long) estoqueRepository.findAll().size())
                .itensEstoqueBaixo((long) alertasEstoqueBaixo.size())
                .itensVencendo((long) alertasVencimento.size())
                .itensVencidos((long) estoqueRepository.findVencidos(hoje).size())
                .demandasPendentes(demandaRepository.countByStatus(DemandaStatus.PENDENTE))
                .demandasProcessadas(demandaRepository.countByStatus(DemandaStatus.PROCESSADA))
                .demandasFinalizadas(demandaRepository.countByStatus(DemandaStatus.FINALIZADA))
                .valorTotalComprasMes(comprasMes != null ? comprasMes : BigDecimal.ZERO)
                .custoMedioPorPrato(custoMedio)
                .alertasEstoqueBaixo(alertasEstoqueBaixo)
                .alertasVencimento(alertasVencimento)
                .alertasGerais(alertasGerais)
                .build();
    }
}
