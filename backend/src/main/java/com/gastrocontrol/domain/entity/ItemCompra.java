package com.gastrocontrol.domain.entity;

import com.gastrocontrol.domain.enums.UnidadeMedida;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "itens_compra")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lista_compras_id", nullable = false)
    private ListaCompras listaCompras;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ingrediente_id", nullable = false)
    private Ingrediente ingrediente;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal quantidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "unidade_medida")
    private UnidadeMedida unidade;

    @Column(name = "valor_unitario", precision = 15, scale = 4)
    private BigDecimal valorUnitario;

    @Column(name = "valor_total", precision = 15, scale = 4)
    private BigDecimal valorTotal;

    @Column(name = "qtd_estoque_atual", nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal qtdEstoqueAtual = BigDecimal.ZERO;

    @Column(name = "qtd_necessaria", nullable = false, precision = 15, scale = 4)
    private BigDecimal qtdNecessaria;

    @Column(nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal deficit = BigDecimal.ZERO;

    @Column(name = "fornecedor_sugerido", length = 200)
    private String fornecedorSugerido;

    @Column(nullable = false)
    @Builder.Default
    private Boolean comprado = false;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
