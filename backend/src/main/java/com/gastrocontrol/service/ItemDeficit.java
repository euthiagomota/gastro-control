package com.gastrocontrol.service;

import com.gastrocontrol.domain.enums.UnidadeMedida;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Representa um déficit de ingrediente detectado ao processar uma demanda.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDeficit {
    private Long ingredienteId;
    private String ingredienteNome;
    private UnidadeMedida unidade;
    private BigDecimal qtdNecessaria;
    private BigDecimal qtdDisponivel;
    private BigDecimal deficit;
    private String fornecedorSugerido;
}
