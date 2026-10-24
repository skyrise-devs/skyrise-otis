// Busca por texto + filtros por status, tipo e data
import { STATUS, TIPOS } from '../../../data/ocorrencias'
import { ORDEM_DOS_TIPOS } from '../utilsAtendente'

// Do começo ao fim do atendimento
const ORDEM_DOS_STATUS = ['aberta', 'em_atendimento', 'resolvida']

// Os campos são controlados pela tela: ela guarda os filtros e passa por props
function BarraFiltros({ filtros, onMudar }) {
  // Um só handler: o name do campo diz qual filtro muda
  function atualizarFiltro(e) {
    onMudar({ ...filtros, [e.target.name]: e.target.value })
  }

  return (
    <div className="at-filtros" role="search">
      <label className="at-campo at-filtro-busca">
        <span className="at-campo-rotulo">Buscar</span>
        <input
          type="search"
          name="busca"
          value={filtros.busca}
          onChange={atualizarFiltro}
          placeholder="Número, prédio, solicitante ou descrição"
        />
      </label>

      <label className="at-campo">
        <span className="at-campo-rotulo">Status</span>
        <select name="status" value={filtros.status} onChange={atualizarFiltro}>
          <option value="">Todos os status</option>
          {ORDEM_DOS_STATUS.map(status => (
            <option key={status} value={status}>{STATUS[status].rotulo}</option>
          ))}
        </select>
      </label>

      <label className="at-campo">
        <span className="at-campo-rotulo">Tipo</span>
        <select name="tipo" value={filtros.tipo} onChange={atualizarFiltro}>
          <option value="">Todos os tipos</option>
          {ORDEM_DOS_TIPOS.map(tipo => (
            <option key={tipo} value={tipo}>{TIPOS[tipo].rotulo}</option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default BarraFiltros
