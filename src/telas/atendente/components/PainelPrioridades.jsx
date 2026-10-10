// Legenda das regras: tipo de ocorrência → prioridade (passageiro preso fura a fila)
import { TIPOS } from '../../../data/ocorrencias'
import BadgePrioridade from './BadgePrioridade'

// Do mais urgente para o menos urgente
const ORDEM_DOS_TIPOS = ['passageiro_preso', 'falha_tecnica', 'falta_energia', 'pedido_cliente']

function PainelPrioridades() {
  return (
    <section className="at-cartao at-painel-prioridades">
      <h2>Como definimos a prioridade</h2>
      <p>O sistema calcula sozinho, a partir do tipo da ocorrência.</p>

      <ul className="at-lista-prioridades">
        {ORDEM_DOS_TIPOS.map(tipo => (
          <li key={tipo}>
            <BadgePrioridade prioridade={TIPOS[tipo].prioridade} />
            <span className="at-tipo-rotulo">{TIPOS[tipo].rotulo}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PainelPrioridades
