package com.gastrocontrol.dto.auth;

import com.gastrocontrol.domain.enums.RoleTipo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response de autenticação com tokens JWT")
public class AuthResponse {

    @Schema(description = "Token de acesso JWT")
    private String accessToken;

    @Schema(description = "Token de refresh")
    private String refreshToken;

    @Schema(description = "Tipo do token", example = "Bearer")
    @Builder.Default
    private String tokenType = "Bearer";

    @Schema(description = "Tempo de expiração em milissegundos")
    private Long expiresIn;

    @Schema(description = "ID do usuário autenticado")
    private Long usuarioId;

    @Schema(description = "Nome do usuário autenticado")
    private String nome;

    @Schema(description = "Email do usuário autenticado")
    private String email;

    @Schema(description = "Role/papel do usuário")
    private RoleTipo role;
}
