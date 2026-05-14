package com.gastrocontrol.repository;

import com.gastrocontrol.domain.entity.RefreshToken;
import com.gastrocontrol.domain.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByTokenAndRevogadoFalse(String token);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.revogado = true WHERE r.usuario = :usuario")
    void revogarTodosPorUsuario(@Param("usuario") Usuario usuario);

    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.expiryDate < :now OR r.revogado = true")
    void deleteExpiradosERevogados(@Param("now") LocalDateTime now);

    long countByUsuarioAndRevogadoFalse(Usuario usuario);
}
