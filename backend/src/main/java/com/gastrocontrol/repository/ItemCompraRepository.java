package com.gastrocontrol.repository;

import com.gastrocontrol.domain.entity.ItemCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemCompraRepository extends JpaRepository<ItemCompra, Long> {

    List<ItemCompra> findAllByListaComprasId(Long listaComprasId);
}
