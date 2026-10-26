// Janela modal genérica (fundo escuro + caixa); o conteúdo vem por props.children
function Modal({ titulo, onFechar, children }) {
  return (
    <div className="at-modal-fundo">
      <div className="at-modal" role="dialog" aria-modal="true" aria-labelledby="at-modal-titulo">
        <header className="at-modal-cabecalho">
          <h2 id="at-modal-titulo">{titulo}</h2>
          <button
            type="button"
            className="at-btn at-modal-fechar"
            onClick={onFechar}
            aria-label="Fechar janela"
            autoFocus
          >
            ×
          </button>
        </header>

        <div className="at-modal-corpo">{children}</div>
      </div>
    </div>
  )
}

export default Modal
