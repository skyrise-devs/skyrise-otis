import { TIPOS, STATUS, buscarElevador } from '../../data/ocorrencias'
import './atendente.css'

// P2 · Pedro Henrique
// A fazer: formulário de abertura (use validarOcorrencia + onRegistrar),
// lista com busca e filtros, e a tela de detalhe com o histórico.
function TelaAtendente({ ocorrencias }) {
  return (
    <section className="tela-atendente">
      <h1>Atendente</h1>
      <p>{ocorrencias.length} ocorrências registradas. Esta tela é da P2.</p>

      <ul>
        {ocorrencias.slice(0, 5).map(o => (
          <li key={o.id}>
            <b>{o.id}</b> · {TIPOS[o.tipo].rotulo} · {buscarElevador(o.elevadorId)?.predio} · {STATUS[o.status].rotulo}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TelaAtendente
