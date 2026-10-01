import test from 'node:test'
import assert from 'node:assert/strict'
import { gerarOcorrenciasExemplo } from '../../data/dadosExemplo.js'
import { calcularPrioridade } from '../../data/ocorrencias.js'
import {
  obterIntervalo, filtrarPorPeriodo, calcularIndicadores, formatarDuracao,
  agruparPorTipo, agruparPorLocal, agruparPorPeriodo, identificarReincidentes,
} from './indicadores.js'

const agora = new Date(2026, 9, 1, 12)
const exemplos = gerarOcorrenciasExemplo(calcularPrioridade, agora.getTime())

test('indicadores de exemplo e tempo da abertura até a resolução', () => {
  const indicadores = calcularIndicadores(exemplos)
  assert.equal(indicadores.total, 30)
  assert.equal(indicadores.abertas, 5)
  assert.equal(indicadores.emAtendimento, 2)
  assert.equal(indicadores.criticas, 1)
  assert.equal(indicadores.resolvidas, 23)
  const duracoes = exemplos.filter(o => o.status === 'resolvida')
    .map(o => (new Date(o.resolvidaEm) - new Date(o.abertaEm)) / 60000)
  assert.ok(Math.abs(indicadores.tempoMedio - duracoes.reduce((a, b) => a + b, 0) / 23) < 0.001)
})

test('período personalizado inclui o dia final inteiro no horário local', () => {
  const intervalo = obterIntervalo('personalizado', '2026-09-30', '2026-10-01', agora)
  const registros = [
    { abertaEm: new Date(2026, 8, 29, 23, 59).toISOString() },
    { abertaEm: new Date(2026, 8, 30, 0).toISOString() },
    { abertaEm: new Date(2026, 9, 1, 23, 59, 59).toISOString() },
    { abertaEm: new Date(2026, 9, 2, 0).toISOString() },
  ]
  assert.deepEqual(filtrarPorPeriodo(registros, intervalo), registros.slice(1, 3))
  assert.ok(obterIntervalo('personalizado', '', '', agora).erro)
  assert.ok(obterIntervalo('personalizado', '2026-10-02', '2026-10-01', agora).erro)
})

test('últimos sete dias incluem hoje e mantêm críticas pendentes fora do filtro', () => {
  const intervalo = obterIntervalo('7', '', '', agora)
  assert.equal(intervalo.inicio.getDate(), 25)
  const filtradas = filtrarPorPeriodo(exemplos, intervalo)
  const antiga = { prioridade: 'critica', status: 'em_atendimento', abertaEm: '2025-01-01T12:00:00Z' }
  assert.equal(calcularIndicadores(filtradas, [...exemplos, antiga]).criticas, 2)
  assert.ok(filtradas.length < exemplos.length)
})

test('média ignora resoluções inválidas e distingue zero de ausência de dados', () => {
  const abertura = agora.toISOString()
  const registros = [
    { status: 'resolvida', abertaEm: abertura, resolvidaEm: abertura },
    { status: 'resolvida', abertaEm: abertura, resolvidaEm: null },
    { status: 'resolvida', abertaEm: abertura, resolvidaEm: 'inválida' },
    { status: 'resolvida', abertaEm: abertura, resolvidaEm: '2020-01-01T00:00:00Z' },
  ]
  assert.equal(calcularIndicadores(registros).tempoMedio, 0)
  assert.equal(calcularIndicadores([]).tempoMedio, null)
  assert.equal(formatarDuracao(null), '—')
  assert.equal(formatarDuracao(125), '2 h 5 min')
  assert.equal(formatarDuracao(59.8), '1 h')
})

test('agrupamentos preservam o total e incluem dias sem ocorrências', () => {
  const intervalo = obterIntervalo('30', '', '', agora)
  for (const grupos of [agruparPorTipo(exemplos), agruparPorLocal(exemplos, 'regiao'),
    agruparPorLocal(exemplos, 'elevador'), agruparPorPeriodo(exemplos, intervalo).grupos]) {
    assert.equal(grupos.reduce((total, grupo) => total + grupo.total, 0), 30)
  }
  const diario = agruparPorPeriodo(exemplos, intervalo)
  assert.equal(diario.grupos.length, 30)
  assert.ok(diario.grupos.some(grupo => grupo.total === 0))
  assert.equal(agruparPorPeriodo(exemplos, obterIntervalo('90', '', '', agora)).escala, 'semana')
  assert.equal(agruparPorPeriodo(exemplos, obterIntervalo('personalizado', '2026-01-01', '2026-10-01')).escala, 'mes')
  assert.deepEqual(agruparPorPeriodo([], intervalo).grupos, [])
})

test('reincidência considera três falhas nos últimos 30 dias, excluindo pedidos e energia', () => {
  const reincidentes = identificarReincidentes(exemplos, agora)
  assert.deepEqual(reincidentes.map(e => e.id), ['EL-03'])
  assert.equal(reincidentes[0].total, 6)
  assert.equal(reincidentes[0].pendentes, 1)
  assert.equal(reincidentes[0].tipoMaisFrequente.id, 'falha_tecnica')
  const criar = (tipo, dias) => ({ elevadorId: 'EL-01', tipo, status: 'resolvida',
    abertaEm: new Date(agora.getTime() - dias * 86400000).toISOString() })
  assert.deepEqual(identificarReincidentes([
    criar('falha_tecnica', 0), criar('falha_tecnica', 30), criar('falha_tecnica', 31),
    criar('falha_tecnica', -1), criar('pedido_cliente', 1), criar('falta_energia', 2),
  ], agora), [])
  assert.equal(identificarReincidentes([
    criar('falha_tecnica', 0), criar('falha_tecnica', 30), criar('passageiro_preso', 2),
  ], agora).length, 1)
})
