import { useEffect, useState } from 'react'
import { TECNICOS, filaDeAtendimento, buscarElevador, buscarTecnico } from '../../data/ocorrencias'
import CartaoOcorrencia from './CartaoOcorrencia'
import './tecnico.css'

// P3 · Ju
// Fila do técnico de campo, pensada para o celular: crítica primeiro ("fura fila"),
// assumir ocorrência (onAtribuir) e atualizar o status (onAtualizarStatus).

// Lembra quem está usando este aparelho (só neste navegador)
const CHAVE_TECNICO = 'skyrise:tecnico:v1'

const ABAS = [
  { id: 'fila', rotulo: 'Fila geral' },
  { id: 'minhas', rotulo: 'Minhas' },
  { id: 'concluidas', rotulo: 'Concluídas' },
]

function carregarTecnico() {
  try {
    const id = localStorage.getItem(CHAVE_TECNICO)
    return buscarTecnico(id) ? id : ''
  } catch {
    return ''
  }
}

function salvarTecnico(id) {
  try {
    if (id) localStorage.setItem(CHAVE_TECNICO, id)
    else localStorage.removeItem(CHAVE_TECNICO)
  } catch {
    // Armazenamento bloqueado: o técnico escolhe de novo na próxima visita.
  }
}

function TelaTecnico({ ocorrencias, onAtribuir, onAtualizarStatus }) {
  const [tecnicoId, setTecnicoId] = useState(carregarTecnico)
  const [aba, setAba] = useState('fila')
  const [soMinhaRegiao, setSoMinhaRegiao] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [agora, setAgora] = useState(() => Date.now())

  // Atualiza o "esperando há" a cada minuto
  useEffect(() => {
    const timer = window.setInterval(() => setAgora(Date.now()), 60000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    salvarTecnico(tecnicoId)
  }, [tecnicoId])

  const tecnico = buscarTecnico(tecnicoId)

  if (!tecnico) {
    return (
      <section className="tela-tecnico" aria-labelledby="tecnico-titulo">
        <header className="tecnico-cabecalho">
          <div>
            <p className="tecnico-sobretitulo">Técnico de campo</p>
            <h1 id="tecnico-titulo">Quem está em campo?</h1>
            <p className="tecnico-texto-suave">Escolha o seu nome para ver a fila e assumir ocorrências.</p>
          </div>
        </header>

        <ul className="tecnico-escolha">
          {TECNICOS.map(t => (
            <li key={t.id}>
              <button type="button" onClick={() => setTecnicoId(t.id)}>
                <span className="tecnico-avatar" aria-hidden="true">{iniciais(t.nome)}</span>
                <span>
                  <strong>{t.nome}</strong>
                  <small>{t.regiao}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  const fila = filaDeAtendimento(ocorrencias)
  const minhas = fila.filter(o => o.tecnicoId === tecnicoId)
  const concluidas = ocorrencias
    .filter(o => o.status === 'resolvida' && o.tecnicoId === tecnicoId)
    .sort((a, b) => b.resolvidaEm.localeCompare(a.resolvidaEm))
    .slice(0, 10)

  const naRegiao = o => buscarElevador(o.elevadorId)?.regiao === tecnico.regiao
  const listas = {
    fila: soMinhaRegiao ? fila.filter(naRegiao) : fila,
    minhas,
    concluidas,
  }
  const lista = listas[aba]

  const criticasAguardando = fila.filter(o => o.prioridade === 'critica' && o.status === 'aberta').length
  const aguardandoTecnico = fila.filter(o => o.status === 'aberta' && !o.tecnicoId).length

  function assumir(id) {
    onAtribuir(id, tecnicoId)
    setMensagem(`${id} é sua agora. Ela também aparece na aba Minhas.`)
  }

  function atualizar(id, status, observacao) {
    onAtualizarStatus(id, status, observacao)
    setMensagem(status === 'resolvida'
      ? `${id} concluída. Bom trabalho!`
      : `Andamento registrado em ${id}.`)
  }

  function trocarTecnico() {
    setTecnicoId('')
    setAba('fila')
    setMensagem('')
  }

  return (
    <section className="tela-tecnico" aria-labelledby="tecnico-titulo">
      <header className="tecnico-cabecalho">
        <div>
          <p className="tecnico-sobretitulo">Técnico de campo</p>
          <h1 id="tecnico-titulo">Fila de atendimento</h1>
          <p className="tecnico-texto-suave">Crítica primeiro; depois, a mais antiga.</p>
        </div>
        <div className="tecnico-usuario">
          <span className="tecnico-avatar" aria-hidden="true">{iniciais(tecnico.nome)}</span>
          <span>
            <strong>{tecnico.nome}</strong>
            <small>{tecnico.regiao}</small>
          </span>
          <button type="button" onClick={trocarTecnico}>Trocar</button>
        </div>
      </header>

      <dl className="tecnico-resumo">
        <div className={criticasAguardando ? 'com-criticas' : ''}>
          <dt>Críticas aguardando</dt>
          <dd>{criticasAguardando}</dd>
        </div>
        <div>
          <dt>Sem técnico</dt>
          <dd>{aguardandoTecnico}</dd>
        </div>
        <div>
          <dt>Comigo agora</dt>
          <dd>{minhas.length}</dd>
        </div>
      </dl>

      <div className="tecnico-barra">
        <div className="tecnico-abas" role="group" aria-label="O que mostrar">
          {ABAS.map(a => (
            <button
              key={a.id}
              type="button"
              className={a.id === aba ? 'ativo' : ''}
              aria-pressed={a.id === aba}
              onClick={() => setAba(a.id)}
            >
              {a.rotulo}
              <span className="tecnico-abas-total">{listas[a.id].length}</span>
            </button>
          ))}
        </div>

        {aba === 'fila' && (
          <label className="tecnico-filtro">
            <input type="checkbox" checked={soMinhaRegiao} onChange={e => setSoMinhaRegiao(e.target.checked)} />
            Só a minha região ({tecnico.regiao})
          </label>
        )}
      </div>

      <p className="tecnico-mensagem" role="status">{mensagem}</p>

      {lista.length > 0 ? (
        <div className="tecnico-lista">
          {lista.map(o => (
            <CartaoOcorrencia
              key={o.id}
              ocorrencia={o}
              tecnicoId={tecnicoId}
              regiaoDoTecnico={tecnico.regiao}
              agora={agora}
              onAssumir={assumir}
              onAtualizar={atualizar}
            />
          ))}
        </div>
      ) : (
        <div className="tecnico-vazio">
          <strong>{TEXTO_VAZIO[aba].titulo}</strong>
          <p>{TEXTO_VAZIO[aba].texto}</p>
        </div>
      )}
    </section>
  )
}

const TEXTO_VAZIO = {
  fila: { titulo: 'Fila vazia', texto: 'Nenhuma ocorrência pendente. Assim que a central abrir uma, ela aparece aqui.' },
  minhas: { titulo: 'Nada com você agora', texto: 'Assuma uma ocorrência na Fila geral para começar.' },
  concluidas: { titulo: 'Nenhuma concluída ainda', texto: 'As ocorrências que você resolver aparecem aqui.' },
}

function iniciais(nome) {
  return nome.split(' ').map(p => p[0]).slice(0, 2).join('')
}

export default TelaTecnico
