package com.gastrocontrol.dto.demanda;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Prato com quantidade em uma demanda")
public class DemandaPratoRequest {

    @NotNull(message = "ID do prato é obrigatório")
    @Schema(description = "ID do prato", example = "1")
    private Long pratoId;

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser no mínimo 1")
    @Schema(description = "Quantidade de porções do prato", example = "50")
    private Integer quantidade;

    @Schema(description = "Observações para este prato na demanda")
    private String observacoes;
}
