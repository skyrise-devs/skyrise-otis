import './atendente.css'

// P2 · Pedro Henrique
// A fazer: formulário de abertura (use validarOcorrencia + onRegistrar),
// lista com busca e filtros, e a tela de detalhe com o histórico
// (para corrigir uma ocorrência, use onEditar).
function TelaAtendente({ ocorrencias }) {
  // Contadores do resumo: calculados a cada render, a partir da lista recebida por props
  const abertas = ocorrencias.filter(o => o.status === 'aberta').length
  const criticasAtivas = ocorrencias.filter(o => o.prioridade === 'critica' && o.status !== 'resolvida').length

  return (
    <section className="tela-atendente">
      <header className="at-cabecalho">
        <h1>Portal do Atendente</h1>
        <p>Registre chamados, acompanhe a fila e corrija ocorrências.</p>
      </header>

      <section className="at-resumo" aria-label="Resumo das ocorrências">
        <div className="at-resumo-item">
          <span className="at-resumo-numero">{ocorrencias.length}</span>
          <span className="at-resumo-rotulo">Ocorrências registradas</span>
        </div>
        <div className="at-resumo-item">
          <span className="at-resumo-numero">{abertas}</span>
          <span className="at-resumo-rotulo">Aguardando técnico</span>
        </div>
        <div className="at-resumo-item critico">
          <span className="at-resumo-numero">{criticasAtivas}</span>
          <span className="at-resumo-rotulo">Críticas em andamento</span>
        </div>
      </section>

      <div className="at-colunas">
        <div className="at-coluna-form">
          <section className="at-cartao">
            <h2>Nova ocorrência</h2>
            <p>Formulário em construção.</p>
          </section>
        </div>

        <div className="at-coluna-lista">
          <section className="at-cartao">
            <h2>Ocorrências</h2>
            <p>{ocorrencias.length} ocorrências registradas.</p>
          </section>
        </div>
      </div>
    </section>
  )
}

export default TelaAtendente
