import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api.js'

const useReminders = () =>
  useQuery({
    queryKey: ['reminders'],
    queryFn: () => api.get('/dashboard/stats').then((r) => r.data.upcomingDeadlines),
  })

export default function Reminders() {
  const { data: deadlines = [], isLoading } = useReminders()
  const navigate = useNavigate()

  const today = new Date()

  const getDaysUntil = (date) => {
    const diff = new Date(date) - today
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const urgencyClass = (days) => {
    if (days <= 2)  return 'text-red-600 bg-red-50 border-red-200'
    if (days <= 7)  return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Reminders</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Upcoming deadlines in the next 14 days
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : deadlines.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 text-lg mb-1">No upcoming deadlines</p>
          <p className="text-sm text-gray-400">
            Add deadline dates to your applications to see them here.
          </p>
          <button
            className="btn-secondary mt-4"
            onClick={() => navigate('/applications')}
          >
            Go to applications
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {deadlines.map((app) => {
            const days = getDaysUntil(app.deadline)
            return (
              <div
                key={app.id}
                className="card flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <div>
                  <p className="font-medium text-gray-900">{app.company}</p>
                  <p className="text-sm text-gray-500">{app.role}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(app.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${urgencyClass(days)}`}
                  >
                    {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days} days`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
