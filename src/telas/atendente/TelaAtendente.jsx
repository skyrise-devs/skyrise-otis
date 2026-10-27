import { useState } from 'react'
import AvisoRegistro from './components/AvisoRegistro'
import BarraFiltros from './components/BarraFiltros'
import FormularioOcorrencia from './components/FormularioOcorrencia'
import ListaOcorrencias from './components/ListaOcorrencias'
import ModalDetalhes from './components/ModalDetalhes'
import PainelPrioridades from './components/PainelPrioridades'
import { FILTROS_VAZIOS, filtrarOcorrencias, temFiltroAtivo } from './utilsAtendente'
import './atendente.css'

// P2 · Pedro Henrique
// A fazer: formulário de abertura (use validarOcorrencia + onRegistrar),
// lista com busca e filtros, e a tela de detalhe com o histórico
// (para corrigir uma ocorrência, use onEditar).
function TelaAtendente({ ocorrencias, onRegistrar }) {
  // Última ocorrência registrada (null = nenhum aviso na tela)
  const [registrada, setRegistrada] = useState(null)
  // Busca e filtros: a lista é recalculada a cada mudança (reativo)
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS)
  // Guardamos só o id da ocorrência aberta: o modal sempre mostra a versão mais nova dela
  const [idAberto, setIdAberto] = useState(null)

  // Contadores do resumo: calculados a cada render, a partir da lista recebida por props
  const abertas = ocorrencias.filter(o => o.status === 'aberta').length
  const criticasAtivas = ocorrencias.filter(o => o.prioridade === 'critica' && o.status !== 'resolvida').length

  // O que aparece na lista depois da busca e dos filtros
  const filtradas = filtrarOcorrencias(ocorrencias, filtros)

  // Ocorrência do modal (undefined = modal fechado)
  const ocorrenciaAberta = ocorrencias.find(o => o.id === idAberto)

  // onRegistrar devolve a ocorrência criada: guardamos para mostrar o número dela
  function registrar(dados) {
    setRegistrada(onRegistrar(dados))
  }

  return (
    <section className="tela-atendente">
      <header className="at-cabecalho">
        <h1>Portal do Atendente</h1>
        <p>Registre chamados, acompanhe a fila e corrija ocorrências.</p>
      </header>

      <section className="at-resumo" aria-label="Resumo das ocorrências">
        <div className="at-resumo-item">
          <span className="at-resumo-numero">{ocorrencias.length}</span>
          <span className="at-resumo-rotulo">Ocorrências registradas</span>
        </div>
        <div className="at-resumo-item">
          <span className="at-resumo-numero">{abertas}</span>
          <span className="at-resumo-rotulo">Aguardando técnico</span>
        </div>
        <div className="at-resumo-item critico">
          <span className="at-resumo-numero">{criticasAtivas}</span>
          <span className="at-resumo-rotulo">Críticas em andamento</span>
        </div>
      </section>

      <div className="at-colunas">
        <div className="at-coluna-form">
          {registrada && (
            <AvisoRegistro ocorrencia={registrada} onFechar={() => setRegistrada(null)} />
          )}

          <section className="at-cartao">
            <h2>Nova ocorrência</h2>
            <FormularioOcorrencia onSalvar={registrar} />
          </section>

          <PainelPrioridades />
        </div>

        <div className="at-coluna-lista">
          <section className="at-cartao">
            <h2>Ocorrências</h2>
            <BarraFiltros
              filtros={filtros}
              onMudar={setFiltros}
              onLimpar={() => setFiltros(FILTROS_VAZIOS)}
            />
            <ListaOcorrencias
              ocorrencias={filtradas}
              total={ocorrencias.length}
              filtrando={temFiltroAtivo(filtros)}
              onAbrir={setIdAberto}
            />
          </section>
        </div>
      </div>

      {ocorrenciaAberta && (
        <ModalDetalhes ocorrencia={ocorrenciaAberta} onFechar={() => setIdAberto(null)} />
      )}
    </section>
  )
}

export default TelaAtendente
