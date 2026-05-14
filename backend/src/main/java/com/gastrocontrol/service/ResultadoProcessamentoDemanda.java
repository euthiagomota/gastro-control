package com.gastrocontrol.service;

import com.gastrocontrol.domain.enums.UnidadeMedida;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Resultado do processamento de uma demanda.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultadoProcessamentoDemanda {

    private Long demandaId;
    private int totalIngredientes;
    private int totalItensComDeficit;
    private List<DemandaService.ItemDeficit> itensComDeficit;
    private List<DemandaService.NecessidadeIngrediente> necessidades;
    private Long listaComprasId;
    private boolean listaComprasGerada;
}
