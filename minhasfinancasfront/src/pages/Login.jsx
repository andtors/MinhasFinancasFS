import React, { useEffect } from "react"
import Card from "../components/Card"
import FormGroup from "../components/FormGroup"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import UsuarioService from "../services/usuarioService"
import LocalStorageService from '../services/localStorageService'
import {mensagemErro} from "../components/Toastr"

const Login = () => {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const service = new UsuarioService()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        await service.autenticar({
            email,
            senha
            })
            .then(response => {
                LocalStorageService.adicionarItem('_usuario_logado', response.data)
                navigate('/home')
                location.reload()
            })
            .catch(erro => {
                mensagemErro(erro.response.data)
            })
    }

    return (
        <div className="row">
            <div className="col-md-6" style={{ position: 'relative', left: '300px' }}>
                <div className="bs-docs-section">
                    
                    <Card title='Login'>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="bs-component">
                                    <form onSubmit={handleSubmit}>

                                        <FormGroup label="E-mail" htmlFor="exampleInputEmail" >
                                            <input type="email" className="form-control" id="exampleInputEmail"
                                                aria-describedby='emailHelp' placeholder='Digite o E-mail'
                                                value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </FormGroup>
                                        <FormGroup label="Senha" htmlFor="exampleInputPassword">
                                            <input type="password" className="form-control" id="exampleInputPassword"
                                                aria-describedby='passwordHelp' placeholder='Digite a Senha'
                                                value={senha} onChange={(e) => setSenha(e.target.value)} />
                                        </FormGroup>
                                        <input type="submit" className="btn btn-success me-2" value="Entrar" />
                                        <Link to="/register" type="button" className="btn btn-danger">Cadastrar</Link>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Login