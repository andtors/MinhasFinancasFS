import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

import Card from "../components/Card"
import FormGroup from "../components/FormGroup"
import SelectMenu from "../components/SelectMenu"
import LancamentosTable from "./LancamentosTable"

import LancamentoService from "../services/lancamentoService"
import LocalStorageService from "../services/localStorageService"

import * as messages from '../../src/components/Toastr'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button'

const ConsultaLancamentos = () => {

    const [id, setId] = useState("")
    const [ano, setAno] = useState("")
    const [mes, setMes] = useState("")
    const [tipo, setTipo] = useState("")
    const [descricao, setDescricao] = useState("")
    const [lancamentos, setLancamentos] = useState([])
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [lancamentoDeletar, setLancamentoDeletar] = useState({})
    
    const navigate = useNavigate()
    const service = new LancamentoService()

    const meses = service.obterListaMeses()
    const tipos = service.obterListaTipos()

    function handleSubmit(e) {
        e.preventDefault()
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const lancamentoFiltro = {
            ano,
            mes,
            tipo,
            descricao,
            usuario: usuarioLogado.id
        }

        if (!ano) {
            messages.mensagemErro('O preenchimento do campo Ano é obrigatório!')
            return false
        }

        service
            .consultar(lancamentoFiltro)
            .then(response => {
                setLancamentos(response.data)
            })
            .catch(error => {
                messages.mensagemErro(error.data)
            })
    }

    const abrirConfirmacao = (lancamento) => {
        setShowConfirmDialog(true, setLancamentoDeletar(lancamento))
    }

    async function deletar() {
        try {
            const index = lancamentoDeletar.id
            service.deletar(lancamentoDeletar.id)
            const novaArrayLanc = lancamentos.filter(lancamento => (lancamento.id !== index))
            setLancamentos(novaArrayLanc)
            messages.mensagemSuccesso('Lançamento deletado com sucesso.')
            setShowConfirmDialog(false)

        } catch (error) {
            messages.mensagemErro('Ocorreu um erro ao deletar o lançamento.')
        }
    }

    function editar(id){
        navigate(`/editando-lancamento/${id}`)
    }
    
    function alterarStatus(id, status){
        try {
            service.alterarStatus(id, status)
            messages.mensagemSuccesso('Status atualizado com sucesso.')
            location. reload()
        } catch (error) {
            messages.mensagemErro('Ocorreu um erro ao atualizar o status do lançamento.')
        }
    }

    return (
        <Card title="Consulta Lançamentos">
            <div className="row">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano">
                                <input type="text"
                                    className="form-control"
                                    id="inputAno"
                                    placeholder="Digite o Ano"
                                    value={ano}
                                    onChange={(e) => setAno(e.target.value)} />
                            </FormGroup>
                            <FormGroup htmlFor="inputMês" label="Mês">
                                <SelectMenu className="form-control" lista={meses} value={mes} onChange={(e) => setMes(e.target.value)} />
                            </FormGroup>
                            <FormGroup htmlFor="inputDescricao" label="Descrição">
                                <input type="text"
                                    className="form-control"
                                    id="inputDescricao"
                                    placeholder="Digite a descrição"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)} />
                            </FormGroup>
                            <FormGroup htmlFor="inputTipo" label="Tipo Lançamento">
                                <SelectMenu className="form-control" lista={tipos} value={tipo} onChange={(e) => setTipo(e.target.value)} />
                            </FormGroup>
                            <input type="submit" className="btn btn-success me-2" value="Consultar" />
                            <Link className="btn btn-danger" to="/cadastro-lancamentos">Cadastrar</Link>
                        </div>
                    </form>
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-md-12">
                    <div className="bs-component">
                        <LancamentosTable lancamentos={lancamentos} deleteAction={abrirConfirmacao} editAction={editar} alterarStatus={alterarStatus}/>
                    </div>
                </div>
            </div>
            <div>
                <Dialog header="" visible={showConfirmDialog} style={{ width: '50vw', backgroundColor: 'gainsboro', padding: '10px', borderRadius: '10px', paddingTop: '0px' }} onHide={() => { if (!showConfirmDialog) return; setShowConfirmDialog(false); }}>
                   <h3>Atenção!</h3>
                    <p className="mt-2">
                        Excluir lançamento?
                    </p>
                    <Button style={{ borderRadius: '10px', marginRight: '10px', backgroundColor: 'lightgreen'}} label="Deletar" icon="pi pi-external-link" onClick={() => deletar()} />
                    <Button style={{ borderRadius: '10px'}} label="Cancelar" icon="pi pi-external-link" onClick={() => setShowConfirmDialog(false)} />
                </Dialog>
            </div>
        </Card>
    )
}

export default ConsultaLancamentos