import { useEffect } from 'react'

function Modal({ titulo, onFechar, children }) {
  useEffect(() => {
    function aoApertarTecla(e) {
      if (e.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', aoApertarTecla)
    return () => document.removeEventListener('keydown', aoApertarTecla)
  }, [onFechar])

  useEffect(() => {
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = anterior
    }
  }, [])

  function aoClicarNoFundo(e) {
    if (e.target === e.currentTarget) onFechar()
  }

  return (
    <div className="at-modal-fundo" onMouseDown={aoClicarNoFundo}>
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
