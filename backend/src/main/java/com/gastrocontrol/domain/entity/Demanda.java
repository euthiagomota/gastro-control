package com.gastrocontrol.domain.entity;

import com.gastrocontrol.domain.enums.DemandaStatus;
import com.gastrocontrol.domain.enums.DemandaTipo;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa uma demanda/previsão de produção.
 * É o ponto de partida do fluxo principal do GastroControl.
 * A partir da demanda, todo o cálculo de ingredientes e geração de compras é disparado.
 */
@Entity
@Table(name = "demandas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
public class Demanda extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "demanda_tipo")
    @Builder.Default
    private DemandaTipo tipo = DemandaTipo.DIARIA;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "demanda_status")
    @Builder.Default
    private DemandaStatus status = DemandaStatus.PENDENTE;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "processado_em")
    private LocalDateTime processadoEm;

    @Column(name = "processado_por", length = 200)
    private String processadoPor;

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "demanda", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<DemandaPrato> demandaPratos = new ArrayList<>();

    public void softDelete() {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
    }

    public boolean isPendente() {
        return DemandaStatus.PENDENTE.equals(this.status);
    }

    public boolean isProcessada() {
        return DemandaStatus.PROCESSADA.equals(this.status);
    }
}
