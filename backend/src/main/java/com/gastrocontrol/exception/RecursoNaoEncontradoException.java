package com.gastrocontrol.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção para recursos não encontrados (HTTP 404).
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class RecursoNaoEncontradoException extends RuntimeException {

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }

    public RecursoNaoEncontradoException(String recurso, Long id) {
        super(String.format("%s com ID %d não encontrado", recurso, id));
    }

    public RecursoNaoEncontradoException(String recurso, String campo, Object valor) {
        super(String.format("%s com %s '%s' não encontrado", recurso, campo, valor));
    }
}
