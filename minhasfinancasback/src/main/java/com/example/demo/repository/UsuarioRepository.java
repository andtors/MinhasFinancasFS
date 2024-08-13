package com.example.demo.repository;

import com.example.demo.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
// Serve apenas para que possamos usar querymethods
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // O nome que criamos é a query que irá ser executada pelo JPA
    // select * from usuario where exists
     boolean existsByEmail(String email);

    // Optional pois pode retornar ou não um dado
    Optional<Usuario> findByEmail(String email);
}
