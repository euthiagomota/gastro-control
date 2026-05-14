package com.gastrocontrol.dto.demanda;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Prato incluído em uma demanda com detalhes")
public class DemandaPratoResponse {

    private Long id;
    private Long pratoId;
    private String pratoNome;
    private String pratoCategoria;
    private Integer quantidade;
    private String observacoes;
}
