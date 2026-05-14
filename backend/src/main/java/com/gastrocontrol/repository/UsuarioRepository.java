package com.gastrocontrol.repository;

import com.gastrocontrol.domain.entity.Usuario;
import com.gastrocontrol.domain.enums.RoleTipo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>, JpaSpecificationExecutor<Usuario> {

    Optional<Usuario> findByEmailAndAtivoTrue(String email);

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<Usuario> findAllByAtivoTrue(Pageable pageable);

    Page<Usuario> findAllByRole(RoleTipo role, Pageable pageable);

    @Modifying
    @Query("UPDATE Usuario u SET u.ultimoLogin = :dataHora WHERE u.id = :id")
    void updateUltimoLogin(@Param("id") Long id, @Param("dataHora") LocalDateTime dataHora);

    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.ativo = true AND u.role = :role")
    long countByRoleAndAtivoTrue(@Param("role") RoleTipo role);
}
