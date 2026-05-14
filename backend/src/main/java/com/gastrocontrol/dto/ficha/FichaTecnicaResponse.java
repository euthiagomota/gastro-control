package com.gastrocontrol.dto.ficha;

import com.gastrocontrol.domain.enums.UnidadeMedida;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "Item de ficha técnica com custo calculado")
public class FichaTecnicaResponse {

    private Long id;
    private Long pratoId;
    private String pratoNome;
    private Long ingredienteId;
    private String ingredienteNome;
    private UnidadeMedida unidade;
    private BigDecimal qtdPorPorcao;
    private BigDecimal fatorCorrecao;
    private BigDecimal qtdBruta;
    private BigDecimal custoUnitarioIngrediente;
    private BigDecimal custoCalculado;
    private String observacoes;
}
