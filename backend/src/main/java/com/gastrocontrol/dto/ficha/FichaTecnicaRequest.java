package com.gastrocontrol.dto.ficha;

import com.gastrocontrol.domain.enums.UnidadeMedida;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "Request para criação/atualização de item de ficha técnica")
public class FichaTecnicaRequest {

    @NotNull(message = "ID do ingrediente é obrigatório")
    @Schema(description = "ID do ingrediente", example = "1")
    private Long ingredienteId;

    @NotNull(message = "Quantidade por porção é obrigatória")
    @DecimalMin(value = "0.0001", message = "Quantidade deve ser maior que zero")
    @Digits(integer = 11, fraction = 4, message = "Quantidade inválida")
    @Schema(description = "Quantidade por porção", example = "0.350")
    private BigDecimal qtdPorPorcao;

    @NotNull(message = "Unidade é obrigatória")
    @Schema(description = "Unidade de medida", example = "KG")
    private UnidadeMedida unidade;

    @DecimalMin(value = "1.0", message = "Fator de correção deve ser no mínimo 1.0")
    @DecimalMax(value = "5.0", message = "Fator de correção deve ser no máximo 5.0")
    @Schema(description = "Fator de correção para perdas (padrão: 1.0)", example = "1.15")
    private BigDecimal fatorCorrecao;

    @Schema(description = "Observações sobre o ingrediente no prato")
    private String observacoes;
}
