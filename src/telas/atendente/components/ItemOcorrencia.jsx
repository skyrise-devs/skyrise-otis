// Uma linha da lista: número, tipo, prédio, prioridade e status
import { TIPOS, buscarElevador } from '../../../data/ocorrencias'
import { formatarData } from '../utilsAtendente'
import BadgePrioridade from './BadgePrioridade'
import BadgeStatus from './BadgeStatus'

function ItemOcorrencia({ ocorrencia }) {
  const elevador = buscarElevador(ocorrencia.elevadorId)
  const tipo = TIPOS[ocorrencia.tipo]?.rotulo ?? ocorrencia.tipo
  const local = elevador ? elevador.predio : ocorrencia.elevadorId
  const resolvida = ocorrencia.status === 'resolvida'

  return (
    <li className={`at-item at-item-${ocorrencia.prioridade}${resolvida ? ' at-item-resolvida' : ''}`}>
      <div className="at-item-topo">
        <strong className="at-item-id">{ocorrencia.id}</strong>
        <BadgePrioridade prioridade={ocorrencia.prioridade} />
        <BadgeStatus status={ocorrencia.status} />
        <span className="at-item-data">{formatarData(ocorrencia.abertaEm)}</span>
      </div>

      <p className="at-item-titulo">{`${tipo} · ${local}`}</p>
      <p className="at-item-descricao">{ocorrencia.descricao}</p>
      <small className="at-item-solicitante">{`Solicitante: ${ocorrencia.solicitante}`}</small>
    </li>
  )
}

export default ItemOcorrencia
