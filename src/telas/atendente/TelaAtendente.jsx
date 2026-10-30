import { useState } from 'react'
import AvisoRegistro from './components/AvisoRegistro'
import BarraFiltros from './components/BarraFiltros'
import FormularioOcorrencia from './components/FormularioOcorrencia'
import ListaOcorrencias from './components/ListaOcorrencias'
import ModalDetalhes from './components/ModalDetalhes'
import PainelPrioridades from './components/PainelPrioridades'
import { FILTROS_VAZIOS, filtrarOcorrencias, temFiltroAtivo } from './utilsAtendente'
import './atendente.css'

function TelaAtendente({ ocorrencias, onRegistrar, onEditar, onExcluir }) {
  const [registrada, setRegistrada] = useState(null)
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS)
  const [idAberto, setIdAberto] = useState(null)

  const abertas = ocorrencias.filter(o => o.status === 'aberta').length
  const criticasAtivas = ocorrencias.filter(o => o.prioridade === 'critica' && o.status !== 'resolvida').length

  const filtradas = filtrarOcorrencias(ocorrencias, filtros)

  const ocorrenciaAberta = ocorrencias.find(o => o.id === idAberto)

  function registrar(dados) {
    setRegistrada(onRegistrar(dados))
  }

  function excluir(id) {
    if (registrada?.id === id) setRegistrada(null)
    onExcluir(id)
  }

  function limparFiltros() {
    setFiltros(FILTROS_VAZIOS)
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
            <AvisoRegistro
              ocorrencia={registrada}
              onAbrir={setIdAberto}
              onFechar={() => setRegistrada(null)}
            />
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
              onLimpar={limparFiltros}
            />
            <ListaOcorrencias
              ocorrencias={filtradas}
              total={ocorrencias.length}
              filtrando={temFiltroAtivo(filtros)}
              onAbrir={setIdAberto}
              onLimparFiltros={limparFiltros}
            />
          </section>
        </div>
      </div>

      {ocorrenciaAberta && (
        <ModalDetalhes
          ocorrencia={ocorrenciaAberta}
          onFechar={() => setIdAberto(null)}
          onEditar={onEditar}
          onExcluir={excluir}
        />
      )}
    </section>
  )
}

export default TelaAtendente
