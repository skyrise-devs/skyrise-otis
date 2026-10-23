// Funções de apoio da tela do atendente (P2):
// formatar datas e aplicar busca + filtros na lista de ocorrências.
import { ELEVADORES, filaDeAtendimento, validarOcorrencia } from '../../data/ocorrencias'

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

// Ordem da lista do atendente: primeiro o que ainda não foi resolvido, na ordem da fila do
// técnico (crítica primeiro, depois a mais antiga: filaDeAtendimento do P1); depois as
// resolvidas, da mais recente para a mais antiga. Devolve uma lista nova, sem alterar a original.
export function ordenarOcorrencias(lista) {
  const fila = filaDeAtendimento(lista)
  const resolvidas = lista
    .filter(o => o.status === 'resolvida')
    .sort((a, b) => b.abertaEm.localeCompare(a.abertaEm))

  return [...fila, ...resolvidas]
}

// Filtros da lista. Texto vazio = filtro desligado.
// busca: texto livre · status / tipo: uma das chaves de STATUS / TIPOS
// dataInicio / dataFim: 'AAAA-MM-DD' (o dia em que a ocorrência foi aberta)
export const FILTROS_VAZIOS = { busca: '', status: '', tipo: '', dataInicio: '', dataFim: '' }

// Há algum filtro ligado? (uma busca só com espaços não conta)
export function temFiltroAtivo(filtros) {
  return (
    filtros.busca.trim() !== '' ||
    filtros.status !== '' ||
    filtros.tipo !== '' ||
    filtros.dataInicio !== '' ||
    filtros.dataFim !== ''
  )
}

// Dia local em que a data caiu, no formato 'AAAA-MM-DD' (o mesmo do <input type="date">).
// Data inválida devolve texto vazio.
function dataLocal(iso) {
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return ''

  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')

  return `${data.getFullYear()}-${mes}-${dia}`
}

// Aplica os filtros e devolve uma lista nova (a original não muda).
export function filtrarOcorrencias(lista, filtros) {
  return lista.filter(o => {
    if (filtros.status !== '' && o.status !== filtros.status) return false
    if (filtros.tipo !== '' && o.tipo !== filtros.tipo) return false

    // Período: compara o dia da abertura com o dia inicial e o final (inclusive)
    if (filtros.dataInicio !== '' || filtros.dataFim !== '') {
      const dia = dataLocal(o.abertaEm)
      if (dia === '') return false
      if (filtros.dataInicio !== '' && dia < filtros.dataInicio) return false
      if (filtros.dataFim !== '' && dia > filtros.dataFim) return false
    }

    return true
  })
}
