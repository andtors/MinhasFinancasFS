package com.example.demo.model.service;

import com.example.demo.model.entity.Usuario;
import com.example.demo.model.exceptions.ErroAutenticacao;
import com.example.demo.model.exceptions.RegraNegocioException;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

// é onde toda a lógica será feita das nossas querymethods
@Service
//@RequiredArgsConstructor posso usar o lombok para criar um construtor automaticamente
public class UsuarioServiceImpl implements UsuarioService{

    private final UsuarioRepository repository;

    //@Autowired não é mais necessario quando só há um Implementation
    public UsuarioServiceImpl(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Override
    public Usuario autenticar(String email, String senha) {
        Optional<Usuario> usuario = repository.findByEmail(email);

        if(usuario.isEmpty()){
            throw new ErroAutenticacao("Usuario não encontrado para o email informado!");
        }

        boolean matches = usuario.get().getSenha().equals(senha);

        if(!matches){
            throw new ErroAutenticacao("Senha invalidá!");
        }

        return usuario.get();
    }


    @Override
    @Transactional
    public Usuario salvarUsuario(Usuario usuario) {
        validarEmail(usuario.getEmail());
        validar(usuario.getEmail(), usuario.getNome(), usuario.getSenha());
        return repository.save(usuario);
    }

    @Override
    public void validarEmail(String email) {
        boolean existe = repository.existsByEmail(email);

        if(existe){
            throw new RegraNegocioException("Já existe um usuario cadastrado com este e-mail!");
        }
    }

    @Override
    public void validar(String email, String nome, String senha) {
        if(email.isEmpty()){
            throw new RegraNegocioException("O e-mail é obrigatorio.");
        }

        if(nome.isEmpty()){
            throw new RegraNegocioException("O nome é obrigatorio.");
        }

        if(senha.isEmpty()) {
            throw new RegraNegocioException("A senha é obrigatorio.");
        }
    }

    @Override
    public Optional<Usuario>  obterPorId(Long id) {
        return repository.findById(id);
    }
}
