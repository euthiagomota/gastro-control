package com.gastrocontrol.repository;

import com.gastrocontrol.domain.entity.MovimentacaoEstoque;
import com.gastrocontrol.domain.enums.MovimentacaoTipo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {

    Page<MovimentacaoEstoque> findAllByEstoqueId(Long estoqueId, Pageable pageable);

    List<MovimentacaoEstoque> findAllByEstoqueIdOrderByDataHoraDesc(Long estoqueId);

    @Query("SELECT m FROM MovimentacaoEstoque m WHERE m.estoque.ingrediente.id = :ingredienteId " +
           "ORDER BY m.dataHora DESC")
    List<MovimentacaoEstoque> findByIngredienteId(@Param("ingredienteId") Long ingredienteId);

    @Query("SELECT m FROM MovimentacaoEstoque m WHERE m.dataHora BETWEEN :inicio AND :fim " +
           "ORDER BY m.dataHora DESC")
    List<MovimentacaoEstoque> findByPeriodo(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);

    @Query("SELECT m FROM MovimentacaoEstoque m WHERE m.tipo = :tipo " +
           "AND m.dataHora BETWEEN :inicio AND :fim")
    List<MovimentacaoEstoque> findByTipoAndPeriodo(
            @Param("tipo") MovimentacaoTipo tipo,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);

    @Query("SELECT m FROM MovimentacaoEstoque m WHERE m.referenciaId = :referenciaId " +
           "AND m.referenciaTipo = :referenciaTipo")
    List<MovimentacaoEstoque> findByReferencia(
            @Param("referenciaId") Long referenciaId,
            @Param("referenciaTipo") String referenciaTipo);
}
