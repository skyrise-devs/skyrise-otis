import { useEffect, useState } from 'react'
import Header from './components/Header'
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

// Telas disponíveis: 'atendente' | 'tecnico' | 'gestao'
function App() {
  const [tela, setTela] = useState('atendente')
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

  return (
    <div id="app-root">
      <Header telaAtual={tela} onNavegar={navegar} onRestaurarExemplo={restaurarExemplo} />

      <main className="app-conteudo">
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
