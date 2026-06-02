package com.gastrocontrol.dto.demanda;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Request para atualizar prato de uma demanda")
public class DemandaPratoUpdateRequest {

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser no mínimo 1")
    @Schema(description = "Quantidade de porções do prato", example = "50")
    private Integer quantidade;

    @Schema(description = "Observações para este prato na demanda")
    private String observacoes;
}
