package com.gastrocontrol.domain.entity;

import com.gastrocontrol.domain.enums.CategoriaRisco;
import com.gastrocontrol.domain.enums.UnidadeMedida;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um ingrediente/insumo do restaurante.
 * Suporta soft delete e histórico de preços.
 */
@Entity
@Table(name = "ingredientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
public class Ingrediente extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidade_medida", nullable = false, columnDefinition = "unidade_medida")
    private UnidadeMedida unidadeMedida;

    @Column(name = "custo_unitario", nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal custoUnitario = BigDecimal.ZERO;

    @Column(length = 200)
    private String fornecedor;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria_risco", nullable = false, columnDefinition = "categoria_risco")
    @Builder.Default
    private CategoriaRisco categoriaRisco = CategoriaRisco.BAIXO;

    @Column(name = "codigo_interno", length = 50)
    private String codigoInterno;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "ingrediente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<HistoricoPrecoIngrediente> historicoPrecos = new ArrayList<>();

    @OneToMany(mappedBy = "ingrediente", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Estoque> estoques = new ArrayList<>();

    /**
     * Realiza soft delete do ingrediente.
     */
    public void softDelete() {
        this.deleted = true;
        this.ativo = false;
        this.deletedAt = LocalDateTime.now();
    }
}
