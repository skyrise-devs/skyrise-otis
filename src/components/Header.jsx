import IconeTela from './IconeTela'

// Menu definitivo (P3 · Ju), com a identidade visual da P5 (Gabriela) nas variáveis do index.css.
// A marca leva para a tela inicial; o selo vermelho no Técnico conta as críticas sem técnico.

const TELAS = [
  { id: 'atendente', rotulo: 'Atendente' },
  { id: 'tecnico', rotulo: 'Técnico' },
  { id: 'gestao', rotulo: 'Gestão' },
]

function Header({ telaAtual, onNavegar, onRestaurarExemplo, criticasAguardando }) {
  function restaurar() {
    if (window.confirm('Voltar para os 30 exemplos? As ocorrências criadas ou alteradas serão perdidas.')) {
      onRestaurarExemplo()
    }
  }

  return (
    <header className="app-header">
      <button
        type="button"
        className="app-marca"
        aria-current={telaAtual === 'inicio' ? 'page' : undefined}
        onClick={() => onNavegar('inicio')}
      >
        <span className="app-marca-icone"><IconeTela nome="marca" /></span>
        <span className="app-marca-texto">
          SkyRise
          <small>Gestão de ocorrências</small>
        </span>
      </button>

      <nav className="app-nav" aria-label="Telas do sistema">
        {TELAS.map(t => (
          <button
            key={t.id}
            type="button"
            className={t.id === telaAtual ? 'ativo' : ''}
            aria-current={t.id === telaAtual ? 'page' : undefined}
            onClick={() => onNavegar(t.id)}
          >
            <IconeTela nome={t.id} />
            <span>{t.rotulo}</span>
            {t.id === 'tecnico' && criticasAguardando > 0 && (
              <span className="app-nav-selo" aria-label={criticasAguardando === 1 ? '1 crítica aguardando técnico' : `${criticasAguardando} críticas aguardando técnico`}>
                {criticasAguardando}
              </span>
            )}
          </button>
        ))}
      </nav>

      <button type="button" className="app-restaurar" onClick={restaurar} aria-label="Restaurar dados de exemplo" title="Restaurar dados de exemplo">
        <IconeTela nome="restaurar" />
        <span>Restaurar dados de exemplo</span>
      </button>
    </header>
  )
}

export default Header
