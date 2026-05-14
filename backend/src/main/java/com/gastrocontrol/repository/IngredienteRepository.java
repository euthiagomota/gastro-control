package com.gastrocontrol.repository;

import com.gastrocontrol.domain.entity.Ingrediente;
import com.gastrocontrol.domain.enums.CategoriaRisco;
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
public interface IngredienteRepository extends JpaRepository<Ingrediente, Long>, JpaSpecificationExecutor<Ingrediente> {

    Optional<Ingrediente> findByIdAndDeletedFalse(Long id);

    Page<Ingrediente> findAllByDeletedFalse(Pageable pageable);

    Page<Ingrediente> findAllByAtivoTrueAndDeletedFalse(Pageable pageable);

    List<Ingrediente> findAllByAtivoTrueAndDeletedFalse();

    boolean existsByNomeAndDeletedFalse(String nome);

    @Query("SELECT i FROM Ingrediente i WHERE i.deleted = false AND i.categoriaRisco = :categoria")
    List<Ingrediente> findByCategoriaRiscoAndDeletedFalse(@Param("categoria") CategoriaRisco categoria);

    @Query("SELECT i FROM Ingrediente i WHERE i.deleted = false AND " +
           "LOWER(i.nome) LIKE LOWER(CONCAT('%', :termo, '%'))")
    Page<Ingrediente> searchByNome(@Param("termo") String termo, Pageable pageable);

    @Query("SELECT i FROM Ingrediente i WHERE i.deleted = false AND i.fornecedor = :fornecedor")
    List<Ingrediente> findByFornecedor(@Param("fornecedor") String fornecedor);

    @Query("SELECT COUNT(i) FROM Ingrediente i WHERE i.deleted = false AND i.ativo = true")
    long countAtivos();
}
