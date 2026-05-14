package com.gastrocontrol.repository;

import com.gastrocontrol.domain.entity.Estoque;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Long>, JpaSpecificationExecutor<Estoque> {

    List<Estoque> findAllByIngredienteId(Long ingredienteId);

    @Query("SELECT e FROM Estoque e WHERE e.ingrediente.id = :ingredienteId " +
           "AND e.qtdDisponivel > 0 ORDER BY e.dataValidade ASC NULLS LAST")
    List<Estoque> findByIngredienteIdFEFO(@Param("ingredienteId") Long ingredienteId);

    @Query("SELECT COALESCE(SUM(e.qtdDisponivel), 0) FROM Estoque e " +
           "WHERE e.ingrediente.id = :ingredienteId")
    BigDecimal sumQtdDisponivelByIngredienteId(@Param("ingredienteId") Long ingredienteId);

    @Query("SELECT e FROM Estoque e WHERE e.qtdDisponivel < e.qtdMinima")
    List<Estoque> findEstoquesBaixos();

    @Query("SELECT e FROM Estoque e WHERE e.dataValidade IS NOT NULL " +
           "AND e.dataValidade <= :dataLimite AND e.qtdDisponivel > 0")
    List<Estoque> findVencendoAte(@Param("dataLimite") LocalDate dataLimite);

    @Query("SELECT e FROM Estoque e WHERE e.dataValidade < :hoje AND e.qtdDisponivel > 0")
    List<Estoque> findVencidos(@Param("hoje") LocalDate hoje);

    Page<Estoque> findAllByIngredienteIdIn(List<Long> ingredienteIds, Pageable pageable);

    @Query("SELECT e FROM Estoque e JOIN FETCH e.ingrediente i WHERE e.ingrediente.id = :ingredienteId " +
           "AND e.qtdDisponivel > 0 ORDER BY e.dataValidade ASC NULLS LAST")
    Optional<Estoque> findPrimeiroDisponivel(@Param("ingredienteId") Long ingredienteId);
}
