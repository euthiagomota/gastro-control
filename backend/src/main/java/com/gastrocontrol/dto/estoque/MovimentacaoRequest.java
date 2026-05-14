package com.gastrocontrol.dto.estoque;

import com.gastrocontrol.domain.enums.MovimentacaoTipo;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "Request para registrar movimentação de estoque")
public class MovimentacaoRequest {

    @NotNull(message = "Tipo de movimentação é obrigatório")
    @Schema(description = "Tipo da movimentação", example = "ENTRADA")
    private MovimentacaoTipo tipo;

    @NotNull(message = "Quantidade é obrigatória")
    @DecimalMin(value = "0.0001", message = "Quantidade deve ser maior que zero")
    @Schema(description = "Quantidade da movimentação", example = "10.5")
    private BigDecimal quantidade;

    @Schema(description = "Motivo da movimentação")
    private String motivo;
}
