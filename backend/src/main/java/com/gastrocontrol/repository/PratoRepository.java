package com.gastrocontrol.repository;

import com.gastrocontrol.domain.entity.Prato;
import com.gastrocontrol.domain.enums.CategoriaPrato;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PratoRepository extends JpaRepository<Prato, Long>, JpaSpecificationExecutor<Prato> {

    Optional<Prato> findByIdAndDeletedFalse(Long id);

    Page<Prato> findAllByDeletedFalse(Pageable pageable);

    Page<Prato> findAllByAtivoTrueAndDeletedFalse(Pageable pageable);

    List<Prato> findAllByAtivoTrueAndDeletedFalse();

    boolean existsByNomeAndDeletedFalse(String nome);

    @Query("SELECT p FROM Prato p WHERE p.deleted = false AND p.categoria = :categoria")
    Page<Prato> findByCategoria(@Param("categoria") CategoriaPrato categoria, Pageable pageable);

    @Query("SELECT p FROM Prato p WHERE p.deleted = false AND " +
           "LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%'))")
    Page<Prato> searchByNome(@Param("termo") String termo, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Prato p WHERE p.deleted = false AND p.ativo = true")
    long countAtivos();

    @Query("SELECT p FROM Prato p LEFT JOIN FETCH p.fichasTecnicas ft LEFT JOIN FETCH ft.ingrediente " +
           "WHERE p.id = :id AND p.deleted = false")
    Optional<Prato> findByIdWithFichasTecnicas(@Param("id") Long id);
}
