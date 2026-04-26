import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { STATUS_CONFIG } from '../../lib/statusConfig.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const STATUS_COLORS = {
  APPLIED:   '#6366f1',
  SCREENING: '#a855f7',
  INTERVIEW: '#f59e0b',
  OFFER:     '#22c55e',
  REJECTED:  '#ef4444',
  WITHDRAWN: '#d1d5db',
}

export default function StatusDoughnut({ counts = {}, total = 0 }) {
  const entries = Object.entries(counts).filter(([, v]) => v > 0)

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
        No data yet
      </div>
    )
  }

  const data = {
    labels: entries.map(([s]) => STATUS_CONFIG[s].label),
    datasets: [
      {
        data: entries.map(([, v]) => v),
        backgroundColor: entries.map(([s]) => STATUS_COLORS[s]),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4,
      },
    ],
  }

  const options = {
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 12,
          font: { size: 12 },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const pct = Math.round((ctx.parsed / total) * 100)
            return ` ${ctx.parsed} (${pct}%)`
          },
        },
      },
    },
  }

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-52 h-52 relative">
        <Doughnut data={data} options={options} />
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900">{total}</span>
          <span className="text-xs text-gray-400">total</span>
        </div>
      </div>
    </div>
  )
}
