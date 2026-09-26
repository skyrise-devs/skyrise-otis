// =========================
// CAMADA DE DADOS DAS OCORRÊNCIAS (P1)
// Sem back-end: tudo fica no localStorage do navegador.
// As funções não alteram o objeto recebido; sempre devolvem um novo (é o que o React espera).
// =========================

import { ELEVADORES, TECNICOS, gerarOcorrenciasExemplo } from './dadosExemplo.js'

export { ELEVADORES, TECNICOS }

const CHAVE_OCORRENCIAS = 'skyrise:ocorrencias:v1'

// Tipos de ocorrência e a prioridade automática de cada um
export const TIPOS = {
  passageiro_preso: { rotulo: 'Passageiro preso', prioridade: 'critica' },
  falha_tecnica: { rotulo: 'Falha técnica', prioridade: 'alta' },
  falta_energia: { rotulo: 'Falta de energia', prioridade: 'media' },
  pedido_cliente: { rotulo: 'Pedido de cliente', prioridade: 'baixa' },
}

// Quanto maior o peso, mais na frente da fila
export const PRIORIDADES = {
  critica: { rotulo: 'Crítica', peso: 4 },
  alta: { rotulo: 'Alta', peso: 3 },
  media: { rotulo: 'Média', peso: 2 },
  baixa: { rotulo: 'Baixa', peso: 1 },
}

// Caminho do atendimento: aberta → em_atendimento → resolvida
export const STATUS = {
  aberta: { rotulo: 'Aberta' },
  em_atendimento: { rotulo: 'Em atendimento' },
  resolvida: { rotulo: 'Resolvida' },
}

export function calcularPrioridade(tipo) {
  return TIPOS[tipo]?.prioridade ?? 'baixa'
}

export function buscarElevador(id) {
  return ELEVADORES.find(e => e.id === id)
}

export function buscarTecnico(id) {
  return TECNICOS.find(t => t.id === id)
}

// =========================
// LEITURA E GRAVAÇÃO
// =========================

export function carregarOcorrencias() {
  try {
    const salvas = JSON.parse(localStorage.getItem(CHAVE_OCORRENCIAS))
    if (Array.isArray(salvas)) return salvas
  } catch {
    // Armazenamento bloqueado ou conteúdo inválido: usa os dados de exemplo.
  }

  return gerarOcorrenciasExemplo(calcularPrioridade)
}

export function salvarOcorrencias(lista) {
  try {
    localStorage.setItem(CHAVE_OCORRENCIAS, JSON.stringify(lista))
  } catch {
    // Sem espaço ou acesso negado: as ocorrências seguem apenas em memória.
  }
}

export function dadosDeExemplo() {
  return gerarOcorrenciasExemplo(calcularPrioridade)
}

// =========================
// CRIAÇÃO E ALTERAÇÃO
// =========================

// Devolve a lista de erros do formulário; lista vazia = pode salvar.
export function validarOcorrencia({ tipo, elevadorId, descricao, solicitante }) {
  const erros = []
  if (!TIPOS[tipo]) erros.push('Escolha o tipo da ocorrência.')
  if (!buscarElevador(elevadorId)) erros.push('Escolha o elevador.')
  if (!descricao || descricao.trim().length < 10) erros.push('Descreva o problema com pelo menos 10 caracteres.')
  if (!solicitante || !solicitante.trim()) erros.push('Informe quem está solicitando.')
  return erros
}

function proximoId(lista) {
  const maior = lista.reduce((max, o) => Math.max(max, Number(o.id.replace('OC-', '')) || 0), 0)
  return `OC-${String(maior + 1).padStart(4, '0')}`
}

function agoraISO() {
  return new Date().toISOString()
}

// Cria a ocorrência já com a prioridade calculada pelo tipo
export function criarOcorrencia(lista, { tipo, elevadorId, descricao, solicitante }) {
  const data = agoraISO()

  return {
    id: proximoId(lista),
    tipo,
    prioridade: calcularPrioridade(tipo),
    status: 'aberta',
    elevadorId,
    tecnicoId: null,
    descricao: descricao.trim(),
    solicitante: solicitante.trim(),
    abertaEm: data,
    atendimentoEm: null,
    resolvidaEm: null,
    historico: [{ status: 'aberta', data, observacao: 'Ocorrência registrada' }],
  }
}

const CAMPOS_EDITAVEIS = ['tipo', 'elevadorId', 'descricao', 'solicitante']

// Corrige os dados de uma ocorrência; se o tipo mudar, a prioridade é recalculada.
// Status e técnico não mudam aqui: use atribuirTecnico e mudarStatus.
export function editarOcorrencia(ocorrencia, mudancas) {
  const atualizada = { ...ocorrencia }
  for (const campo of CAMPOS_EDITAVEIS) {
    if (mudancas[campo] !== undefined) {
      atualizada[campo] = typeof mudancas[campo] === 'string' ? mudancas[campo].trim() : mudancas[campo]
    }
  }
  atualizada.prioridade = calcularPrioridade(atualizada.tipo)

  const alterados = CAMPOS_EDITAVEIS.filter(c => atualizada[c] !== ocorrencia[c])
  if (alterados.length === 0) return ocorrencia

  return {
    ...atualizada,
    historico: [
      ...ocorrencia.historico,
      { status: ocorrencia.status, data: agoraISO(), observacao: `Dados editados: ${alterados.join(', ')}` },
    ],
  }
}

// Atribuir um técnico já coloca a ocorrência em atendimento
export function atribuirTecnico(ocorrencia, tecnicoId) {
  const tecnico = buscarTecnico(tecnicoId)
  const atualizada = { ...ocorrencia, tecnicoId }
  return ocorrencia.status === 'aberta'
    ? mudarStatus(atualizada, 'em_atendimento', `Atribuída a ${tecnico?.nome ?? tecnicoId}`)
    : atualizada
}

export function mudarStatus(ocorrencia, status, observacao = '') {
  const data = agoraISO()

  return {
    ...ocorrencia,
    status,
    atendimentoEm: status === 'em_atendimento' && !ocorrencia.atendimentoEm ? data : ocorrencia.atendimentoEm,
    resolvidaEm: status === 'resolvida' ? data : null,
    historico: [...ocorrencia.historico, { status, data, observacao }],
  }
}

// =========================
// CONSULTAS
// =========================

// Fila do técnico: só o que não foi resolvido, crítica primeiro ("fura fila"), depois a mais antiga
export function filaDeAtendimento(lista) {
  return lista
    .filter(o => o.status !== 'resolvida')
    .sort((a, b) =>
      PRIORIDADES[b.prioridade].peso - PRIORIDADES[a.prioridade].peso ||
      a.abertaEm.localeCompare(b.abertaEm)
    )
}
