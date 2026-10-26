// Janela modal genérica (fundo escuro + caixa); o conteúdo vem por props.children
import { useEffect } from 'react'

function Modal({ titulo, onFechar, children }) {
  // Esc fecha a janela. O return do useEffect remove o "ouvinte" quando o modal sai da tela.
  useEffect(() => {
    function aoApertarTecla(e) {
      if (e.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', aoApertarTecla)
    return () => document.removeEventListener('keydown', aoApertarTecla)
  }, [onFechar])

  // Enquanto o modal está aberto, a página de trás não rola; ao fechar, volta ao que era
  useEffect(() => {
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = anterior
    }
  }, [])

  // Só fecha se o clique começou no fundo escuro (e não dentro da caixa):
  // assim, selecionar um texto e soltar o mouse fora não fecha sem querer
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
