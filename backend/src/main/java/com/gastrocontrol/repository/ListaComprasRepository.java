package com.gastrocontrol.repository;

import com.gastrocontrol.domain.entity.ListaCompras;
import com.gastrocontrol.domain.enums.ListaComprasStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ListaComprasRepository extends JpaRepository<ListaCompras, Long>, JpaSpecificationExecutor<ListaCompras> {

    Optional<ListaCompras> findByIdAndDeletedFalse(Long id);

    Page<ListaCompras> findAllByDeletedFalse(Pageable pageable);

    Page<ListaCompras> findAllByStatusAndDeletedFalse(ListaComprasStatus status, Pageable pageable);

    @Query("SELECT lc FROM ListaCompras lc WHERE lc.deleted = false AND " +
           "lc.dataCriacao BETWEEN :inicio AND :fim ORDER BY lc.dataCriacao DESC")
    List<ListaCompras> findByPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT lc FROM ListaCompras lc LEFT JOIN FETCH lc.itens i LEFT JOIN FETCH i.ingrediente " +
           "WHERE lc.id = :id AND lc.deleted = false")
    Optional<ListaCompras> findByIdWithItens(@Param("id") Long id);

    Optional<ListaCompras> findByDemandaIdAndDeletedFalse(Long demandaId);

    @Query("SELECT COALESCE(SUM(lc.valorTotal), 0) FROM ListaCompras lc " +
           "WHERE lc.deleted = false AND lc.dataCriacao BETWEEN :inicio AND :fim")
    java.math.BigDecimal sumValorTotalByPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
}
