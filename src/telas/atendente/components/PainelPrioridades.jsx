// Legenda das regras: tipo de ocorrência → prioridade (passageiro preso fura a fila)
import { TIPOS } from '../../../data/ocorrencias'
import BadgePrioridade from './BadgePrioridade'

// Do mais urgente para o menos urgente
const ORDEM_DOS_TIPOS = ['passageiro_preso', 'falha_tecnica', 'falta_energia', 'pedido_cliente']

// Ajuda o atendente a escolher o tipo certo (e, com ele, a prioridade certa)
const DICAS = {
  passageiro_preso: 'Há pessoas dentro da cabine sem conseguir sair.',
  falha_tecnica: 'O elevador funciona com defeito: porta, ruído, nível ou botoeira.',
  falta_energia: 'O elevador parou por queda ou oscilação de energia.',
  pedido_cliente: 'Revisão, orçamento ou ajuste que não tem urgência.',
}

function PainelPrioridades() {
  return (
    <section className="at-cartao at-painel-prioridades">
      <h2>Como definimos a prioridade</h2>
      <p>O sistema calcula sozinho, a partir do tipo da ocorrência.</p>

      <ul className="at-lista-prioridades">
        {ORDEM_DOS_TIPOS.map(tipo => (
          <li key={tipo}>
            <BadgePrioridade prioridade={TIPOS[tipo].prioridade} />
            <div>
              <span className="at-tipo-rotulo">{TIPOS[tipo].rotulo}</span>
              <small className="at-tipo-dica">{DICAS[tipo]}</small>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PainelPrioridades
