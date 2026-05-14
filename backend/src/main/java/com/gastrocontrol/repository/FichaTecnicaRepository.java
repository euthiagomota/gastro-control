package com.gastrocontrol.repository;

import com.gastrocontrol.domain.entity.FichaTecnica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FichaTecnicaRepository extends JpaRepository<FichaTecnica, Long> {

    List<FichaTecnica> findAllByPratoId(Long pratoId);

    Optional<FichaTecnica> findByPratoIdAndIngredienteId(Long pratoId, Long ingredienteId);

    boolean existsByPratoIdAndIngredienteId(Long pratoId, Long ingredienteId);

    @Modifying
    @Query("DELETE FROM FichaTecnica ft WHERE ft.prato.id = :pratoId")
    void deleteAllByPratoId(@Param("pratoId") Long pratoId);

    @Query("SELECT ft FROM FichaTecnica ft " +
           "JOIN FETCH ft.ingrediente i " +
           "WHERE ft.prato.id = :pratoId")
    List<FichaTecnica> findAllByPratoIdWithIngrediente(@Param("pratoId") Long pratoId);

    @Query("SELECT COUNT(ft) FROM FichaTecnica ft WHERE ft.ingrediente.id = :ingredienteId")
    long countByIngredienteId(@Param("ingredienteId") Long ingredienteId);
}
