package com.gastrocontrol.dto.estoque;

import com.gastrocontrol.domain.enums.CategoriaRisco;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EstoqueAlertaResponse {
    private Long estoqueId;
    private Long ingredienteId;
    private String ingredienteNome;
    private CategoriaRisco categoriaRisco;
    private BigDecimal qtdDisponivel;
    private BigDecimal qtdMinima;
    private LocalDate dataValidade;
    private String lote;
    private Boolean estoqueBaixo;
    private Boolean vencido;
    private Boolean vencendoEm7Dias;
}
