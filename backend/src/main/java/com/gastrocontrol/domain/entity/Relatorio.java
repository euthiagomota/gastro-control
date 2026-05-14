package com.gastrocontrol.domain.entity;

import com.gastrocontrol.domain.enums.RelatorioTipo;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "relatorios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Relatorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String titulo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "relatorio_tipo")
    private RelatorioTipo tipo;

    @Column(name = "periodo_inicio", nullable = false)
    private LocalDate periodoInicio;

    @Column(name = "periodo_fim", nullable = false)
    private LocalDate periodoFim;

    @Column(columnDefinition = "jsonb")
    private String dados;

    @Column(name = "gerado_em", nullable = false)
    @Builder.Default
    private LocalDateTime geradoEm = LocalDateTime.now();

    @Column(name = "gerado_por", length = 200)
    private String geradoPor;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
