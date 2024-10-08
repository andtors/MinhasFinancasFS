package com.example.demo.application.lancamento;

import com.example.demo.model.entity.Lancamento;
import com.example.demo.model.entity.Usuario;
import com.example.demo.model.enums.StatusLancamento;
import com.example.demo.model.enums.TipoLancamento;
import com.example.demo.model.exceptions.RegraNegocioException;
import com.example.demo.model.service.LancamentoService;
import com.example.demo.model.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lancamentos")
@RequiredArgsConstructor
public class LancamentoController {

    private final LancamentoService service;
    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity buscar(
            @RequestParam(value = "descricao", required = false) String descricao,
            @RequestParam(value = "tipo", required = false) String tipo,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "mes", required = false) Integer mes,
            @RequestParam(value = "ano", required = false) Integer ano,
            @RequestParam("usuario") Long idUsuario
    ){
    Lancamento lancamentoFiltro = new Lancamento();
    lancamentoFiltro.setDescricao(descricao);
    if(status != null){
        lancamentoFiltro.setStatus(StatusLancamento.valueOf(status));
    }

    if(tipo != null){
        lancamentoFiltro.setTipo(TipoLancamento.valueOf(tipo));
    }

    lancamentoFiltro.setMes(mes);
    lancamentoFiltro.setAno(ano);

    Optional<Usuario> usuario = usuarioService.obterPorId(idUsuario);
    if(usuario.isEmpty()){
        return ResponseEntity.badRequest().body("Não foi possivel realizar a consulta, usuario não encontrado para o Id informado");
    } else {
        lancamentoFiltro.setUsuario(usuario.get());
    }

    List<Lancamento> lancamentos = service.buscar(lancamentoFiltro);
    return ResponseEntity.ok(lancamentos);
    }

    @PostMapping
    public ResponseEntity salvar(@RequestBody LancamentoDTO dto) {
        try {
            Lancamento entidade = converter(dto);
            entidade = service.salvar(entidade);
            return new ResponseEntity(entidade, HttpStatus.CREATED);

        } catch (RegraNegocioException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("{id}") //id que irá puxar da url
    public ResponseEntity atualizar(@PathVariable("id") Long id, @RequestBody LancamentoDTO dto){
       return  service.obterPorId(id).map(entity -> {
           try {
               Lancamento lancamento = converter(dto);
               lancamento.setId(entity.getId());
               service.atualizar(lancamento);
               return ResponseEntity.ok(lancamento);
           } catch (RegraNegocioException e) {return ResponseEntity.badRequest().body(e.getMessage());
           }
        }).orElseGet( ()
               -> new ResponseEntity("Lançamento não encontrado na base de dados.", HttpStatus.BAD_REQUEST));
    }

    @PutMapping("{id}/atualiza-status")
    public ResponseEntity atualizarStatus(@PathVariable("id") Long id, @RequestBody AtualizaStatusDTO dto){
        return service.obterPorId(id).map(entity -> {
            StatusLancamento statusSelecionado = StatusLancamento.valueOf(dto.getStatus());
            if(statusSelecionado == null){
                return ResponseEntity.badRequest().body("Não foi possivel atualizar o status do lançamento, envie um status valido");
            }
            try {
                entity.setStatus(statusSelecionado);
                service.atualizar(entity);
                return ResponseEntity.ok(entity);
            } catch (RegraNegocioException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }).orElseGet( ()
         -> new ResponseEntity("Lançamento não encontrado na base de dados.", HttpStatus.BAD_REQUEST));
    }

    @GetMapping("{id}")
    public ResponseEntity obterLancamento( @PathVariable("id") Long id ) {
        return service.obterPorId(id)
                .map( lancamento -> new ResponseEntity(converter(lancamento), HttpStatus.OK) )
                .orElseGet( () -> new ResponseEntity("Lançamento não encontrado.",HttpStatus.NOT_FOUND) );
    }

    @DeleteMapping("{id}")
    public ResponseEntity deletar(@PathVariable("id") Long id){
        return service.obterPorId(id).map(entidade -> {
            service.deletar(entidade);
            return new ResponseEntity("Deletado com sucesso.",HttpStatus.OK);
        }).orElseGet( ()
                -> new ResponseEntity("Lançamento não encontrado na base de dados.", HttpStatus.BAD_REQUEST));
    }

    private LancamentoDTO converter(Lancamento lancamento) {
        return LancamentoDTO.builder()
                .id(lancamento.getId())
                .descricao(lancamento.getDescricao())
                .valor(lancamento.getValor())
                .mes(lancamento.getMes())
                .ano(lancamento.getAno())
                .status(lancamento.getStatus().name())
                .tipo(lancamento.getTipo().name())
                .usuario(lancamento.getUsuario().getId())
                .build();

    }

    private Lancamento converter (LancamentoDTO dto){
        Lancamento lancamento = new Lancamento();
        lancamento.setId(dto.getId());
        lancamento.setDescricao(dto.getDescricao());
        lancamento.setAno(dto.getAno());
        lancamento.setMes(dto.getMes());
        lancamento.setValor(dto.getValor());

        Usuario usuario = usuarioService
                .obterPorId(dto.getUsuario())
                .orElseThrow(() ->
                new RegraNegocioException("Usuário não encontrado para o id informado."));

        lancamento.setUsuario(usuario);
        if(dto.getTipo() != null) {
            lancamento.setTipo(TipoLancamento.valueOf(dto.getTipo()));
        }
        if(dto.getStatus() != null) {
            lancamento.setStatus(StatusLancamento.valueOf((dto.getStatus())));
        }

        return lancamento;
    }
}
