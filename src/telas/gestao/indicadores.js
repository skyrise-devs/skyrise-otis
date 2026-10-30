import { buscarElevador, TIPOS } from '../../data/ocorrencias.js'

const MINUTO = 60 * 1000
export const DIAS_REINCIDENCIA = 30
export const LIMITE_REINCIDENCIA = 3

export function dataLocal(data) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function inicioDoDia(valor) {
  return new Date(`${valor}T00:00:00`)
}

export function obterIntervalo(periodo, inicio, fim, agora = new Date()) {
  if (periodo === 'personalizado') {
    if (!inicio || !fim) return { erro: 'Informe a data inicial e a data final.' }
    const de = inicioDoDia(inicio)
    const ate = inicioDoDia(fim)
    if (!Number.isFinite(de.getTime()) || !Number.isFinite(ate.getTime()) ||
      dataLocal(de) !== inicio || dataLocal(ate) !== fim) {
      return { erro: 'Informe datas válidas.' }
    }
    if (de > ate) return { erro: 'A data inicial deve ser anterior ou igual à data final.' }
    ate.setDate(ate.getDate() + 1)
    return { inicio: de, fim: ate }
  }

  const ate = new Date(agora)
  ate.setHours(0, 0, 0, 0)
  ate.setDate(ate.getDate() + 1)
  if (periodo === 'todos') return { inicio: null, fim: ate }
  const de = new Date(ate)
  de.setDate(de.getDate() - Number(periodo))
  return { inicio: de, fim: ate }
}

export function filtrarPorPeriodo(ocorrencias, intervalo) {
  if (intervalo.erro) return []
  return ocorrencias.filter(o => {
    const abertura = new Date(o.abertaEm)
    return Number.isFinite(abertura.getTime()) &&
      (!intervalo.inicio || abertura >= intervalo.inicio) && abertura < intervalo.fim
  })
}

export function calcularIndicadores(ocorrencias, todas = ocorrencias) {
  const duracoes = ocorrencias
    .filter(o => o.status === 'resolvida' && o.abertaEm && o.resolvidaEm)
    .map(o => new Date(o.resolvidaEm) - new Date(o.abertaEm))
    .filter(duracao => Number.isFinite(duracao) && duracao >= 0)

  return {
    total: ocorrencias.length,
    abertas: ocorrencias.filter(o => o.status === 'aberta').length,
    emAtendimento: ocorrencias.filter(o => o.status === 'em_atendimento').length,
    criticas: todas.filter(o => o.prioridade === 'critica' && o.status !== 'resolvida').length,
    resolvidas: duracoes.length,
    tempoMedio: duracoes.length
      ? duracoes.reduce((soma, duracao) => soma + duracao, 0) / duracoes.length / MINUTO
      : null,
  }
}

export function formatarDuracao(minutos) {
  if (minutos === null) return '—'
  const total = Math.round(minutos)
  if (total < 60) return `${total} min`
  const horas = Math.floor(total / 60)
  const resto = total % 60
  return `${horas} h${resto ? ` ${resto} min` : ''}`
}

export function agruparPorTipo(ocorrencias) {
  return Object.entries(TIPOS).map(([id, tipo]) => ({
    id, rotulo: tipo.rotulo,
    total: ocorrencias.filter(o => o.tipo === id).length,
  }))
}

export function agruparPorLocal(ocorrencias, modo) {
  const grupos = new Map()
  for (const ocorrencia of ocorrencias) {
    const elevador = buscarElevador(ocorrencia.elevadorId)
    const id = modo === 'regiao' ? elevador?.regiao ?? 'Sem região' : ocorrencia.elevadorId
    const rotulo = modo === 'regiao' ? id : `${id} · ${elevador?.identificacao ?? 'Não cadastrado'}`
    const detalhe = modo === 'elevador' ? elevador?.predio : undefined
    const grupo = grupos.get(id) ?? { id, rotulo, detalhe, total: 0 }
    grupo.total += 1
    grupos.set(id, grupo)
  }
  return [...grupos.values()].sort((a, b) => b.total - a.total || a.rotulo.localeCompare(b.rotulo, 'pt-BR'))
}

// Dias, semanas ou meses, conforme a extensão do filtro. Inclui intervalos sem registros.
export function agruparPorPeriodo(ocorrencias, intervalo) {
  if (intervalo.erro || !ocorrencias.length) return { escala: 'dia', grupos: [] }
  const primeira = new Date(Math.min(...ocorrencias.map(o => new Date(o.abertaEm).getTime())))
  const inicio = new Date(intervalo.inicio ?? primeira)
  inicio.setHours(0, 0, 0, 0)
  const dias = Math.ceil((intervalo.fim - inicio) / (24 * 60 * MINUTO))
  const escala = dias <= 31 ? 'dia' : dias <= 120 ? 'semana' : 'mes'
  if (escala === 'mes') inicio.setDate(1)
  const grupos = []
  const cursor = new Date(inicio)
  while (cursor < intervalo.fim) {
    const proximo = new Date(cursor)
    if (escala === 'mes') proximo.setMonth(proximo.getMonth() + 1)
    else proximo.setDate(proximo.getDate() + (escala === 'semana' ? 7 : 1))
    const fim = new Date(Math.min(proximo.getTime(), intervalo.fim.getTime()))
    const rotulo = escala === 'mes'
      ? cursor.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
      : cursor.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    grupos.push({
      id: dataLocal(cursor), rotulo,
      detalhe: escala === 'semana' ? `Semana a partir de ${rotulo}` : rotulo,
      total: ocorrencias.filter(o => new Date(o.abertaEm) >= cursor && new Date(o.abertaEm) < fim).length,
    })
    cursor.setTime(proximo.getTime())
  }
  return { escala, grupos }
}

// Sinal preventivo por repetição de falhas, sem estimar probabilidade de uma falha futura.
export function identificarReincidentes(ocorrencias, agora = new Date()) {
  const inicio = new Date(agora)
  inicio.setDate(inicio.getDate() - DIAS_REINCIDENCIA)
  const falhas = ocorrencias.filter(o =>
    ['falha_tecnica', 'passageiro_preso'].includes(o.tipo) &&
    new Date(o.abertaEm) >= inicio && new Date(o.abertaEm) <= agora
  )
  const grupos = agruparPorLocal(falhas, 'elevador')
  return grupos.filter(grupo => grupo.total >= LIMITE_REINCIDENCIA).map(grupo => {
    const registros = falhas.filter(o => o.elevadorId === grupo.id)
    const tipos = agruparPorTipo(registros).sort((a, b) => b.total - a.total)
    return {
      ...grupo,
      elevador: buscarElevador(grupo.id),
      pendentes: registros.filter(o => o.status !== 'resolvida').length,
      ultimaEm: registros.reduce((ultima, o) => o.abertaEm > ultima ? o.abertaEm : ultima, ''),
      tipoMaisFrequente: tipos[0],
    }
  })
}
