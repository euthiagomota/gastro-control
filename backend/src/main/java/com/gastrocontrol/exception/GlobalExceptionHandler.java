package com.gastrocontrol.exception;

import com.gastrocontrol.dto.common.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Handler global de exceções da API GastroControl.
 * Centraliza todos os tratamentos de erro e gera respostas padronizadas.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Validações de Bean Validation (@Valid, @NotNull, etc.)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            MethodArgumentNotValidException ex) {

        List<String> erros = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .sorted()
                .collect(Collectors.toList());

        log.warn("Erros de validação: {}", erros);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.erros("Erros de validação", erros, HttpStatus.BAD_REQUEST.value()));
    }

    /**
     * Violações de constraints (@Min, @Max, @Pattern em parâmetros)
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolationException(
            ConstraintViolationException ex) {

        List<String> erros = ex.getConstraintViolations().stream()
                .map(cv -> cv.getPropertyPath() + ": " + cv.getMessage())
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.erros("Parâmetros inválidos", erros, HttpStatus.BAD_REQUEST.value()));
    }

    /**
     * Recurso não encontrado (404)
     */
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ApiResponse<Void>> handleRecursoNaoEncontrado(
            RecursoNaoEncontradoException ex) {

        log.warn("Recurso não encontrado: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.erro(ex.getMessage(), HttpStatus.NOT_FOUND.value()));
    }

    /**
     * Regra de negócio violada (422)
     */
    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<ApiResponse<Void>> handleRegraDeNegocio(
            RegraDeNegocioException ex) {

        log.warn("Regra de negócio violada: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ApiResponse.erro(ex.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY.value()));
    }

    /**
     * Conflito de dados (409)
     */
    @ExceptionHandler(ConflitoException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflito(ConflitoException ex) {
        log.warn("Conflito de dados: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.erro(ex.getMessage(), HttpStatus.CONFLICT.value()));
    }

    /**
     * Não autorizado - credenciais inválidas (401)
     */
    @ExceptionHandler({BadCredentialsException.class, NaoAutorizadoException.class})
    public ResponseEntity<ApiResponse<Void>> handleNaoAutorizado(Exception ex) {
        log.warn("Acesso não autorizado: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.erro("Credenciais inválidas ou token expirado",
                        HttpStatus.UNAUTHORIZED.value()));
    }

    /**
     * Usuário desabilitado (401)
     */
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiResponse<Void>> handleDisabledException(DisabledException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.erro("Usuário inativo no sistema", HttpStatus.UNAUTHORIZED.value()));
    }

    /**
     * Acesso negado - sem permissão (403)
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAcessoNegado(AccessDeniedException ex) {
        log.warn("Acesso negado: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.erro("Acesso negado - sem permissão para esta operação",
                        HttpStatus.FORBIDDEN.value()));
    }

    /**
     * Violação de integridade do banco (duplicate key, FK, etc.)
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(
            DataIntegrityViolationException ex) {

        log.error("Violação de integridade de dados: {}", ex.getMessage());

        String mensagem = "Operação não permitida: violação de integridade de dados";
        if (ex.getMessage() != null && ex.getMessage().contains("unique")) {
            mensagem = "Registro já existe com os dados fornecidos";
        }

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.erro(mensagem, HttpStatus.CONFLICT.value()));
    }

    /**
     * Arquivo muito grande no upload
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaxUploadSize(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(ApiResponse.erro("Arquivo muito grande. Tamanho máximo: 10MB",
                        HttpStatus.PAYLOAD_TOO_LARGE.value()));
    }

    /**
     * Exceções genéricas não tratadas (500)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception ex) {
        log.error("Erro interno inesperado: {}", ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.erro("Erro interno do servidor. Tente novamente mais tarde.",
                        HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }
}
