// Etiqueta colorida da prioridade: CRÍTICA, ALTA, MÉDIA ou BAIXA
import { PRIORIDADES } from '../../../data/ocorrencias'

function BadgePrioridade({ prioridade }) {
  const info = PRIORIDADES[prioridade]

  // Prioridade desconhecida: não mostra nada em vez de quebrar a tela
  if (!info) return null

  return <span className={`at-badge at-badge-${prioridade}`}>{info.rotulo}</span>
}

export default BadgePrioridade
