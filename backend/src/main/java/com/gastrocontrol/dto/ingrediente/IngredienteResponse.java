package com.gastrocontrol.dto.ingrediente;

import com.gastrocontrol.domain.enums.CategoriaRisco;
import com.gastrocontrol.domain.enums.UnidadeMedida;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Schema(description = "Resposta com dados de um ingrediente")
public class IngredienteResponse {

    private Long id;
    private String nome;
    private String descricao;
    private UnidadeMedida unidadeMedida;
    private BigDecimal custoUnitario;
    private String fornecedor;
    private CategoriaRisco categoriaRisco;
    private String codigoInterno;
    private Boolean ativo;
    private BigDecimal qtdEstoqueTotal;
    private Boolean estoqueBaixo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
}
