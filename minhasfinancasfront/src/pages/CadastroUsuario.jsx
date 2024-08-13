import React from "react";
import Card from "../components/Card";
import FormGroup from "../components/FormGroup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import UsuarioService from "../services/usuarioService";
import { mensagemSuccesso, mensagemErro } from "../components/Toastr";

const CadastroUsuario = () => {

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [senhaRepeticao, setSenhaRepeticao] = useState('')
    const navigate = useNavigate()
    const service = new UsuarioService()

    const usuario = {
        nome,
        email,
        senha
    }

    function validar() {
        const msgs = []
 
        if (!nome) {
            msgs.push('O campo nome é  obrigatório.')
        }

        if (!email) {
            msgs.push('O campo email é  obrigatório.')
        } else if (!email.match(/^[a-z0-9]+@[a-z0-9]+\.[a-z]/)) {
            msgs.push('Informe um email válido.')
        }

        if (!senha || !senhaRepeticao) {
            msgs.push('O campo senha e confirmação de senha é  obrigatório.')
        } else if (senha !== senhaRepeticao) {
            msgs.push('As senhas não batem.')
        }

        return msgs
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const msgs = validar()

        if (msgs && msgs.length > 0) {
            msgs.forEach((msg, index) => {
                mensagemErro(msg)
            })
            return false
        }

        await service.salvar(usuario)
            .then(response => {
                mensagemSuccesso('Usuario cadastrado com sucesso! Realize o Login para entrar no sistema.')
                navigate('/login')
            })
            .catch(error => {
                mensagemErro(error.response.data)
            })
    }

    return (
        <Card title="Cadastro de Usuário">
            <div className="row">
                <div className="col-lg-12">
                    <div className="bs-component">
                        <form onSubmit={handleSubmit}>
                            <FormGroup label="Nome" htmlFor="inputNome">
                                <input className="form-control" type="text" id="inputNome" name="nome"
                                    onChange={(e) => setNome(e.target.value)} />
                            </FormGroup>
                            <FormGroup label="E-mail" htmlFor="inputEmail">
                                <input className="form-control" type="email" id="inputEmail" name="email"
                                    onChange={(e) => setEmail(e.target.value)} />
                            </FormGroup>
                            <FormGroup label="Senha" htmlFor="inputPassword">
                                <input className="form-control" type="password" id="inputPassword" name="senha"
                                    onChange={(e) => setSenha(e.target.value)} />
                            </FormGroup>
                            <FormGroup label="Repita a Senha" htmlFor="inputPasswordRepeat">
                                <input className="form-control" type="password" id="inputPasswordRepeat" name="senhaRepeticao"
                                    onChange={(e) => setSenhaRepeticao(e.target.value)} />
                            </FormGroup>
                            <input type="submit" className="btn btn-success me-2" value="Cadastrar" />
                            <Link to="/login" type="button" className="btn btn-danger">Cancelar</Link>
                        </form>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default CadastroUsuario