import { STATUS_CONFIG } from '../../lib/statusConfig.js'

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status]
  if (!config) return null

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.classes}`}
    >
      {config.label}
    </span>
  )
}
