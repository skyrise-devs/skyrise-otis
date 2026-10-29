// Lista de ocorrências com estado vazio ("nenhum resultado")
import { ordenarOcorrencias } from '../utilsAtendente'
import ItemOcorrencia from './ItemOcorrencia'

// ocorrencias: as que devem aparecer (já filtradas) · total: quantas existem sem filtro
// filtrando: há algum filtro ligado? (muda o contador e a mensagem de lista vazia)
// onAbrir: chamado com o id da ocorrência quando o atendente pede os detalhes
// onLimparFiltros: atalho no estado vazio quando a busca não retorna resultados
function ListaOcorrencias({
  ocorrencias,
  total = ocorrencias.length,
  filtrando = false,
  onAbrir,
  onLimparFiltros,
}) {
  const ordenadas = ordenarOcorrencias(ocorrencias)
  const quantidade = ordenadas.length

  const contador = filtrando
    ? `Mostrando ${quantidade} de ${total}`
    : `${quantidade} ${quantidade === 1 ? 'ocorrência' : 'ocorrências'}`

  return (
    <div className="at-lista">
      <p className="at-lista-contador">
        {contador}
        {' · '}críticas primeiro, depois as mais antigas; as resolvidas ficam no fim
      </p>

      {quantidade === 0 ? (
        <div className="at-lista-vazia">
          <p>
            {filtrando
              ? 'Nenhuma ocorrência encontrada com esses filtros. Tente outro termo ou limpe os filtros.'
              : 'Nenhuma ocorrência por aqui ainda. Registre a primeira no formulário.'}
          </p>
          {filtrando && onLimparFiltros && (
            <button type="button" className="at-btn" onClick={onLimparFiltros}>
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <ul className="at-lista-itens">
          {ordenadas.map(o => (
            <ItemOcorrencia key={o.id} ocorrencia={o} onAbrir={onAbrir} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default ListaOcorrencias
