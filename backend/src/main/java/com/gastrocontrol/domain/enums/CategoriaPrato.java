package com.gastrocontrol.domain.enums;

/**
 * Categorias de pratos do restaurante.
 */
public enum CategoriaPrato {
    ENTRADA("Entrada"),
    PRATO_PRINCIPAL("Prato Principal"),
    SOBREMESA("Sobremesa"),
    BEBIDA("Bebida"),
    APERITIVO("Aperitivo"),
    PORCAO("Porção"),
    OUTRO("Outro");

    private final String descricao;

    CategoriaPrato(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
