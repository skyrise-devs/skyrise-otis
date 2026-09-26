import { STATUS } from '../../data/ocorrencias'
import './gestao.css'

// P4 · Thiago
// A fazer: cards de indicadores, gráficos (CSS/SVG), filtro por período
// e alerta de elevadores reincidentes.
function TelaGestao({ ocorrencias }) {
  const porStatus = Object.keys(STATUS).map(s => ({
    status: s,
    total: ocorrencias.filter(o => o.status === s).length,
  }))

  return (
    <section className="tela-gestao">
      <h1>Gestão</h1>
      <p>Esta tela é da P4.</p>

      <ul>
        {porStatus.map(({ status, total }) => (
          <li key={status}>{STATUS[status].rotulo}: <b>{total}</b></li>
        ))}
      </ul>
    </section>
  )
}

export default TelaGestao
