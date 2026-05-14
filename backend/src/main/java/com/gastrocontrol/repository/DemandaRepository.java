package com.gastrocontrol.repository;

import com.gastrocontrol.domain.entity.Demanda;
import com.gastrocontrol.domain.enums.DemandaStatus;
import com.gastrocontrol.domain.enums.DemandaTipo;
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
public interface DemandaRepository extends JpaRepository<Demanda, Long>, JpaSpecificationExecutor<Demanda> {

    Optional<Demanda> findByIdAndDeletedFalse(Long id);

    Page<Demanda> findAllByDeletedFalse(Pageable pageable);

    Page<Demanda> findAllByStatusAndDeletedFalse(DemandaStatus status, Pageable pageable);

    List<Demanda> findAllByStatusAndDeletedFalse(DemandaStatus status);

    @Query("SELECT d FROM Demanda d WHERE d.deleted = false AND " +
           "d.dataInicio BETWEEN :inicio AND :fim")
    List<Demanda> findByPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT d FROM Demanda d LEFT JOIN FETCH d.demandaPratos dp LEFT JOIN FETCH dp.prato " +
           "WHERE d.id = :id AND d.deleted = false")
    Optional<Demanda> findByIdWithPratos(@Param("id") Long id);

    @Query("SELECT COUNT(d) FROM Demanda d WHERE d.deleted = false AND d.status = :status")
    long countByStatus(@Param("status") DemandaStatus status);

    @Query("SELECT d FROM Demanda d WHERE d.deleted = false AND d.tipo = :tipo " +
           "AND d.dataInicio >= :dataInicio ORDER BY d.dataInicio DESC")
    List<Demanda> findByTipoAndPeriodo(@Param("tipo") DemandaTipo tipo, @Param("dataInicio") LocalDate dataInicio);
}
