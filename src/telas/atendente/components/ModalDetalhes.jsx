// Detalhes da ocorrência: dados, linha do tempo e botões Editar / Excluir
import { useState } from 'react'
import { TIPOS, buscarElevador, buscarTecnico } from '../../../data/ocorrencias'
import { formatarData } from '../utilsAtendente'
import BadgePrioridade from './BadgePrioridade'
import BadgeStatus from './BadgeStatus'
import FormularioOcorrencia from './FormularioOcorrencia'
import LinhaDoTempo from './LinhaDoTempo'
import Modal from './Modal'

function ModalDetalhes({ ocorrencia, onFechar, onEditar, onExcluir }) {
  const [editando, setEditando] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  const elevador = buscarElevador(ocorrencia.elevadorId)
  const tipo = TIPOS[ocorrencia.tipo]?.rotulo ?? ocorrencia.tipo

  // Se o técnico não for encontrado, mostra o código dele em vez de deixar em branco
  let nomeTecnico = 'Ainda sem técnico'
  if (ocorrencia.tecnicoId) {
    nomeTecnico = buscarTecnico(ocorrencia.tecnicoId)?.nome ?? ocorrencia.tecnicoId
  }

  // Só faz sentido avisar do "fura fila" enquanto a ocorrência não foi resolvida
  const furaFila = ocorrencia.prioridade === 'critica' && ocorrencia.status !== 'resolvida'

  function salvarEdicao(mudancas) {
    onEditar(ocorrencia.id, mudancas)
    setEditando(false)
  }

  function confirmarExclusao() {
    onExcluir(ocorrencia.id)
    onFechar()
  }

  return (
    <Modal
      titulo={editando ? `Editar ocorrência ${ocorrencia.id}` : `Ocorrência ${ocorrencia.id}`}
      onFechar={onFechar}
    >
      <div className="at-detalhe-selos">
        <BadgePrioridade prioridade={ocorrencia.prioridade} />
        <BadgeStatus status={ocorrencia.status} />
        {furaFila && <strong className="at-detalhe-fura">Fura a fila do técnico</strong>}
      </div>

      {editando ? (
        <FormularioOcorrencia
          dadosIniciais={ocorrencia}
          rotuloBotao="Salvar alterações"
          onSalvar={salvarEdicao}
          onCancelar={() => setEditando(false)}
        />
      ) : (
        <>
          <dl className="at-detalhe-dados">
            <div>
              <dt>Tipo</dt>
              <dd>{tipo}</dd>
            </div>
            <div>
              <dt>Elevador</dt>
              <dd>{elevador ? `${elevador.predio} · ${elevador.identificacao}` : ocorrencia.elevadorId}</dd>
            </div>
            {elevador && (
              <div className="at-detalhe-largo">
                <dt>Endereço</dt>
                <dd>{`${elevador.endereco} · Região ${elevador.regiao}`}</dd>
              </div>
            )}
            <div className="at-detalhe-largo">
              <dt>Descrição</dt>
              <dd>{ocorrencia.descricao}</dd>
            </div>
            <div>
              <dt>Solicitante</dt>
              <dd>{ocorrencia.solicitante}</dd>
            </div>
            <div>
              <dt>Técnico</dt>
              <dd>{nomeTecnico}</dd>
            </div>
            <div>
              <dt>Aberta em</dt>
              <dd>{formatarData(ocorrencia.abertaEm)}</dd>
            </div>
            <div>
              <dt>Atendimento iniciado em</dt>
              <dd>{ocorrencia.atendimentoEm ? formatarData(ocorrencia.atendimentoEm) : 'Ainda não iniciado'}</dd>
            </div>
            <div>
              <dt>Resolvida em</dt>
              <dd>{ocorrencia.resolvidaEm ? formatarData(ocorrencia.resolvidaEm) : 'Ainda não resolvida'}</dd>
            </div>
          </dl>

          <LinhaDoTempo historico={ocorrencia.historico} />

          {confirmandoExclusao ? (
            <div className="at-confirmacao-exclusao" role="alert">
              <p>
                Tem certeza de que deseja excluir a ocorrência <strong>{ocorrencia.id}</strong>?
                Esta ação não pode ser desfeita.
              </p>
              <div className="at-confirmacao-botoes">
                <button
                  type="button"
                  className="at-btn"
                  onClick={() => setConfirmandoExclusao(false)}
                >
                  Manter ocorrência
                </button>
                <button
                  type="button"
                  className="at-btn at-btn-perigo"
                  onClick={confirmarExclusao}
                >
                  Sim, excluir ocorrência
                </button>
              </div>
            </div>
          ) : (
            (onEditar || onExcluir) && (
              <div className="at-detalhe-acoes">
                {onEditar && (
                  <button type="button" className="at-btn" onClick={() => setEditando(true)}>
                    Editar dados
                  </button>
                )}
                {onExcluir && (
                  <button
                    type="button"
                    className="at-btn at-btn-perigo"
                    onClick={() => setConfirmandoExclusao(true)}
                  >
                    Excluir ocorrência
                  </button>
                )}
              </div>
            )
          )}
        </>
      )}
    </Modal>
  )
}

export default ModalDetalhes
