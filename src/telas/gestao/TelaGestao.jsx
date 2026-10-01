import { useEffect, useState } from 'react'
import GraficosGestao from './GraficosGestao.jsx'
import AlertaReincidentes from './AlertaReincidentes.jsx'
import {
  dataLocal, obterIntervalo, filtrarPorPeriodo, calcularIndicadores, formatarDuracao,
} from './indicadores.js'
import './gestao.css'

const PERIODOS = [
  { id: '7', rotulo: 'Últimos 7 dias' },
  { id: '30', rotulo: 'Últimos 30 dias' },
  { id: '90', rotulo: 'Últimos 90 dias' },
  { id: 'todos', rotulo: 'Todo o histórico' },
  { id: 'personalizado', rotulo: 'Personalizado' },
]

function IconeIndicador({ tipo }) {
  const caminhos = {
    total: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4m8-4v4M8 11h8m-8 4h5" /></>,
    abertas: <><path d="M4 6h16v14H4zM4 14h5l2 3h2l2-3h5M8 3h8" /></>,
    criticas: <><path d="m12 3 10 18H2L12 3Z" /><path d="M12 9v5m0 3v.5" /></>,
    tempo: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{caminhos[tipo]}</svg>
}

function TelaGestao({ ocorrencias }) {
  const [agora, setAgora] = useState(() => new Date())
  const [periodo, setPeriodo] = useState('30')
  const [inicio, setInicio] = useState(() => {
    const data = new Date()
    data.setDate(data.getDate() - 29)
    return dataLocal(data)
  })
  const [fim, setFim] = useState(() => dataLocal(new Date()))

  // Atualiza as janelas mesmo quando a gestão permanece aberta na virada do dia.
  useEffect(() => {
    const atualizar = () => setAgora(new Date())
    const timer = window.setInterval(atualizar, 60000)
    window.addEventListener('focus', atualizar)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', atualizar)
    }
  }, [])

  const intervalo = obterIntervalo(periodo, inicio, fim, agora)
  const filtradas = filtrarPorPeriodo(ocorrencias, intervalo)
  const indicadores = calcularIndicadores(filtradas, ocorrencias)
  const dataFinal = intervalo.erro ? null : new Date(intervalo.fim)
  if (dataFinal) dataFinal.setDate(dataFinal.getDate() - 1)
  const resumoPeriodo = intervalo.erro ? 'Ajuste as datas para consultar os indicadores.'
    : intervalo.inicio
      ? `${intervalo.inicio.toLocaleDateString('pt-BR')} a ${dataFinal.toLocaleDateString('pt-BR')}`
      : 'Todas as ocorrências registradas até hoje'

  return (
    <section className="tela-gestao" aria-labelledby="gestao-titulo">
      <header className="gestao-cabecalho">
        <div>
          <p className="gestao-sobretitulo">Visão operacional</p>
          <h1 id="gestao-titulo">Gestão</h1>
          <p className="gestao-descricao">Acompanhe as ocorrências e antecipe a necessidade de manutenção.</p>
        </div>
        <span className="gestao-etiqueta">Dados da operação</span>
      </header>

      <section className="gestao-painel gestao-filtros" aria-label="Filtro por período">
        <div className="gestao-campo">
          <label htmlFor="gestao-periodo">Período de análise</label>
          <select id="gestao-periodo" value={periodo} onChange={e => setPeriodo(e.target.value)}>
            {PERIODOS.map(opcao => <option key={opcao.id} value={opcao.id}>{opcao.rotulo}</option>)}
          </select>
        </div>
        {periodo === 'personalizado' && <>
          <div className="gestao-campo">
            <label htmlFor="gestao-inicio">Data inicial</label>
            <input id="gestao-inicio" type="date" value={inicio} onChange={e => setInicio(e.target.value)}
              aria-invalid={Boolean(intervalo.erro)} aria-describedby={intervalo.erro ? 'gestao-erro-periodo' : undefined} />
          </div>
          <div className="gestao-campo">
            <label htmlFor="gestao-fim">Data final</label>
            <input id="gestao-fim" type="date" value={fim} onChange={e => setFim(e.target.value)}
              aria-invalid={Boolean(intervalo.erro)} aria-describedby={intervalo.erro ? 'gestao-erro-periodo' : undefined} />
          </div>
        </>}
        <p className="gestao-filtro-resumo">{resumoPeriodo}<span>Considera a data de abertura da ocorrência.</span></p>
        {intervalo.erro && <p id="gestao-erro-periodo" className="gestao-erro" role="alert">{intervalo.erro}</p>}
      </section>

      <p className="gestao-contagem" role="status">
        {intervalo.erro ? 'Período inválido' : `${indicadores.total} ${indicadores.total === 1 ? 'ocorrência no período' : 'ocorrências no período'}`}
      </p>

      <dl className="gestao-indicadores">
        <div className="gestao-card">
          <dt>Total de ocorrências<span className="gestao-card-icone"><IconeIndicador tipo="total" /></span></dt>
          <dd>{intervalo.erro ? '—' : indicadores.total}</dd>
          <p>No período selecionado</p>
        </div>
        <div className="gestao-card">
          <dt>Abertas<span className="gestao-card-icone"><IconeIndicador tipo="abertas" /></span></dt>
          <dd>{intervalo.erro ? '—' : indicadores.abertas}</dd>
          <p>{intervalo.erro ? 'Aguardando período válido' : `${indicadores.emAtendimento} em atendimento no período`}</p>
        </div>
        <div className={`gestao-card gestao-card-criticas${indicadores.criticas ? ' com-criticas' : ''}`}>
          <dt>Críticas agora<span className="gestao-card-icone"><IconeIndicador tipo="criticas" /></span></dt>
          <dd>{indicadores.criticas}</dd>
          <p>Pendentes em todo o histórico</p>
        </div>
        <div className="gestao-card">
          <dt>Tempo médio de resolução<span className="gestao-card-icone"><IconeIndicador tipo="tempo" /></span></dt>
          <dd className="gestao-card-duracao">{intervalo.erro ? '—' : formatarDuracao(indicadores.tempoMedio)}</dd>
          <p>{intervalo.erro ? 'Aguardando período válido' : indicadores.resolvidas
            ? `Abertura até resolução · ${indicadores.resolvidas} concluídas`
            : 'Sem resoluções válidas no período'}</p>
        </div>
      </dl>

      {!intervalo.erro && !filtradas.length && <div className="gestao-vazio gestao-painel">
        <strong>Nenhuma ocorrência neste período</strong>
        <p>Escolha outro intervalo para consultar o histórico da operação.</p>
      </div>}
      {!intervalo.erro && filtradas.length > 0 && <GraficosGestao ocorrencias={filtradas} intervalo={intervalo} />}
      <AlertaReincidentes ocorrencias={ocorrencias} agora={agora} />
    </section>
  )
}

export default TelaGestao
