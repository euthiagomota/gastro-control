package com.gastrocontrol.dto.demanda;

import com.gastrocontrol.domain.enums.DemandaStatus;
import com.gastrocontrol.domain.enums.DemandaTipo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Schema(description = "Resposta com dados de uma demanda")
public class DemandaResponse {

    private Long id;
    private String titulo;
    private String descricao;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private DemandaTipo tipo;
    private DemandaStatus status;
    private String observacoes;
    private LocalDateTime processadoEm;
    private String processadoPor;
    private List<DemandaPratoResponse> pratos;
    private Integer totalPratos;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
}
