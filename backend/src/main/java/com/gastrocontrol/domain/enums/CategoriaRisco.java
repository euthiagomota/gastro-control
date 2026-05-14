package com.gastrocontrol.domain.enums;

/**
 * Categoria de risco de um ingrediente.
 * Define o nível de criticidade do ingrediente para operação do restaurante.
 */
public enum CategoriaRisco {
    BAIXO("Baixo Risco - Ingrediente facilmente substituível"),
    MEDIO("Médio Risco - Ingrediente importante mas com substitutos"),
    ALTO("Alto Risco - Ingrediente essencial com poucos substitutos"),
    CRITICO("Crítico - Ingrediente insubstituível, sem alternativas");

    private final String descricao;

    CategoriaRisco(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
