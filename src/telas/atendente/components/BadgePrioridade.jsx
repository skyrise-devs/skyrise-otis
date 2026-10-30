import { PRIORIDADES } from '../../../data/ocorrencias'

function BadgePrioridade({ prioridade }) {
  const info = PRIORIDADES[prioridade]

  if (!info) return null

  return <span className={`at-badge at-badge-${prioridade}`}>{info.rotulo}</span>
}

export default BadgePrioridade
