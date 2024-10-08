import currencyFormatter from 'currency-formatter'

export default props => {
    const rows = props.lancamentos.map(lancamento => {
        return (
            <tr key={lancamento.id} >
                <td>{lancamento.descricao}</td>
                <td>{currencyFormatter.format(lancamento.valor, {locale: 'pt-BR'})}</td>
                <td>{lancamento.tipo}</td>
                <td>{lancamento.mes}</td>
                <td>{lancamento.status}</td>
                <td>
                    <button disabled={lancamento.status !== 'PENDENTE'} title='Efetivar' type='button' className='btn btn-success' onClick={(e) => props.alterarStatus(lancamento.id, 'EFETIVADO')}>
                        <i className='pi pi-check'></i>
                    </button>
                    <button disabled={lancamento.status !== 'PENDENTE'} title='Cancelar' type='button' className='btn btn-warning ms-1' onClick={(e) => props.alterarStatus(lancamento.id, 'CANCELADO')}>
                    <i className='pi pi-times'></i>
                    </button>
                    <button title='Editar' type='button' className='btn btn-primary ms-1' onClick={(e) => props.editAction(lancamento.id)}>
                    <i className='pi pi-pencil'></i>
                    </button>
                    <button title='Excluir' type='button' className='btn btn-danger ms-1' onClick={(e) => props.deleteAction(lancamento)}>
                    <i className='pi pi-trash'></i>
                    </button>
                </td>
            </tr>
        )
    })

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope='col'>Descrição</th>
                    <th scope='col'>Valor</th>
                    <th scope='col'>Tipo</th>
                    <th scope='col'>Mês</th>
                    <th scope='col'>Situação</th>
                    <th scope='col'>Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}

