package com.gastrocontrol.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção para conflitos de dados (HTTP 409).
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class ConflitoException extends RuntimeException {

    public ConflitoException(String mensagem) {
        super(mensagem);
    }
}
