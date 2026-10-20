// Etiqueta do status da ocorrência: Aberta, Em atendimento ou Resolvida
import { STATUS } from '../../../data/ocorrencias'

function BadgeStatus({ status }) {
  const info = STATUS[status]

  // Status desconhecido: não mostra nada em vez de quebrar a tela
  if (!info) return null

  return <span className={`at-status at-status-${status}`}>{info.rotulo}</span>
}

export default BadgeStatus
