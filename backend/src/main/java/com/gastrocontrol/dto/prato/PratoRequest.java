package com.gastrocontrol.dto.prato;

import com.gastrocontrol.domain.enums.CategoriaPrato;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "Request para criação/atualização de prato")
public class PratoRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 200, message = "Nome deve ter entre 2 e 200 caracteres")
    @Schema(description = "Nome do prato", example = "Frango Grelhado")
    private String nome;

    @Schema(description = "Descrição do prato")
    private String descricao;

    @NotNull(message = "Categoria é obrigatória")
    @Schema(description = "Categoria do prato", example = "PRATO_PRINCIPAL")
    private CategoriaPrato categoria;

    @DecimalMin(value = "0.01", message = "Preço de venda deve ser maior que zero")
    @Schema(description = "Preço de venda sugerido", example = "35.90")
    private BigDecimal precoVenda;

    @Min(value = 1, message = "Tempo de preparo deve ser no mínimo 1 minuto")
    @Schema(description = "Tempo de preparo em minutos", example = "30")
    private Integer tempoPreparo;

    @Min(value = 1, message = "Número de porções deve ser no mínimo 1")
    @Schema(description = "Número de porções", example = "1")
    @NotNull(message = "Número de porções é obrigatório")
    private Integer porcoes;
}
