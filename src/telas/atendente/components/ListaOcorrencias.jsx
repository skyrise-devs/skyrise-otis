// Lista de ocorrências com estado vazio ("nenhum resultado")
import { ordenarOcorrencias } from '../utilsAtendente'
import ItemOcorrencia from './ItemOcorrencia'

function ListaOcorrencias({ ocorrencias }) {
  const ordenadas = ordenarOcorrencias(ocorrencias)
  const quantidade = ordenadas.length

  return (
    <div className="at-lista">
      <p className="at-lista-contador">
        {`${quantidade} ${quantidade === 1 ? 'ocorrência' : 'ocorrências'}`}
        {' · '}críticas primeiro, depois as mais antigas; as resolvidas ficam no fim
      </p>

      {quantidade === 0 ? (
        <p className="at-lista-vazia">
          Nenhuma ocorrência por aqui ainda. Registre a primeira no formulário.
        </p>
      ) : (
        <ul className="at-lista-itens">
          {ordenadas.map(o => (
            <ItemOcorrencia key={o.id} ocorrencia={o} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default ListaOcorrencias
