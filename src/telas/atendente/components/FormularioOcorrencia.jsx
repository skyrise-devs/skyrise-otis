// Formulário de abertura de ocorrência (também usado para corrigir os dados)
import { useState } from 'react'

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
