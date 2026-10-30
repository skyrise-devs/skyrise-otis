import { identificarReincidentes, DIAS_REINCIDENCIA, LIMITE_REINCIDENCIA } from './indicadores.js'

function AlertaReincidentes({ ocorrencias, agora }) {
  const reincidentes = identificarReincidentes(ocorrencias, agora)

  return (
    <section className="gestao-painel gestao-reincidentes" aria-labelledby="gestao-reincidentes-titulo">
      <div className="gestao-painel-cabecalho">
        <div>
          <p className="gestao-sobretitulo">Monitoramento preventivo</p>
          <h2 id="gestao-reincidentes-titulo">Elevadores reincidentes</h2>
          <p>Falhas repetidas sinalizam equipamentos que precisam de atenção preventiva.</p>
        </div>
        <span className="gestao-etiqueta">Últimos {DIAS_REINCIDENCIA} dias · janela fixa</span>
      </div>

      <p className="gestao-regra-reincidencia">
        Alerta a partir de <strong>{LIMITE_REINCIDENCIA} ocorrências</strong> de falha técnica ou passageiro preso no mesmo elevador.
        Esta janela independe do filtro de análise.
      </p>

      {reincidentes.length ? <>
        <p className="gestao-total-alertas" role="status">
          {reincidentes.length} {reincidentes.length === 1 ? 'elevador merece' : 'elevadores merecem'} atenção
        </p>
        <ul className="gestao-lista-reincidentes">
          {reincidentes.map(item => <li key={item.id} className="gestao-reincidente">
            <div className="gestao-reincidente-local">
              <span className="gestao-elevador-id">{item.id}</span>
              <h3>{item.elevador?.predio ?? 'Elevador não cadastrado'}</h3>
              <p>{item.elevador?.identificacao ?? item.id} · {item.elevador?.regiao ?? 'Sem região'}</p>
              <p className="gestao-ultima-falha">Última falha: {new Date(item.ultimaEm).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}</p>
            </div>
            <div className="gestao-reincidente-numeros">
              <strong>{item.total}<span>falhas em {DIAS_REINCIDENCIA} dias</span></strong>
              <p>{item.pendentes ? `${item.pendentes} ${item.pendentes === 1 ? 'pendente' : 'pendentes'}` : 'Sem falhas pendentes'}</p>
            </div>
            <div className="gestao-recomendacao">
              <strong>Priorizar inspeção preventiva</strong>
              <p>Mais frequente: {item.tipoMaisFrequente.rotulo.toLocaleLowerCase('pt-BR')} ({item.tipoMaisFrequente.total} registros).</p>
              <p>Revisar o histórico e avaliar a causa das falhas com a equipe técnica.</p>
            </div>
          </li>)}
        </ul>
      </> : <div className="gestao-vazio gestao-sem-reincidentes" role="status">
        <strong>Nenhum elevador reincidente nesta janela</strong>
        <p>Nenhum equipamento atingiu {LIMITE_REINCIDENCIA} falhas nos últimos {DIAS_REINCIDENCIA} dias.</p>
      </div>}

      <p className="gestao-nota-preventiva">Sinal preventivo baseado no histórico de ocorrências. A repetição orienta a inspeção e não estima quando uma nova falha ocorrerá.</p>
    </section>
  )
}

export default AlertaReincidentes
