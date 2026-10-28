// Histórico da ocorrência em ordem cronológica (status, data e observação)
import { formatarData } from '../utilsAtendente'
import BadgeStatus from './BadgeStatus'

function LinhaDoTempo({ historico }) {
  return (
    <section className="at-historico" aria-label="Linha do tempo da ocorrência">
      <h3>Linha do tempo</h3>

      <ol className="at-linha-tempo">
        {historico.map((item, index) => (
          <li key={index} className="at-linha-item">
            <div className="at-linha-topo">
              <BadgeStatus status={item.status} />
              <span className="at-linha-data">{formatarData(item.data)}</span>
            </div>
            <p className="at-linha-obs">{item.observacao}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default LinhaDoTempo
