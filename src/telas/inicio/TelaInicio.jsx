import IconeTela from '../../components/IconeTela'
import { TIPOS, PRIORIDADES, buscarElevador } from '../../data/ocorrencias'
import './inicio.css'

// P3 · Ju
// Tela inicial: escolha do perfil, aviso de passageiro preso e a regra de prioridade.

function TelaInicio({ ocorrencias, onNavegar }) {
  const abertas = ocorrencias.filter(o => o.status === 'aberta')
  const pendentes = ocorrencias.filter(o => o.status !== 'resolvida')
  const resolvidas = ocorrencias.length - pendentes.length
  const criticasAguardando = abertas.filter(o => o.prioridade === 'critica')

  const perfis = [
    {
      id: 'atendente',
      titulo: 'Atendente',
      publico: 'Central de atendimento',
      descricao: 'Abre ocorrências, busca, filtra e consulta o histórico.',
      numero: `${abertas.length} ${abertas.length === 1 ? 'aberta' : 'abertas'} sem técnico`,
    },
    {
      id: 'tecnico',
      titulo: 'Técnico',
      publico: 'Técnico de campo',
      descricao: 'Fila por prioridade: assume a ocorrência e atualiza o status.',
      numero: `${pendentes.length} na fila de atendimento`,
    },
    {
      id: 'gestao',
      titulo: 'Gestão',
      publico: 'Liderança',
      descricao: 'Indicadores, gráficos e alerta de elevadores reincidentes.',
      numero: `${resolvidas} ${resolvidas === 1 ? 'resolvida' : 'resolvidas'} no histórico`,
    },
  ]

  return (
    <section className="tela-inicio" aria-labelledby="inicio-titulo">
      <header className="inicio-cabecalho">
        <p className="inicio-sobretitulo">SkyRise · Challenge OTIS 2026</p>
        <h1 id="inicio-titulo">Ocorrências de elevadores, do chamado à solução</h1>
        <p className="inicio-descricao">
          Registre, priorize e despache cada ocorrência para o técnico certo. Escolha o seu perfil para começar.
        </p>
      </header>

      {criticasAguardando.length > 0 && (
        <div className="inicio-alerta" role="alert">
          <span className="inicio-alerta-ponto" aria-hidden="true" />
          <div>
            <strong>
              {criticasAguardando.length === 1
                ? '1 ocorrência crítica aguardando técnico'
                : `${criticasAguardando.length} ocorrências críticas aguardando técnico`}
            </strong>
            <p>
              {criticasAguardando[0].id} · {TIPOS[criticasAguardando[0].tipo].rotulo} ·{' '}
              {buscarElevador(criticasAguardando[0].elevadorId)?.predio ?? criticasAguardando[0].elevadorId}
            </p>
          </div>
          <button type="button" onClick={() => onNavegar('tecnico')}>Ir para a fila</button>
        </div>
      )}

      <ul className="inicio-perfis">
        {perfis.map(p => (
          <li key={p.id}>
            <button type="button" className="inicio-perfil" onClick={() => onNavegar(p.id)}>
              <span className="inicio-perfil-icone"><IconeTela nome={p.id} /></span>
              <span className="inicio-perfil-publico">{p.publico}</span>
              <strong>{p.titulo}</strong>
              <span className="inicio-perfil-descricao">{p.descricao}</span>
              <span className="inicio-perfil-numero">{p.numero}</span>
              <span className="inicio-perfil-entrar" aria-hidden="true">Entrar →</span>
            </button>
          </li>
        ))}
      </ul>

      <section className="inicio-painel" aria-labelledby="inicio-prioridade-titulo">
        <h2 id="inicio-prioridade-titulo">Prioridade automática</h2>
        <p>O tipo da ocorrência define a prioridade. Passageiro preso fura a fila do técnico.</p>
        <ul className="inicio-prioridades">
          {Object.entries(TIPOS).map(([id, tipo]) => (
            <li key={id} className={`prioridade-${tipo.prioridade}`}>
              <span className="inicio-prioridade-nivel">{PRIORIDADES[tipo.prioridade].rotulo}</span>
              {tipo.rotulo}
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}

export default TelaInicio
