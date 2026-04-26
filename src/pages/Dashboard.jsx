import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import StatusDoughnut from '../components/ui/StatusDoughnut.jsx'
import ApplicationTimeline from '../components/ui/ApplicationTimeline.jsx'

const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard/stats').then((r) => r.data),
  })

const StatCard = ({ label, value, sub, color = 'text-gray-900' }) => (
  <div className="card">
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const { data, isLoading } = useDashboard()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const counts = data?.counts ?? {}
  const total = data?.total ?? 0
  const upcoming = data?.upcomingDeadlines ?? []
  const recentApplications = data?.recentApplications ?? []

  const responseRate =
    total > 0
      ? Math.round(
          (((counts.SCREENING ?? 0) + (counts.INTERVIEW ?? 0) + (counts.OFFER ?? 0)) / total) * 100
        )
      : 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Here's your job search at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total applied"  value={total} />
        <StatCard label="Interviews"     value={counts.INTERVIEW ?? 0} color="text-amber-600" />
        <StatCard label="Offers"         value={counts.OFFER ?? 0}     color="text-green-600" />
        <StatCard
          label="Response rate"
          value={`${responseRate}%`}
          sub="Screening + interviews + offers"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="card flex flex-col items-center">
          <h2 className="font-medium text-gray-900 mb-4 self-start">By status</h2>
          <StatusDoughnut counts={counts} total={total} />
        </div>
        <div className="card md:col-span-2">
          <h2 className="font-medium text-gray-900 mb-4">Applications over time</h2>
          <ApplicationTimeline recentApplications={recentApplications} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Upcoming deadlines */}
        <div className="card">
          <h2 className="font-medium text-gray-900 mb-4">Upcoming deadlines</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-400">No deadlines in the next 14 days.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((app) => {
                const days = Math.ceil(
                  (new Date(app.deadline) - new Date()) / (1000 * 60 * 60 * 24)
                )
                const urgency =
                  days <= 2 ? 'text-red-500' : days <= 7 ? 'text-amber-500' : 'text-green-500'
                return (
                  <li
                    key={app.id}
                    className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                    onClick={() => navigate(`/applications/${app.id}`)}
                  >
                    <p className="text-sm font-medium text-gray-900">{app.company}</p>
                    <p className="text-xs text-gray-500">{app.role}</p>
                    <p className={`text-xs mt-0.5 font-medium ${urgency}`}>
                      {days === 0
                        ? 'Today'
                        : days === 1
                        ? 'Tomorrow'
                        : `${days} days — ${new Date(app.deadline).toLocaleDateString()}`}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
          {upcoming.length > 0 && (
            <button
              className="btn-secondary w-full mt-4 text-xs"
              onClick={() => navigate('/reminders')}
            >
              View all reminders
            </button>
          )}
        </div>

        {/* Quick actions + summary */}
        <div className="card md:col-span-2">
          <h2 className="font-medium text-gray-900 mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-primary" onClick={() => navigate('/applications')}>
              View all applications
            </button>
            <button className="btn-secondary" onClick={() => navigate('/applications')}>
              + Add application
            </button>
            <button
              className="btn-secondary col-span-2"
              onClick={() => navigate('/reminders')}
            >
              View reminders
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Active',   value: (counts.APPLIED ?? 0) + (counts.SCREENING ?? 0) + (counts.INTERVIEW ?? 0) },
              { label: 'Rejected', value: counts.REJECTED ?? 0 },
              { label: 'Offers',   value: counts.OFFER ?? 0 },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
