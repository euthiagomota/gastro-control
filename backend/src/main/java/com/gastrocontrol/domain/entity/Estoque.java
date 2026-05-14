package com.gastrocontrol.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "estoque")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
public class Estoque extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ingrediente_id", nullable = false)
    private Ingrediente ingrediente;

    @Column(name = "qtd_disponivel", nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal qtdDisponivel = BigDecimal.ZERO;

    @Column(name = "qtd_reservada", nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal qtdReservada = BigDecimal.ZERO;

    @Column(name = "qtd_minima", nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal qtdMinima = BigDecimal.ZERO;

    @Column(name = "qtd_maxima", precision = 15, scale = 4)
    private BigDecimal qtdMaxima;

    @Column(name = "data_validade")
    private LocalDate dataValidade;

    @Column(length = 100)
    private String lote;

    @Column(length = 100)
    private String localizacao;

    @Column(name = "custo_lote", precision = 15, scale = 4)
    private BigDecimal custoLote;

    @OneToMany(mappedBy = "estoque", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<MovimentacaoEstoque> movimentacoes = new ArrayList<>();

    public BigDecimal getQtdReal() {
        return qtdDisponivel.subtract(qtdReservada);
    }

    public boolean isEstoqueBaixo() {
        return qtdDisponivel.compareTo(qtdMinima) < 0;
    }

    public boolean isVencido() {
        return dataValidade != null && LocalDate.now().isAfter(dataValidade);
    }

    public boolean isVencendoEm(int dias) {
        return dataValidade != null && !isVencido()
                && LocalDate.now().plusDays(dias).isAfter(dataValidade);
    }
}
