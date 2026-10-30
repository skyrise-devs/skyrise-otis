import { ELEVADORES, PRIORIDADES, STATUS, TIPOS, buscarElevador, filaDeAtendimento, validarOcorrencia } from '../../data/ocorrencias'

const CAMPOS = ['tipo', 'elevadorId', 'descricao', 'solicitante']

const GABARITO = {
  tipo: 'falha_tecnica',
  elevadorId: ELEVADORES[0].id,
  descricao: 'Descrição válida do problema',
  solicitante: 'Solicitante de teste',
}

export const ORDEM_DOS_TIPOS = ['passageiro_preso', 'falha_tecnica', 'falta_energia', 'pedido_cliente']

export function errosPorCampo(dados) {
  const erros = {}

  for (let i = 0; i < CAMPOS.length; i++) {
    const campo = CAMPOS[i]
    const mensagens = validarOcorrencia({ ...GABARITO, [campo]: dados[campo] })
    if (mensagens.length > 0) erros[campo] = mensagens[0]
  }

  return erros
}

// Data e hora no padrão brasileiro (ex.: 19/10/2026 11:05), no horário do navegador.
// Se a data vier vazia ou inválida, mostra um traço em vez de "NaN/NaN/NaN" (ou de 1970).
export function formatarData(iso) {
  if (!iso) return '—'

  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return '—'

  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const hora = String(data.getHours()).padStart(2, '0')
  const minuto = String(data.getMinutes()).padStart(2, '0')

  return `${dia}/${mes}/${data.getFullYear()} ${hora}:${minuto}`
}

export function ordenarOcorrencias(lista) {
  const fila = filaDeAtendimento(lista)
  const resolvidas = lista
    .filter(o => o.status === 'resolvida')
    .sort((a, b) => b.abertaEm.localeCompare(a.abertaEm))

  return [...fila, ...resolvidas]
}

export const FILTROS_VAZIOS = { busca: '', status: '', tipo: '', dataInicio: '', dataFim: '' }

export function temFiltroAtivo(filtros) {
  return (
    filtros.busca.trim() !== '' ||
    filtros.status !== '' ||
    filtros.tipo !== '' ||
    filtros.dataInicio !== '' ||
    filtros.dataFim !== ''
  )
}

function dataLocal(iso) {
  if (!iso) return '—'

  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return ''

  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')

  return `${data.getFullYear()}-${mes}-${dia}`
}

function normalizar(texto) {
  return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function textoDeBusca(o) {
  const elevador = buscarElevador(o.elevadorId)

  return normalizar([
    o.id,
    TIPOS[o.tipo]?.rotulo,
    PRIORIDADES[o.prioridade]?.rotulo,
    STATUS[o.status]?.rotulo,
    o.elevadorId,
    elevador?.predio,
    elevador?.endereco,
    o.descricao,
    o.solicitante,
  ].join(' '))
}

export function filtrarOcorrencias(lista, filtros) {
  const termos = normalizar(filtros.busca).trim().split(' ').filter(t => t !== '')

  return lista.filter(o => {
    if (filtros.status !== '' && o.status !== filtros.status) return false
    if (filtros.tipo !== '' && o.tipo !== filtros.tipo) return false

    if (filtros.dataInicio !== '' || filtros.dataFim !== '') {
      const dia = dataLocal(o.abertaEm)
      if (dia === '') return false
      if (filtros.dataInicio !== '' && dia < filtros.dataInicio) return false
      if (filtros.dataFim !== '' && dia > filtros.dataFim) return false
    }

    if (termos.length > 0) {
      const alvo = textoDeBusca(o)
      if (!termos.every(t => alvo.includes(t))) return false
    }

    return true
  })
}
