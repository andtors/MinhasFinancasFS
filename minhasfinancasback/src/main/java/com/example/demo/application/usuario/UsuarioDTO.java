package com.example.demo.application.usuario;

import lombok.Builder;
import lombok.Data;

// serve para que o objeto que recebemos em JSOn ou vice versa possa ser entendido e manipulado pelo java
@Data
@Builder
public class UsuarioDTO {

    private String email;
    private String nome;
    private String senha;
}
