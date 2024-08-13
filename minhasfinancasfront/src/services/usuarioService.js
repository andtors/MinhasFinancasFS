import ApiService from "./apiservices";

class UsuarioService extends ApiService {

    autenticar(credenciais){
        
        return this.post('/usuarios/autenticar', credenciais)
    }
    
    obterSaldoPorUsuario(id){
        return this.get(`/usuarios/${id}/saldo`)
    }
    
    salvar(usuario){
        return this.post('/usuarios', usuario)
    }
}

export default UsuarioService;