package com.gastrocontrol.dto.estoque;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Schema(description = "Request para adicionar estoque")
public class EstoqueRequest {

    @NotNull(message = "ID do ingrediente é obrigatório")
    private Long ingredienteId;

    @NotNull(message = "Quantidade disponível é obrigatória")
    @DecimalMin(value = "0.0001", message = "Quantidade deve ser maior que zero")
    private BigDecimal qtdDisponivel;

    @DecimalMin(value = "0", message = "Quantidade mínima não pode ser negativa")
    private BigDecimal qtdMinima;

    private BigDecimal qtdMaxima;

    private LocalDate dataValidade;

    @Size(max = 100, message = "Lote muito longo")
    private String lote;

    @Size(max = 100, message = "Localização muito longa")
    private String localizacao;

    private BigDecimal custoLote;
}
