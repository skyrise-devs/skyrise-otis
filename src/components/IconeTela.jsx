// Ícones SVG das telas, usados no menu e na tela inicial (P3).
// Desenhados com o traço do tema (currentColor), sem biblioteca externa.

const CAMINHOS = {
  marca: <><path stroke="var(--cor-destaque)" d="M2.5 21.5h3V9l5-3.5v16" /><path d="M11 2l6.5 4.5v15h4" /><path stroke="var(--cor-destaque)" d="M12.5 10l1.5-1.5 1.5 1.5M14 9v7" /><path d="M12.5 16.5 14 18l1.5-1.5" /></>,
  inicio: <><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10M10 20v-6h4v6" /></>,
  atendente: <><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M19 19c0 1.5-2 2.5-5 2.5" /></>,
  tecnico: <><path d="M14.5 6.5a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.5-1.5a4 4 0 0 1-2-2Z" /><path d="M3 21 9.5 14.5M5 13l-2-2 4-4 2 2" /></>,
  gestao: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4m4 4V8m4 8v-6" /></>,
  restaurar: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>,
}

function IconeTela({ nome }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {CAMINHOS[nome]}
    </svg>
  )
}

export default IconeTela
