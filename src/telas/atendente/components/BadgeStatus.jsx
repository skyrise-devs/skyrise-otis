import { STATUS } from '../../../data/ocorrencias'

function BadgeStatus({ status }) {
  const info = STATUS[status]

  if (!info) return null

  return <span className={`at-status at-status-${status}`}>{info.rotulo}</span>
}

export default BadgeStatus
