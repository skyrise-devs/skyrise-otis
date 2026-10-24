// Busca por texto + filtros por status, tipo e data

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
    </div>
  )
}

export default BarraFiltros
