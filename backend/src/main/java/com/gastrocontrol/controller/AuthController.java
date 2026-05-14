package com.gastrocontrol.controller;

import com.gastrocontrol.dto.auth.*;
import com.gastrocontrol.dto.common.ApiResponse;
import com.gastrocontrol.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller de autenticação - endpoints públicos de auth.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Endpoints de autenticação e gerenciamento de tokens")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Autentica o usuário e retorna tokens JWT")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.sucesso(response, "Login realizado com sucesso"));
    }

    @PostMapping("/cadastro")
    @Operation(summary = "Cadastro", description = "Registra novo usuário no sistema")
    public ResponseEntity<ApiResponse<AuthResponse>> cadastrar(
            @Valid @RequestBody CadastroRequest request) {
        AuthResponse response = authService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.criado(response, "Usuário cadastrado com sucesso"));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh Token", description = "Renova o access token usando o refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.sucesso(response, "Token renovado com sucesso"));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Invalida todos os tokens do usuário")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal UserDetails userDetails) {
        authService.logout(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.semConteudo());
    }
}
