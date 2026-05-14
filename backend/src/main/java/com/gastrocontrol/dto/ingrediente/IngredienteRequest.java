package com.gastrocontrol.dto.ingrediente;

import com.gastrocontrol.domain.enums.CategoriaRisco;
import com.gastrocontrol.domain.enums.UnidadeMedida;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "Request para criação/atualização de ingrediente")
public class IngredienteRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 200, message = "Nome deve ter entre 2 e 200 caracteres")
    @Schema(description = "Nome do ingrediente", example = "Frango Inteiro")
    private String nome;

    @Schema(description = "Descrição detalhada do ingrediente")
    private String descricao;

    @NotNull(message = "Unidade de medida é obrigatória")
    @Schema(description = "Unidade de medida", example = "KG")
    private UnidadeMedida unidadeMedida;

    @NotNull(message = "Custo unitário é obrigatório")
    @DecimalMin(value = "0.0001", message = "Custo deve ser maior que zero")
    @Digits(integer = 11, fraction = 4, message = "Custo inválido")
    @Schema(description = "Custo unitário do ingrediente", example = "12.90")
    private BigDecimal custoUnitario;

    @Size(max = 200, message = "Nome do fornecedor muito longo")
    @Schema(description = "Nome do fornecedor", example = "Frigorífico Belo")
    private String fornecedor;

    @NotNull(message = "Categoria de risco é obrigatória")
    @Schema(description = "Categoria de risco do ingrediente", example = "MEDIO")
    private CategoriaRisco categoriaRisco;

    @Size(max = 50, message = "Código interno muito longo")
    @Schema(description = "Código interno do ingrediente", example = "ING-001")
    private String codigoInterno;
}
