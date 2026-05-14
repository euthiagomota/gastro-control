package com.gastrocontrol.dto.estoque;

import com.gastrocontrol.domain.enums.UnidadeMedida;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EstoqueResponse {
    private Long id;
    private Long ingredienteId;
    private String ingredienteNome;
    private UnidadeMedida unidadeMedida;
    private BigDecimal qtdDisponivel;
    private BigDecimal qtdReservada;
    private BigDecimal qtdMinima;
    private BigDecimal qtdReal;
    private LocalDate dataValidade;
    private String lote;
    private String localizacao;
    private Boolean estoqueBaixo;
    private Boolean vencido;
    private Boolean vencendoEm7Dias;
    private LocalDateTime createdAt;
}
