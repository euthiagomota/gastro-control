package com.gastrocontrol.dto.prato;

import com.gastrocontrol.domain.enums.CategoriaPrato;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Schema(description = "Resposta com dados de um prato")
public class PratoResponse {

    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal custoTotal;
    private BigDecimal precoVenda;
    private BigDecimal margemLucro;
    private CategoriaPrato categoria;
    private String imagemUrl;
    private Integer tempoPreparo;
    private Integer porcoes;
    private Boolean ativo;
    private Integer totalIngredientes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
