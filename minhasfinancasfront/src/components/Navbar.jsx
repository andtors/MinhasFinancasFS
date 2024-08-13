import NavbarItem from "./NavbarItem"
import { useNavigate } from "react-router-dom"

import LocalStorageService from "../services/localStorageService"
import { mensagemSuccesso } from "./Toastr"

const Navbar = () => {

    const navigate = useNavigate()
    const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

    function deslogar() {
        LocalStorageService.removerItem('_usuario_logado')
        mensagemSuccesso('Deslogado com sucesso.')
        navigate('/login')
    }
    
    return (
        <div className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
            <div className="container">
                <a href="https://bootswatch.com/" className="navbar-brand">Minhas Finanças</a>
                <div>
                    <ul className="navbar-nav list-group list-group-horizontal">
                    { !usuarioLogado ? "" : <NavbarItem link="/home" label="Home"/>} 
                    { !usuarioLogado ? "" : <NavbarItem link="/lancamentos" label="Lançamentos"/>}    
                    { !usuarioLogado ? <NavbarItem link="/login" label="Login"/> : <NavbarItem func={deslogar} label="Sair"/> } 
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar