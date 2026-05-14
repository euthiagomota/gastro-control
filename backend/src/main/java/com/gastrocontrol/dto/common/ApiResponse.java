package com.gastrocontrol.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Resposta padronizada para todos os endpoints da API.
 * Seguindo o padrão de API response envelope.
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Estrutura padrão de resposta da API")
public class ApiResponse<T> {

    @Schema(description = "Indica se a operação foi bem-sucedida")
    private final boolean sucesso;

    @Schema(description = "Mensagem descritiva do resultado")
    private final String mensagem;

    @Schema(description = "Dados retornados pela operação")
    private final T dados;

    @Schema(description = "Lista de erros (quando aplicável)")
    private final List<String> erros;

    @Schema(description = "Timestamp da resposta")
    @Builder.Default
    private final LocalDateTime timestamp = LocalDateTime.now();

    @Schema(description = "Código HTTP da resposta")
    private final int status;

    // Factory methods

    public static <T> ApiResponse<T> sucesso(T dados) {
        return ApiResponse.<T>builder()
                .sucesso(true)
                .dados(dados)
                .status(HttpStatus.OK.value())
                .build();
    }

    public static <T> ApiResponse<T> sucesso(T dados, String mensagem) {
        return ApiResponse.<T>builder()
                .sucesso(true)
                .mensagem(mensagem)
                .dados(dados)
                .status(HttpStatus.OK.value())
                .build();
    }

    public static <T> ApiResponse<T> criado(T dados, String mensagem) {
        return ApiResponse.<T>builder()
                .sucesso(true)
                .mensagem(mensagem)
                .dados(dados)
                .status(HttpStatus.CREATED.value())
                .build();
    }

    public static <T> ApiResponse<T> erro(String mensagem, int status) {
        return ApiResponse.<T>builder()
                .sucesso(false)
                .mensagem(mensagem)
                .status(status)
                .build();
    }

    public static <T> ApiResponse<T> erros(String mensagem, List<String> erros, int status) {
        return ApiResponse.<T>builder()
                .sucesso(false)
                .mensagem(mensagem)
                .erros(erros)
                .status(status)
                .build();
    }

    public static <T> ApiResponse<T> semConteudo() {
        return ApiResponse.<T>builder()
                .sucesso(true)
                .mensagem("Operação realizada com sucesso")
                .status(HttpStatus.NO_CONTENT.value())
                .build();
    }
}
