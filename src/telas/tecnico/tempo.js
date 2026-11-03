// Textos de tempo da tela do técnico (P3)

const MINUTO = 60 * 1000
const HORA = 60 * MINUTO
const DIA = 24 * HORA

// Duração curta para o técnico ler rápido no celular: "45 min", "2 h 10 min", "3 dias"
export function formatarDuracao(ms) {
  if (!Number.isFinite(ms) || ms < MINUTO) return 'menos de 1 min'
  if (ms < HORA) return `${Math.floor(ms / MINUTO)} min`
  if (ms < DIA) {
    const horas = Math.floor(ms / HORA)
    const minutos = Math.floor((ms % HORA) / MINUTO)
    return minutos ? `${horas} h ${minutos} min` : `${horas} h`
  }
  const dias = Math.floor(ms / DIA)
  return dias === 1 ? '1 dia' : `${dias} dias`
}

export function tempoDesde(dataISO, agora) {
  return formatarDuracao(agora - new Date(dataISO).getTime())
}

export function formatarDataHora(dataISO) {
  return new Date(dataISO).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}
