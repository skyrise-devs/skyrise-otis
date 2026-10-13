// Formulário de abertura de ocorrência (também usado para corrigir os dados)
import { useState } from 'react'
import { TIPOS, ELEVADORES } from '../../../data/ocorrencias'
import { ORDEM_DOS_TIPOS } from '../utilsAtendente'

const DADOS_VAZIOS = { tipo: '', elevadorId: '', descricao: '', solicitante: '' }

function FormularioOcorrencia() {
  const [dados, setDados] = useState(DADOS_VAZIOS)

  // Um só handler para todos os campos: o name do campo diz qual chave do objeto muda
  function atualizarCampo(e) {
    setDados({ ...dados, [e.target.name]: e.target.value })
  }

  function enviar(e) {
    e.preventDefault()
  }

  return (
    <form className="at-form" onSubmit={enviar}>
      <label className="at-campo">
        <span className="at-campo-rotulo">Tipo da ocorrência</span>
        <select name="tipo" value={dados.tipo} onChange={atualizarCampo}>
          <option value="">Selecione o tipo</option>
          {ORDEM_DOS_TIPOS.map(tipo => (
            <option key={tipo} value={tipo}>{TIPOS[tipo].rotulo}</option>
          ))}
        </select>
      </label>

      <label className="at-campo">
        <span className="at-campo-rotulo">Elevador</span>
        <select name="elevadorId" value={dados.elevadorId} onChange={atualizarCampo}>
          <option value="">Selecione o elevador</option>
          {ELEVADORES.map(e => (
            <option key={e.id} value={e.id}>{`${e.id} · ${e.predio} (${e.identificacao})`}</option>
          ))}
        </select>
      </label>

      <label className="at-campo">
        <span className="at-campo-rotulo">Quem está solicitando</span>
        <input
          type="text"
          name="solicitante"
          value={dados.solicitante}
          onChange={atualizarCampo}
          placeholder="Ex.: portaria, síndico, recepção"
        />
      </label>

      <div className="at-form-acoes">
        <button type="submit" className="at-btn at-btn-primario">Registrar ocorrência</button>
      </div>
    </form>
  )
}

export default FormularioOcorrencia
