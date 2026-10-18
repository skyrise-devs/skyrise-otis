// Confirmação exibida depois de registrar: número da ocorrência e o que acontece com ela
import BadgePrioridade from './BadgePrioridade'

function AvisoRegistro({ ocorrencia, onFechar }) {
  const ehCritica = ocorrencia.prioridade === 'critica'

  return (
    <div className="at-aviso-registro" role="status">
      <div>
        <strong>Ocorrência {ocorrencia.id} registrada.</strong>{' '}
        <BadgePrioridade prioridade={ocorrencia.prioridade} />
        <p>
          {ehCritica
            ? 'Ela já está no topo da fila do técnico.'
            : 'Ela entrou na fila do técnico, pela ordem de prioridade.'}
        </p>
      </div>

      <button type="button" className="at-btn" onClick={onFechar}>Fechar</button>
    </div>
  )
}

export default AvisoRegistro
