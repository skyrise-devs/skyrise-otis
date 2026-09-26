// =========================
// DADOS DE EXEMPLO (fictícios)
// Usados na primeira vez que o sistema abre e no botão "Restaurar dados de exemplo".
// =========================

export const ELEVADORES = [
  { id: 'EL-01', predio: 'Edifício Paulista Center', identificacao: 'Social 1', endereco: 'Av. Paulista, 1000', regiao: 'Centro' },
  { id: 'EL-02', predio: 'Torre Faria Lima', identificacao: 'Social 2', endereco: 'Av. Brig. Faria Lima, 3500', regiao: 'Zona Oeste' },
  { id: 'EL-03', predio: 'Residencial Jardim Aurora', identificacao: 'Social', endereco: 'R. Voluntários da Pátria, 2200', regiao: 'Zona Norte' },
  { id: 'EL-04', predio: 'Shopping Tatuapé Plaza', identificacao: 'Panorâmico', endereco: 'R. Tuiuti, 500', regiao: 'Zona Leste' },
  { id: 'EL-05', predio: 'Hospital Vila Mariana', identificacao: 'Maca 1', endereco: 'R. Domingos de Morais, 1800', regiao: 'Zona Sul' },
  { id: 'EL-06', predio: 'Condomínio Parque Ibirapuera', identificacao: 'Serviço', endereco: 'Av. República do Líbano, 900', regiao: 'Zona Sul' },
  { id: 'EL-07', predio: 'Berrini Office', identificacao: 'Social 3', endereco: 'Av. Eng. Luís Carlos Berrini, 1400', regiao: 'Zona Sul' },
  { id: 'EL-08', predio: 'Residencial Santana Park', identificacao: 'Social', endereco: 'R. Dr. César, 300', regiao: 'Zona Norte' },
  { id: 'EL-09', predio: 'Centro Empresarial Lapa', identificacao: 'Social 1', endereco: 'R. Guaicurus, 800', regiao: 'Zona Oeste' },
  { id: 'EL-10', predio: 'Edifício Sé Comercial', identificacao: 'Social', endereco: 'Praça da Sé, 100', regiao: 'Centro' },
]

export const TECNICOS = [
  { id: 'TC-01', nome: 'Carlos Mendes', regiao: 'Centro' },
  { id: 'TC-02', nome: 'Ana Ribeiro', regiao: 'Zona Sul' },
  { id: 'TC-03', nome: 'Marcos Oliveira', regiao: 'Zona Norte' },
  { id: 'TC-04', nome: 'Juliana Santos', regiao: 'Zona Leste' },
  { id: 'TC-05', nome: 'Rafael Costa', regiao: 'Zona Oeste' },
]

