// Ícones SVG das telas, usados no menu e na tela inicial (P3).
// Desenhados com o traço do tema (currentColor), sem biblioteca externa.

const CAMINHOS = {
  marca: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 2v20M8.5 8 10 6.5 11.5 8M12.5 16l1.5 1.5 1.5-1.5" /></>,
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
