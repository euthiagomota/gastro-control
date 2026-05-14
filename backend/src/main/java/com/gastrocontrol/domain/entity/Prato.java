package com.gastrocontrol.domain.entity;

import com.gastrocontrol.domain.enums.CategoriaPrato;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um prato do cardápio.
 * O custo total é calculado automaticamente com base nas fichas técnicas.
 */
@Entity
@Table(name = "pratos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
public class Prato extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "custo_total", nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal custoTotal = BigDecimal.ZERO;

    @Column(name = "preco_venda", precision = 15, scale = 4)
    private BigDecimal precoVenda;

    @Column(name = "margem_lucro", precision = 5, scale = 2)
    private BigDecimal margemLucro;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "categoria_prato")
    @Builder.Default
    private CategoriaPrato categoria = CategoriaPrato.PRATO_PRINCIPAL;

    @Column(name = "imagem_url", length = 500)
    private String imagemUrl;

    @Column(name = "tempo_preparo")
    private Integer tempoPreparo; // em minutos

    @Column(nullable = false)
    @Builder.Default
    private Integer porcoes = 1;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "prato", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<FichaTecnica> fichasTecnicas = new ArrayList<>();

    /**
     * Recalcula o custo total baseado nas fichas técnicas cadastradas.
     */
    public void recalcularCustoTotal() {
        this.custoTotal = fichasTecnicas.stream()
                .map(ft -> ft.getCustoCalculado())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (this.precoVenda != null && this.precoVenda.compareTo(BigDecimal.ZERO) > 0) {
            this.margemLucro = this.precoVenda
                    .subtract(this.custoTotal)
                    .divide(this.precoVenda, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
    }

    /**
     * Realiza soft delete do prato.
     */
    public void softDelete() {
        this.deleted = true;
        this.ativo = false;
        this.deletedAt = LocalDateTime.now();
    }
}
