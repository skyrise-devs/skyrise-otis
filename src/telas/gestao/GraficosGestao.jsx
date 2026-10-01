import { useState } from 'react'
import { agruparPorTipo, agruparPorLocal, agruparPorPeriodo } from './indicadores.js'

function GraficoBarras({ grupos, total, porTipo = false }) {
  const maior = Math.max(1, ...grupos.map(grupo => grupo.total))
  return (
    <ul className="gestao-barras">
      {grupos.map(grupo => (
        <li key={grupo.id}>
          <div className="gestao-barra-cabecalho">
            <span>{grupo.rotulo}{grupo.detalhe && <small>{grupo.detalhe}</small>}</span>
            <span className="gestao-barra-valor"><strong>{grupo.total}</strong><small>{total ? Math.round(grupo.total / total * 100) : 0}%</small></span>
          </div>
          <div className="gestao-barra-trilho" aria-hidden="true">
            <div className={`gestao-barra-preenchimento${porTipo ? ` tipo-${grupo.id}` : ''}`}
              style={{ width: `${grupo.total / maior * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

function GraficoPeriodo({ ocorrencias, intervalo }) {
  const { escala, grupos } = agruparPorPeriodo(ocorrencias, intervalo)
  const rotulosEscala = { dia: 'dia', semana: 'semana', mes: 'mês' }
  const maior = Math.max(4, ...grupos.map(grupo => grupo.total))
  const passo = 900 / grupos.length
  const largura = Math.max(1, Math.min(50, passo * .65))
  const marcaCada = Math.max(1, Math.ceil(grupos.length / 7))
  return (
    <section className="gestao-painel gestao-grafico-periodo" aria-labelledby="gestao-periodo-titulo">
      <div className="gestao-painel-cabecalho">
        <div>
          <h2 id="gestao-periodo-titulo">Ocorrências ao longo do tempo</h2>
          <p>Aberturas por {rotulosEscala[escala]} no período selecionado.</p>
        </div>
        <span className="gestao-etiqueta">{ocorrencias.length} no período</span>
      </div>
      <div className="gestao-tempo-scroll" tabIndex={0} role="region" aria-label="Gráfico temporal com rolagem horizontal em telas pequenas">
      <svg className="gestao-grafico-tempo" viewBox="0 0 960 260" role="img"
        aria-label={`Gráfico de ocorrências por ${rotulosEscala[escala]}. ${ocorrencias.length} no período. Valores completos disponíveis em Ver dados do gráfico.`}>
        {[0, Math.ceil(maior / 2), maior].map(valor => {
          const y = 210 - valor / maior * 180
          return <g key={valor} className="gestao-grafico-eixo">
            <line x1="42" x2="942" y1={y} y2={y} />
            <text x="30" y={y + 4} textAnchor="end">{valor}</text>
          </g>
        })}
        {grupos.map((grupo, indice) => {
          const x = 42 + passo * (indice + .5)
          const altura = grupo.total / maior * 180
          return <g key={grupo.id}>
            <rect className="gestao-coluna" x={x - largura / 2} y={210 - altura} width={largura} height={altura} rx="3">
              <title>{`${grupo.detalhe}: ${grupo.total} ocorrências`}</title>
            </rect>
            {((indice % marcaCada === 0 && grupos.length - 1 - indice >= marcaCada / 2) || indice === grupos.length - 1) &&
              <text className="gestao-grafico-rotulo" x={x} y="239" textAnchor="middle">{grupo.rotulo}</text>}
          </g>
        })}
      </svg>
      </div>
      <details className="gestao-dados-grafico">
        <summary>Ver dados do gráfico</summary>
        <div className="gestao-tabela-scroll">
          <table>
            <caption>Aberturas por {rotulosEscala[escala]}</caption>
            <thead><tr><th scope="col">Período</th><th scope="col">Ocorrências</th></tr></thead>
            <tbody>{grupos.map(grupo => <tr key={grupo.id}>
              <th scope="row">{grupo.detalhe}</th><td>{grupo.total}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </details>
    </section>
  )
}

function GraficosGestao({ ocorrencias, intervalo }) {
  const [local, setLocal] = useState('regiao')
  const tipos = agruparPorTipo(ocorrencias)
  const locais = agruparPorLocal(ocorrencias, local)

  return (
    <>
      <div className="gestao-graficos">
        <section className="gestao-painel" aria-labelledby="gestao-tipos-titulo">
          <div className="gestao-painel-cabecalho">
            <div>
              <h2 id="gestao-tipos-titulo">Ocorrências por tipo</h2>
              <p>Distribuição dos registros no período.</p>
            </div>
          </div>
          <GraficoBarras grupos={tipos} total={ocorrencias.length} porTipo />
        </section>
        <section className="gestao-painel" aria-labelledby="gestao-locais-titulo">
          <div className="gestao-painel-cabecalho">
            <div>
              <h2 id="gestao-locais-titulo">Ocorrências por {local === 'regiao' ? 'região' : 'elevador'}</h2>
              <p>Locais com maior volume de registros.</p>
            </div>
            <div className="gestao-alternador" role="group" aria-label="Agrupar ocorrências por">
              <button type="button" aria-pressed={local === 'regiao'} onClick={() => setLocal('regiao')}>Região</button>
              <button type="button" aria-pressed={local === 'elevador'} onClick={() => setLocal('elevador')}>Elevador</button>
            </div>
          </div>
          <GraficoBarras grupos={locais} total={ocorrencias.length} />
        </section>
      </div>
      <GraficoPeriodo ocorrencias={ocorrencias} intervalo={intervalo} />
    </>
  )
}

export default GraficosGestao
