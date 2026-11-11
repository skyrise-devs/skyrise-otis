import { useState } from 'react'
import { PRIORIDADES, TIPOS, STATUS, buscarElevador, buscarTecnico } from '../../data/ocorrencias'
import { tempoDesde, formatarDataHora, formatarDuracao } from './tempo'

// Um card da fila do técnico. O botão muda conforme a situação:
// sem técnico → Assumir · comigo em atendimento → Registrar andamento / Concluir · resolvida → resumo.
function CartaoOcorrencia({ ocorrencia: o, tecnicoId, regiaoDoTecnico, agora, onAssumir, onAtualizar }) {
  const [observacao, setObservacao] = useState('')
  const [erro, setErro] = useState('')

  const elevador = buscarElevador(o.elevadorId)
  const responsavel = buscarTecnico(o.tecnicoId)
  const ehMinha = o.tecnicoId === tecnicoId
  const mesmaRegiao = elevador?.regiao === regiaoDoTecnico
  const idCampo = `obs-${o.id}`

  function enviar(status) {
    const texto = observacao.trim()
    if (texto.length < 5) {
      setErro(status === 'resolvida'
        ? 'Conte o que foi feito (pelo menos 5 caracteres) para concluir.'
        : 'Escreva o andamento (pelo menos 5 caracteres).')
      return
    }
    onAtualizar(o.id, status, texto)
    setObservacao('')
    setErro('')
  }

  return (
    <article
      className={`tecnico-cartao prioridade-${o.prioridade} status-${o.status}${ehMinha ? ' minha' : ''}`}
      aria-labelledby={`titulo-${o.id}`}
    >
      <div className="tecnico-cartao-topo">
        <span className="tecnico-prioridade">
          {o.prioridade === 'critica' && o.status !== 'resolvida' && <span className="tecnico-pulso" aria-hidden="true" />}
          {PRIORIDADES[o.prioridade].rotulo}
        </span>
        <span className={`tecnico-status status-${o.status}`}>{STATUS[o.status].rotulo}</span>
        <span className="tecnico-id">{o.id}</span>
      </div>

      <h3 id={`titulo-${o.id}`}>{TIPOS[o.tipo].rotulo}</h3>
      <p className="tecnico-descricao">{o.descricao}</p>

      <dl className="tecnico-detalhes">
        <div>
          <dt>Local</dt>
          <dd>
            <strong>{elevador?.predio ?? o.elevadorId}</strong> · {elevador?.identificacao}
            <span>{elevador?.endereco} · {elevador?.regiao}</span>
            {mesmaRegiao && <span className="tecnico-tag">Sua região</span>}
          </dd>
        </div>
        <div>
          <dt>Solicitante</dt>
          <dd>{o.solicitante}</dd>
        </div>
        <div>
          <dt>{o.status === 'resolvida' ? 'Resolvida em' : 'Esperando há'}</dt>
          <dd>
            {o.status === 'resolvida'
              ? `${formatarDataHora(o.resolvidaEm)} · levou ${formatarDuracao(new Date(o.resolvidaEm) - new Date(o.abertaEm))}`
              : tempoDesde(o.abertaEm, agora)}
          </dd>
        </div>
        <div>
          <dt>Responsável</dt>
          <dd>{responsavel ? (ehMinha ? `Você (${responsavel.nome})` : responsavel.nome) : 'Ninguém assumiu ainda'}</dd>
        </div>
      </dl>

      {o.status === 'aberta' && !o.tecnicoId && (
        <button type="button" className="tecnico-botao principal" onClick={() => onAssumir(o.id)}>
          Assumir ocorrência
        </button>
      )}

      {o.status === 'aberta' && ehMinha && (
        <button type="button" className="tecnico-botao principal" onClick={() => onAtualizar(o.id, 'em_atendimento', 'Atendimento iniciado')}>
          Iniciar atendimento
        </button>
      )}

      {o.status === 'em_atendimento' && ehMinha && (
        <form className="tecnico-acoes" onSubmit={e => { e.preventDefault(); enviar('resolvida') }}>
          <label htmlFor={idCampo}>Observação do atendimento</label>
          <textarea
            id={idCampo}
            rows="2"
            value={observacao}
            placeholder="Ex.: Troquei o sensor da porta e testei 5 ciclos."
            onChange={e => { setObservacao(e.target.value); setErro('') }}
            aria-invalid={Boolean(erro)}
            aria-describedby={erro ? `erro-${o.id}` : undefined}
          />
          {erro && <p id={`erro-${o.id}`} className="tecnico-erro" role="alert">{erro}</p>}
          <div className="tecnico-acoes-botoes">
            <button type="button" className="tecnico-botao" onClick={() => enviar('em_atendimento')}>
              Registrar andamento
            </button>
            <button type="submit" className="tecnico-botao concluir">
              Concluir atendimento
            </button>
          </div>
        </form>
      )}

      {o.status === 'em_atendimento' && !ehMinha && (
        <p className="tecnico-aviso">Em atendimento por {responsavel?.nome ?? 'outro técnico'}.</p>
      )}

      <details className="tecnico-historico">
        <summary>Histórico ({o.historico.length})</summary>
        <ol>
          {[...o.historico].reverse().map((h, i) => (
            <li key={`${h.data}-${i}`}>
              <time dateTime={h.data}>{formatarDataHora(h.data)}</time>
              <strong>{STATUS[h.status]?.rotulo ?? h.status}</strong>
              {h.observacao && <span>{h.observacao}</span>}
            </li>
          ))}
        </ol>
      </details>
    </article>
  )
}

export default CartaoOcorrencia
