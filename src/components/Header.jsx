// Navegação provisória: a P3 (Ju) substitui pela tela inicial + menu definitivo,
// usando a identidade visual da P5 (Gabriela).

const TELAS = [
  { id: 'atendente', rotulo: 'Atendente' },
  { id: 'tecnico', rotulo: 'Técnico' },
  { id: 'gestao', rotulo: 'Gestão' },
]

function Header({ telaAtual, onNavegar, onRestaurarExemplo }) {
  return (
    <header className="app-header">
      <strong className="app-marca">SkyRise</strong>

      <nav className="app-nav" aria-label="Telas do sistema">
        {TELAS.map(t => (
          <button
            key={t.id}
            type="button"
            className={t.id === telaAtual ? 'ativo' : ''}
            aria-current={t.id === telaAtual ? 'page' : undefined}
            onClick={() => onNavegar(t.id)}
          >
            {t.rotulo}
          </button>
        ))}
      </nav>

      <button type="button" className="app-restaurar" onClick={onRestaurarExemplo}>
        Restaurar dados de exemplo
      </button>
    </header>
  )
}

export default Header
