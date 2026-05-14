package com.gastrocontrol.domain.enums;

/**
 * Unidades de medida suportadas pelo sistema.
 */
public enum UnidadeMedida {
    KG("Quilograma"),
    G("Grama"),
    MG("Miligrama"),
    L("Litro"),
    ML("Mililitro"),
    UNIDADE("Unidade"),
    PORCAO("Porção"),
    CAIXA("Caixa"),
    PACOTE("Pacote"),
    DUZIA("Dúzia");

    private final String descricao;

    UnidadeMedida(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