// Cada linha: [tipo, elevador, horas atrás, status, técnico, min até atendimento, min até resolver, descrição, solicitante]
// O EL-03 tem falhas repetidas de propósito, para o alerta de elevador reincidente do dashboard.
const HISTORICO = [
  ['falha_tecnica', 'EL-03', 700, 'resolvida', 'TC-03', 25, 140, 'Porta não fecha no 4º andar', 'Síndico Roberto'],
  ['pedido_cliente', 'EL-01', 680, 'resolvida', 'TC-01', 240, 60, 'Revisão preventiva antes da auditoria do prédio', 'Administração Paulista Center'],
  ['falta_energia', 'EL-04', 650, 'resolvida', 'TC-04', 30, 90, 'Queda de energia no bairro, elevador parado no térreo', 'Segurança do shopping'],
  ['passageiro_preso', 'EL-05', 620, 'resolvida', 'TC-02', 8, 35, 'Paciente e acompanhante presos entre o 2º e o 3º andar', 'Recepção do hospital'],
  ['falha_tecnica', 'EL-07', 600, 'resolvida', 'TC-02', 40, 180, 'Ruído metálico durante a subida', 'Facilities Berrini'],
  ['falha_tecnica', 'EL-09', 560, 'resolvida', 'TC-05', 35, 120, 'Botoeira do 7º andar sem resposta', 'Portaria Lapa'],
  ['pedido_cliente', 'EL-06', 530, 'resolvida', 'TC-02', 300, 45, 'Troca da lâmpada da cabine', 'Zeladoria'],
  ['falta_energia', 'EL-10', 500, 'resolvida', 'TC-01', 25, 75, 'Oscilação de energia travou o painel de comando', 'Portaria Sé'],
  ['passageiro_preso', 'EL-02', 470, 'resolvida', 'TC-05', 10, 40, 'Duas pessoas presas no 12º andar', 'Recepção Faria Lima'],
  ['falha_tecnica', 'EL-08', 440, 'resolvida', 'TC-03', 45, 150, 'Desnivelamento de 5 cm no térreo', 'Síndica Márcia'],
  ['falha_tecnica', 'EL-01', 400, 'resolvida', 'TC-01', 30, 100, 'Indicador de andar apagado', 'Administração Paulista Center'],
  ['pedido_cliente', 'EL-04', 360, 'resolvida', 'TC-04', 200, 50, 'Pedido de orçamento para modernização', 'Gerência do shopping'],
  ['falha_tecnica', 'EL-03', 330, 'resolvida', 'TC-03', 30, 160, 'Porta abrindo e fechando sem parar', 'Síndico Roberto'],
  ['passageiro_preso', 'EL-03', 300, 'resolvida', 'TC-03', 7, 30, 'Morador preso no 6º andar', 'Portaria Jardim Aurora'],
  ['falta_energia', 'EL-05', 280, 'resolvida', 'TC-02', 20, 80, 'Gerador não assumiu após queda de energia', 'Manutenção do hospital'],
  ['falha_tecnica', 'EL-06', 250, 'resolvida', 'TC-02', 50, 130, 'Cabine parando fora do nível', 'Zeladoria'],
  ['pedido_cliente', 'EL-09', 220, 'resolvida', 'TC-05', 260, 40, 'Atualização do certificado de inspeção', 'Administração Lapa'],
  ['falha_tecnica', 'EL-03', 190, 'resolvida', 'TC-03', 35, 170, 'Freio de segurança acionando sem motivo', 'Síndico Roberto'],
  ['passageiro_preso', 'EL-07', 160, 'resolvida', 'TC-02', 9, 45, 'Funcionário preso no subsolo', 'Facilities Berrini'],
  ['falha_tecnica', 'EL-10', 130, 'resolvida', 'TC-01', 40, 110, 'Porta do 3º andar com barulho forte', 'Portaria Sé'],
  ['falta_energia', 'EL-08', 100, 'resolvida', 'TC-03', 30, 70, 'Disjuntor da casa de máquinas desarmou', 'Síndica Márcia'],
  ['falha_tecnica', 'EL-03', 72, 'resolvida', 'TC-03', 30, 150, 'Elevador parando entre andares', 'Portaria Jardim Aurora'],
  ['pedido_cliente', 'EL-02', 60, 'resolvida', 'TC-05', 180, 30, 'Ajuste no tempo de abertura das portas', 'Recepção Faria Lima'],
  ['falha_tecnica', 'EL-04', 40, 'em_atendimento', 'TC-04', 25, null, 'Botão de emergência sem sinal na central', 'Segurança do shopping'],
  ['falha_tecnica', 'EL-03', 20, 'em_atendimento', 'TC-03', 20, null, 'Porta não fecha no 4º andar (voltou a acontecer)', 'Síndico Roberto'],
  ['pedido_cliente', 'EL-06', 12, 'aberta', null, null, null, 'Síndico pede visita para avaliar ruído na cabine', 'Zeladoria'],
  ['falta_energia', 'EL-09', 5, 'aberta', null, null, null, 'Queda de energia no prédio, elevador parado no 5º andar', 'Portaria Lapa'],
  ['falha_tecnica', 'EL-05', 3, 'aberta', null, null, null, 'Painel de chamada do 1º andar travado', 'Manutenção do hospital'],
  ['pedido_cliente', 'EL-01', 2, 'aberta', null, null, null, 'Pedido do relatório mensal de manutenção', 'Administração Paulista Center'],
  ['passageiro_preso', 'EL-02', 0.5, 'aberta', null, null, null, 'Três pessoas presas entre o 8º e o 9º andar', 'Recepção Faria Lima'],
]

const HORA = 60 * 60 * 1000
const MINUTO = 60 * 1000

// Monta as ocorrências com datas relativas a "agora", para o dashboard sempre ter dados recentes.
export function gerarOcorrenciasExemplo(prioridadeDoTipo, agora = Date.now()) {
  return HISTORICO.map(([tipo, elevadorId, horasAtras, status, tecnicoId, minAtendimento, minResolucao, descricao, solicitante], i) => {
    const abertaEm = agora - horasAtras * HORA
    const atendimentoEm = minAtendimento === null ? null : abertaEm + minAtendimento * MINUTO
    const resolvidaEm = minResolucao === null ? null : atendimentoEm + minResolucao * MINUTO

    const historico = [{ status: 'aberta', data: new Date(abertaEm).toISOString(), observacao: 'Ocorrência registrada' }]
    if (atendimentoEm) {
      historico.push({ status: 'em_atendimento', data: new Date(atendimentoEm).toISOString(), observacao: 'Técnico a caminho' })
    }
    if (resolvidaEm) {
      historico.push({ status: 'resolvida', data: new Date(resolvidaEm).toISOString(), observacao: 'Atendimento concluído' })
    }

    return {
      id: `OC-${String(i + 1).padStart(4, '0')}`,
      tipo,
      prioridade: prioridadeDoTipo(tipo),
      status,
      elevadorId,
      tecnicoId,
      descricao,
      solicitante,
      abertaEm: new Date(abertaEm).toISOString(),
      atendimentoEm: atendimentoEm && new Date(atendimentoEm).toISOString(),
      resolvidaEm: resolvidaEm && new Date(resolvidaEm).toISOString(),
      historico,
    }
  })
}
