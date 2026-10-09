import './atendente.css'

// P2 · Pedro Henrique
// A fazer: formulário de abertura (use validarOcorrencia + onRegistrar),
// lista com busca e filtros, e a tela de detalhe com o histórico
// (para corrigir uma ocorrência, use onEditar).
function TelaAtendente({ ocorrencias }) {
  return (
    <section className="tela-atendente">
      <header className="at-cabecalho">
        <h1>Portal do Atendente</h1>
        <p>Registre chamados, acompanhe a fila e corrija ocorrências.</p>
      </header>

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
