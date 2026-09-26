import { PRIORIDADES, TIPOS, filaDeAtendimento, buscarTecnico } from '../../data/ocorrencias'
import './tecnico.css'

// P3 · Ju
// A fazer: fila com destaque para crítica, atribuir técnico (onAtribuir),
// mudar status (onAtualizarStatus) e layout pensado para celular.
function TelaTecnico({ ocorrencias }) {
  const fila = filaDeAtendimento(ocorrencias)

  return (
    <section className="tela-tecnico">
      <h1>Técnico</h1>
      <p>{fila.length} ocorrências na fila. Esta tela é da P3.</p>

      <ol>
        {fila.map(o => (
          <li key={o.id}>
            <b>{PRIORIDADES[o.prioridade].rotulo}</b> · {o.id} · {TIPOS[o.tipo].rotulo} · {buscarTecnico(o.tecnicoId)?.nome ?? 'Sem técnico'}
          </li>
        ))}
      </ol>
    </section>
  )
}

export default TelaTecnico
