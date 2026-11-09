import { useState } from 'react'
import { TIPOS, ELEVADORES, buscarElevador, calcularPrioridade, validarOcorrencia } from '../../../data/ocorrencias'
import { ORDEM_DOS_TIPOS, errosPorCampo } from '../utilsAtendente'
import BadgePrioridade from './BadgePrioridade'

const DADOS_VAZIOS = { tipo: '', elevadorId: '', descricao: '', solicitante: '' }

function estadoInicial(dadosIniciais) {
  if (!dadosIniciais) return DADOS_VAZIOS

  return {
    tipo: dadosIniciais.tipo ?? '',
    elevadorId: dadosIniciais.elevadorId ?? '',
    descricao: dadosIniciais.descricao ?? '',
    solicitante: dadosIniciais.solicitante ?? '',
  }
}

function FormularioOcorrencia({
  onSalvar,
  dadosIniciais = null,
  rotuloBotao = 'Registrar ocorrência',
  onCancelar = null,
}) {
  const [dados, setDados] = useState(() => estadoInicial(dadosIniciais))
  const [tentouEnviar, setTentouEnviar] = useState(false)

  const elevador = buscarElevador(dados.elevadorId)

  const prioridade = dados.tipo ? calcularPrioridade(dados.tipo) : ''

  const erros = tentouEnviar ? errosPorCampo(dados) : {}

  function atualizarCampo(e) {
    setDados({ ...dados, [e.target.name]: e.target.value })
  }

  function enviar(e) {
    e.preventDefault()
    setTentouEnviar(true)

    if (validarOcorrencia(dados).length > 0) return

    onSalvar(dados)

    if (!dadosIniciais) {
      setDados(DADOS_VAZIOS)
      setTentouEnviar(false)
    }
  }

  return (
    <form className="at-form" onSubmit={enviar}>
      <label className={erros.tipo ? 'at-campo at-campo-invalido' : 'at-campo'}>
        <span className="at-campo-rotulo">Tipo da ocorrência</span>
        <select
          name="tipo"
          value={dados.tipo}
          onChange={atualizarCampo}
          aria-invalid={erros.tipo ? 'true' : 'false'}
        >
          <option value="">Selecione o tipo</option>
          {ORDEM_DOS_TIPOS.map(tipo => (
            <option key={tipo} value={tipo}>{TIPOS[tipo].rotulo}</option>
          ))}
        </select>
        {prioridade && (
          <span className="at-prioridade-aviso">
            Prioridade desta ocorrência: <BadgePrioridade prioridade={prioridade} />
            {prioridade === 'critica' && <strong>fura a fila do técnico</strong>}
          </span>
        )}
        {erros.tipo && <span className="at-campo-erro" role="alert">{erros.tipo}</span>}
      </label>

      <label className={erros.elevadorId ? 'at-campo at-campo-invalido' : 'at-campo'}>
        <span className="at-campo-rotulo">Elevador</span>
        <select
          name="elevadorId"
          value={dados.elevadorId}
          onChange={atualizarCampo}
          aria-invalid={erros.elevadorId ? 'true' : 'false'}
        >
          <option value="">Selecione o elevador</option>
          {ELEVADORES.map(e => (
            <option key={e.id} value={e.id}>{`${e.id} · ${e.predio} (${e.identificacao})`}</option>
          ))}
        </select>
        {elevador && (
          <small className="at-campo-dica">{`${elevador.endereco} · Região ${elevador.regiao}`}</small>
        )}
        {erros.elevadorId && <span className="at-campo-erro" role="alert">{erros.elevadorId}</span>}
      </label>

      <label className={erros.descricao ? 'at-campo at-campo-invalido' : 'at-campo'}>
        <span className="at-campo-rotulo">Descreva o problema</span>
        <textarea
          name="descricao"
          rows="4"
          value={dados.descricao}
          onChange={atualizarCampo}
          placeholder="Ex.: duas pessoas presas entre o 5º e o 6º andar"
          aria-invalid={erros.descricao ? 'true' : 'false'}
        />
        {erros.descricao && <span className="at-campo-erro" role="alert">{erros.descricao}</span>}
      </label>

      <label className={erros.solicitante ? 'at-campo at-campo-invalido' : 'at-campo'}>
        <span className="at-campo-rotulo">Quem está solicitando</span>
        <input
          type="text"
          name="solicitante"
          value={dados.solicitante}
          onChange={atualizarCampo}
          placeholder="Ex.: portaria, síndico, recepção"
          aria-invalid={erros.solicitante ? 'true' : 'false'}
        />
        {erros.solicitante && <span className="at-campo-erro" role="alert">{erros.solicitante}</span>}
      </label>

      <div className="at-form-acoes">
        {onCancelar && (
          <button type="button" className="at-btn" onClick={onCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="at-btn at-btn-primario">{rotuloBotao}</button>
      </div>
    </form>
  )
}

export default FormularioOcorrencia
