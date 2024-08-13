package com.example.demo.model.service;

import com.example.demo.model.entity.Usuario;

import java.util.Optional;

// Serve para criarmos o nome das nossas querymethods
public interface UsuarioService {

    Usuario autenticar(String email, String senha);

    Usuario salvarUsuario(Usuario usuario);

    void validarEmail(String email);

    void validar(String email, String nome, String senha);

    Optional<Usuario> obterPorId(Long id);
}
