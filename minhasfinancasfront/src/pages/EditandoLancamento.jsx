import { useState, useEffect } from "react"
import { useNavigate, Link, useParams } from "react-router-dom"

import Card from "../components/Card"
import FormGroup from "../components/FormGroup"
import SelectMenu from "../components/SelectMenu"
import * as message from '../components/Toastr'

import LancamentoService from "../services/lancamentoService"
import LocalStorageService from "../services/localStorageService"

const CadastroLancamentos = () => {

    const [descricao, setDescricao] = useState("")
    const [ano, setAno] = useState("")
    const [mes, setMes] = useState("")
    const [valor, setValor] = useState("")
    const [tipo, setTipo] = useState("")
    const [status, setStatus] = useState("")

    const service = new LancamentoService
    const tipos = service.obterListaTipos()
    const meses = service.obterListaMeses()
    const navigate = useNavigate()
    let {id} = useParams()
    let lancamento

    useEffect(() => {

        async function obterLancamento(id){
            try {
                lancamento = await fetch(`http://localhost:8080/api/lancamentos/${id}`)
                                            .then(response => response.json())
                setDescricao(lancamento.descricao)
                setAno(lancamento.ano)
                setMes(lancamento.mes)
                setValor(lancamento.valor)
                setTipo(lancamento.tipo)
                setStatus(lancamento.status)

            } catch (error) {
                message.mensagemErro(error)
            }
        }
        
        obterLancamento(id)
       
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const lancamento = {
            descricao,
            ano,
            mes,
            valor,
            tipo,
            status,
            usuario: usuarioLogado.id
        }

        if(!descricao || !ano || !mes || !valor || !tipo || !status){
            return message.mensagemErro('Nenhum campo pode ficar em branco.')
        }

        try {
            service.atualizar(id, lancamento)
            message.mensagemSuccesso('Lançamento alterado com sucesso.')
            navigate('/lancamentos')
        } catch (error) {
            message.mensagemErro(error.response.data)
        }
    }
    
    return (
        <Card title="Editando Lançamento">
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="Descrição">
                            <input id="inputDescricao" value={descricao || ""} type="text" className="form-control" onChange={(e) => setDescricao(e.target.value)} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano">
                            <input id="inputAno" value={ano || ""} type="text" className="form-control" onChange={(e) => setAno(e.target.value)} />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup id="inputMes" label="Mês">
                            <SelectMenu lista={meses} value={mes || ""} id="inputMes" className="form-control" onChange={(e) => setMes(e.target.value)} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor">
                            <input id="inputValor" value={valor || ""} type="text" className="form-control" onChange={(e) => setValor(e.target.value)} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="Tipo">
                            <SelectMenu className="form-control" value={tipo || ""} id="inputTipo" lista={tipos} onChange={(e) => setTipo(e.target.value)} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Status">
                            <input type="text" className="form-control" value={status || ""} disabled />
                        </FormGroup>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <button type="submit" className="btn btn-success me-2">Salvar</button>
                            <Link className="btn btn-danger" to="/lancamentos">Cancelar</Link>
                        </div>
                    </div>
                </div>
            </form>
        </Card>
    )
}

export default CadastroLancamentos