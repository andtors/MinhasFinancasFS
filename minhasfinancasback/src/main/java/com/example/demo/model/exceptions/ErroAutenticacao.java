package com.example.demo.model.exceptions;

public class ErroAutenticacao extends RuntimeException{
    public ErroAutenticacao(String msg){
        super(msg);
    }
}
