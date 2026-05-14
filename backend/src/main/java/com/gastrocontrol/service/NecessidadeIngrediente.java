package com.gastrocontrol.service;

import com.gastrocontrol.domain.enums.UnidadeMedida;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Representa a necessidade calculada de um ingrediente para uma demanda.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NecessidadeIngrediente {
    private Long ingredienteId;
    private String ingredienteNome;
    private UnidadeMedida unidade;
    private BigDecimal qtdNecessaria;
    private BigDecimal custoUnitario;
    private String fornecedorSugerido;
}
