package com.gastrocontrol.repository;

import com.gastrocontrol.domain.entity.HistoricoPrecoIngrediente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoricoPrecoIngredienteRepository extends JpaRepository<HistoricoPrecoIngrediente, Long> {

    Page<HistoricoPrecoIngrediente> findAllByIngredienteIdOrderByDataAlteracaoDesc(Long ingredienteId, Pageable pageable);
}
