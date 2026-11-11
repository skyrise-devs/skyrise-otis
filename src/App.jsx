import { useEffect, useState } from 'react'
import Header from './components/Header'
import TelaInicio from './telas/inicio/TelaInicio'
import TelaAtendente from './telas/atendente/TelaAtendente'
import TelaTecnico from './telas/tecnico/TelaTecnico'
import TelaGestao from './telas/gestao/TelaGestao'
import {
  carregarOcorrencias,
  salvarOcorrencias,
  dadosDeExemplo,
  criarOcorrencia,
  editarOcorrencia,
  atribuirTecnico,
  mudarStatus,
} from './data/ocorrencias'

// Telas disponíveis: 'inicio' | 'atendente' | 'tecnico' | 'gestao'
function App() {
  const [tela, setTela] = useState('inicio')
  const [ocorrencias, setOcorrencias] = useState(carregarOcorrencias)

  useEffect(() => {
    salvarOcorrencias(ocorrencias)
  }, [ocorrencias])

  function navegar(novaTela) {
    setTela(novaTela)
    window.scrollTo(0, 0)
  }

  // Aplica uma alteração só na ocorrência com esse id
  function alterar(id, transformar) {
    setOcorrencias(prev => prev.map(o => o.id === id ? transformar(o) : o))
  }

  // Devolve a ocorrência criada, para a tela mostrar o número dela
  function registrarOcorrencia(dados) {
    const nova = criarOcorrencia(ocorrencias, dados)
    setOcorrencias(prev => [nova, ...prev])
    return nova
  }

  function editar(id, mudancas) {
    alterar(id, o => editarOcorrencia(o, mudancas))
  }

  function atribuir(id, tecnicoId) {
    alterar(id, o => atribuirTecnico(o, tecnicoId))
  }

  function atualizarStatus(id, status, observacao) {
    alterar(id, o => mudarStatus(o, status, observacao))
  }

  function excluirOcorrencia(id) {
    setOcorrencias(prev => prev.filter(o => o.id !== id))
  }

  function restaurarExemplo() {
    setOcorrencias(dadosDeExemplo())
  }

  // Selo vermelho do menu: críticas que ninguém assumiu ainda
  const criticasAguardando = ocorrencias.filter(o => o.prioridade === 'critica' && o.status === 'aberta').length

  return (
    <div id="app-root">
      <Header
        telaAtual={tela}
        onNavegar={navegar}
        onRestaurarExemplo={restaurarExemplo}
        criticasAguardando={criticasAguardando}
      />

      <main className="app-conteudo">
        {tela === 'inicio' && (
          <TelaInicio ocorrencias={ocorrencias} onNavegar={navegar} />
        )}

        {tela === 'atendente' && (
          <TelaAtendente
            ocorrencias={ocorrencias}
            onRegistrar={registrarOcorrencia}
            onEditar={editar}
            onExcluir={excluirOcorrencia}
          />
        )}

        {tela === 'tecnico' && (
          <TelaTecnico
            ocorrencias={ocorrencias}
            onAtribuir={atribuir}
            onAtualizarStatus={atualizarStatus}
          />
        )}

        {tela === 'gestao' && (
          <TelaGestao ocorrencias={ocorrencias} />
        )}
      </main>
    </div>
  )
}

export default App
