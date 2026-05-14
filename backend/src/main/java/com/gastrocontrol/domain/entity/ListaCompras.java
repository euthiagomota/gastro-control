package com.gastrocontrol.domain.entity;

import com.gastrocontrol.domain.enums.ListaComprasStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "listas_compras")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
public class ListaCompras extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_criacao", nullable = false)
    @Builder.Default
    private LocalDate dataCriacao = LocalDate.now();

    @Column(name = "data_conclusao")
    private LocalDate dataConclusao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "lista_compras_status")
    @Builder.Default
    private ListaComprasStatus status = ListaComprasStatus.ABERTA;

    @Column(name = "valor_total", nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal valorTotal = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demanda_id")
    private Demanda demanda;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "listaCompras", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ItemCompra> itens = new ArrayList<>();

    public void softDelete() {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
    }

    public void recalcularValorTotal() {
        this.valorTotal = itens.stream()
                .filter(i -> i.getValorTotal() != null)
                .map(ItemCompra::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
