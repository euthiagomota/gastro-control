package com.gastrocontrol.service;

import com.gastrocontrol.domain.entity.RefreshToken;
import com.gastrocontrol.domain.entity.Usuario;
import com.gastrocontrol.domain.enums.RoleTipo;
import com.gastrocontrol.dto.auth.*;
import com.gastrocontrol.exception.ConflitoException;
import com.gastrocontrol.exception.NaoAutorizadoException;
import com.gastrocontrol.exception.RecursoNaoEncontradoException;
import com.gastrocontrol.repository.RefreshTokenRepository;
import com.gastrocontrol.repository.UsuarioRepository;
import com.gastrocontrol.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Serviço de autenticação e gerenciamento de tokens JWT.
 * Responsável pelo fluxo completo de auth: login, cadastro, refresh e logout.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    /**
     * Realiza login e retorna tokens JWT de acesso e refresh.
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );

        Usuario usuario = usuarioRepository.findByEmailAndAtivoTrue(request.getEmail())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário", "email", request.getEmail()));

        // Revogar tokens anteriores
        refreshTokenRepository.revogarTodosPorUsuario(usuario);

        // Gerar novos tokens
        String accessToken = jwtTokenProvider.generateAccessToken(
                usuario.getEmail(),
                usuario.getRole().name(),
                usuario.getId()
        );
        String refreshTokenStr = gerarRefreshToken(usuario);

        // Atualizar último login
        usuarioRepository.updateUltimoLogin(usuario.getId(), LocalDateTime.now());

        log.info("Login realizado com sucesso para: {}", usuario.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .expiresIn(jwtTokenProvider.getJwtExpiration())
                .usuarioId(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .build();
    }

    /**
     * Cadastra novo usuário no sistema (apenas OPERADOR por padrão).
     */
    @Transactional
    public AuthResponse cadastrar(CadastroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ConflitoException("Email já cadastrado no sistema: " + request.getEmail());
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .telefone(request.getTelefone())
                .role(RoleTipo.OPERADOR)
                .ativo(true)
                .build();

        usuarioRepository.save(usuario);

        String accessToken = jwtTokenProvider.generateAccessToken(
                usuario.getEmail(), usuario.getRole().name(), usuario.getId());
        String refreshToken = gerarRefreshToken(usuario);

        log.info("Novo usuário cadastrado: {}", usuario.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getJwtExpiration())
                .usuarioId(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .build();
    }

    /**
     * Renova o access token usando o refresh token.
     */
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByTokenAndRevogadoFalse(request.getRefreshToken())
                .orElseThrow(() -> new NaoAutorizadoException("Refresh token inválido ou expirado"));

        if (refreshToken.isExpirado()) {
            refreshToken.setRevogado(true);
            refreshTokenRepository.save(refreshToken);
            throw new NaoAutorizadoException("Refresh token expirado. Faça login novamente.");
        }

        Usuario usuario = refreshToken.getUsuario();

        String newAccessToken = jwtTokenProvider.generateAccessToken(
                usuario.getEmail(), usuario.getRole().name(), usuario.getId());

        log.debug("Token renovado para: {}", usuario.getEmail());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(request.getRefreshToken())
                .expiresIn(jwtTokenProvider.getJwtExpiration())
                .usuarioId(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .build();
    }

    /**
     * Realiza logout revogando todos os tokens do usuário.
     */
    @Transactional
    public void logout(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário", "email", email));

        refreshTokenRepository.revogarTodosPorUsuario(usuario);
        log.info("Logout realizado para: {}", email);
    }

    private String gerarRefreshToken(Usuario usuario) {
        String tokenStr = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .usuario(usuario)
                .token(tokenStr)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(refreshToken);
        return tokenStr;
    }
}
