package com.gastrocontrol.domain.entity;

import com.gastrocontrol.domain.enums.MovimentacaoTipo;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes_estoque")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estoque_id", nullable = false)
    private Estoque estoque;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "movimentacao_tipo")
    private MovimentacaoTipo tipo;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal quantidade;

    @Column(name = "qtd_anterior", nullable = false, precision = 15, scale = 4)
    private BigDecimal qtdAnterior;

    @Column(name = "qtd_posterior", nullable = false, precision = 15, scale = 4)
    private BigDecimal qtdPosterior;

    @Column(columnDefinition = "TEXT")
    private String motivo;

    @Column(name = "referencia_id")
    private Long referenciaId;

    @Column(name = "referencia_tipo", length = 50)
    private String referenciaTipo;

    @Column(name = "data_hora", nullable = false)
    @Builder.Default
    private LocalDateTime dataHora = LocalDateTime.now();

    @Column(name = "created_by", length = 200)
    private String createdBy;
}
