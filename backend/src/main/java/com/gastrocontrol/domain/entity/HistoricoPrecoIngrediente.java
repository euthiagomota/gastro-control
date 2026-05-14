package com.gastrocontrol.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Histórico de alterações de preço de um ingrediente.
 * Registra todas as mudanças de custo unitário para rastreabilidade.
 */
@Entity
@Table(name = "historico_preco_ingrediente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoPrecoIngrediente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingrediente_id", nullable = false)
    private Ingrediente ingrediente;

    @Column(name = "custo_anterior", nullable = false, precision = 15, scale = 4)
    private BigDecimal custoAnterior;

    @Column(name = "custo_novo", nullable = false, precision = 15, scale = 4)
    private BigDecimal custoNovo;

    @Column(name = "data_alteracao", nullable = false)
    @Builder.Default
    private LocalDateTime dataAlteracao = LocalDateTime.now();

    @Column(name = "alterado_por", length = 200)
    private String alteradoPor;
}
