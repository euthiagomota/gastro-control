package com.gastrocontrol.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Request para refresh do token de acesso")
public class RefreshTokenRequest {

    @NotBlank(message = "Refresh token é obrigatório")
    @Schema(description = "Token de refresh JWT")
    private String refreshToken;
}
