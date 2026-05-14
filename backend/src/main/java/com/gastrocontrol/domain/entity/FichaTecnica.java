package com.gastrocontrol.domain.entity;

import com.gastrocontrol.domain.enums.UnidadeMedida;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Ficha técnica de um prato: define a relação ingrediente-prato com quantidade por porção.
 * É a base para o cálculo automático de custos e necessidade de insumos.
 */
@Entity
@Table(name = "fichas_tecnicas",
        uniqueConstraints = @UniqueConstraint(columnNames = {"prato_id", "ingrediente_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
public class FichaTecnica extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prato_id", nullable = false)
    private Prato prato;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ingrediente_id", nullable = false)
    private Ingrediente ingrediente;

    @Column(name = "qtd_por_porcao", nullable = false, precision = 15, scale = 4)
    private BigDecimal qtdPorPorcao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "unidade_medida")
    private UnidadeMedida unidade;

    /**
     * Fator de correção para perdas (limpeza, cocção, etc.)
     * Ex: 1.15 significa 15% de perda/desperdício previsto.
     */
    @Column(name = "fator_correcao", nullable = false, precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal fatorCorrecao = BigDecimal.ONE;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    /**
     * Calcula a quantidade real necessária após aplicar o fator de correção.
     * @return quantidade bruta necessária = qtd * fator_correcao
     */
    public BigDecimal getQtdBruta() {
        return qtdPorPorcao.multiply(fatorCorrecao).setScale(4, RoundingMode.HALF_UP);
    }

    /**
     * Calcula o custo deste ingrediente para uma porção do prato.
     * @return custo = qtd_bruta * custo_unitario_ingrediente
     */
    public BigDecimal getCustoCalculado() {
        return getQtdBruta()
                .multiply(ingrediente.getCustoUnitario())
                .setScale(4, RoundingMode.HALF_UP);
    }
}
