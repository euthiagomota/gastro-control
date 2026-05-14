package com.gastrocontrol.dto.demanda;

import com.gastrocontrol.domain.enums.DemandaTipo;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Schema(description = "Request para criação de demanda de produção")
public class DemandaRequest {

    @NotBlank(message = "Título é obrigatório")
    @Size(max = 300, message = "Título muito longo")
    @Schema(description = "Título da demanda", example = "Produção - Semana 20/2024")
    private String titulo;

    @Schema(description = "Descrição detalhada da demanda")
    private String descricao;

    @NotNull(message = "Data de início é obrigatória")
    @Schema(description = "Data de início da produção", example = "2024-05-20")
    private LocalDate dataInicio;

    @Schema(description = "Data de fim (para planejamentos longos)", example = "2024-05-26")
    private LocalDate dataFim;

    @NotNull(message = "Tipo é obrigatório")
    @Schema(description = "Tipo de demanda", example = "SEMANAL")
    private DemandaTipo tipo;

    @Schema(description = "Observações gerais")
    private String observacoes;

    @NotEmpty(message = "A demanda deve ter pelo menos um prato")
    @Valid
    @Schema(description = "Lista de pratos com quantidades")
    private List<DemandaPratoRequest> pratos;
}
