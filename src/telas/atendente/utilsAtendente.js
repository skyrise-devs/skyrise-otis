// Funções de apoio da tela do atendente (P2):
// formatar datas e aplicar busca + filtros na lista de ocorrências.
import { ELEVADORES, validarOcorrencia } from '../../data/ocorrencias'

const CAMPOS = ['tipo', 'elevadorId', 'descricao', 'solicitante']

// Dados válidos de referência: servem de "gabarito" para testar um campo por vez
const GABARITO = {
  tipo: 'falha_tecnica',
  elevadorId: ELEVADORES[0].id,
  descricao: 'Descrição válida do problema',
  solicitante: 'Solicitante de teste',
}

// Do tipo mais urgente para o menos urgente (usado no painel de prioridades e no select do formulário)
export const ORDEM_DOS_TIPOS = ['passageiro_preso', 'falha_tecnica', 'falta_energia', 'pedido_cliente']

// Devolve um objeto { campo: mensagem } só com os campos que têm problema.
// O validarOcorrencia (P1) devolve uma lista sem dizer de qual campo é cada erro;
// então trocamos um campo de cada vez no gabarito e vemos se aparece erro.
// Assim as regras e as mensagens ficam num lugar só: src/data/ocorrencias.js
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
// Se a data vier inválida, mostra um traço em vez de "NaN/NaN/NaN".
export function formatarData(iso) {
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return '—'

  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const hora = String(data.getHours()).padStart(2, '0')
  const minuto = String(data.getMinutes()).padStart(2, '0')

  return `${dia}/${mes}/${data.getFullYear()} ${hora}:${minuto}`
}
