// Confirmação exibida depois de registrar: número da ocorrência e o que acontece com ela
import BadgePrioridade from './BadgePrioridade'

function AvisoRegistro({ ocorrencia, onAbrir, onFechar }) {
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

      <div className="at-aviso-acoes">
        {onAbrir && (
          <button type="button" className="at-btn" onClick={() => onAbrir(ocorrencia.id)}>
            Ver detalhes
          </button>
        )}
        <button type="button" className="at-btn" onClick={onFechar}>Fechar</button>
      </div>
    </div>
  )
}

export default AvisoRegistro
