import { useState } from 'react'
import {
  useApplications,
  useCreateApplication,
  useUpdateApplication,
  useDeleteApplication,
} from '../hooks/useApplications.js'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Modal from '../components/ui/Modal.jsx'
import ApplicationForm from '../components/ui/ApplicationForm.jsx'
import { ALL_STATUSES, STATUS_CONFIG } from '../lib/statusConfig.js'
import { useNavigate } from 'react-router-dom'
import ExportButton from '../components/ui/ExportButton.jsx'

function deadlineClass(deadline) {
  if (!deadline) return ''
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
  if (days < 0) return 'text-red-500 font-medium'
  if (days <= 3) return 'text-amber-500 font-medium'
  return 'text-gray-500'
}

function formatDeadline(deadline) {
  if (!deadline) return null
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
  const date = new Date(deadline).toLocaleDateString()
  if (days < 0) return `${date} (overdue)`
  if (days === 0) return `${date} (today)`
  if (days === 1) return `${date} (tomorrow)`
  return date
}

export default function Applications() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ status: '', search: '', sort: 'createdAt', order: 'desc' })
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const { data, isLoading } = useApplications(filters)
  const createApp = useCreateApplication()
  const updateApp = useUpdateApplication()
  const deleteApp = useDeleteApplication()

  const applications = data?.applications ?? []

  const handleCreate = async (form) => {
    await createApp.mutateAsync(form)
    setShowAdd(false)
  }

  const handleUpdate = async (form) => {
    await updateApp.mutateAsync({ id: editing.id, ...form })
    setEditing(null)
  }

  const handleDelete = async () => {
    await deleteApp.mutateAsync(confirmDelete.id)
    setConfirmDelete(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.count ?? 0} total</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton />
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            + Add
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          className="input max-w-xs"
          placeholder="Search company or role…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <select
          className="input w-40"
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
        <select
          className="input w-44"
          value={`${filters.sort}-${filters.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-')
            setFilters((f) => ({ ...f, sort, order }))
          }}
        >
          <option value="createdAt-desc">Newest first</option>
          <option value="createdAt-asc">Oldest first</option>
          <option value="appliedDate-desc">Applied date ↓</option>
          <option value="appliedDate-asc">Applied date ↑</option>
          <option value="company-asc">Company A–Z</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <p className="text-lg mb-1">No applications yet</p>
          <p className="text-sm mb-4">Click "+ Add" to get started</p>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            Add your first application
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card p-0 overflow-hidden hidden sm:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Company</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Role</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Applied</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Deadline</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/applications/${app.id}`)}
                  >
                    <td className="px-5 py-3.5 font-medium text-gray-900">{app.company}</td>
                    <td className="px-5 py-3.5 text-gray-600">{app.role}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </td>
                    <td className={`px-5 py-3.5 ${deadlineClass(app.deadline)}`}>
                      {formatDeadline(app.deadline) ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div
                        className="flex items-center gap-2 justify-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="btn-secondary text-xs px-2.5 py-1"
                          onClick={() => setEditing(app)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger text-xs px-2.5 py-1"
                          onClick={() => setConfirmDelete(app)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="card cursor-pointer active:scale-[0.99] transition-transform"
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{app.company}</p>
                    <p className="text-sm text-gray-500">{app.role}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    Applied {new Date(app.appliedDate).toLocaleDateString()}
                  </span>
                  {app.deadline && (
                    <span className={deadlineClass(app.deadline)}>
                      {formatDeadline(app.deadline)}
                    </span>
                  )}
                </div>
                <div
                  className="flex gap-2 mt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="btn-secondary text-xs flex-1"
                    onClick={() => setEditing(app)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger text-xs flex-1"
                    onClick={() => setConfirmDelete(app)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showAdd && (
        <Modal title="Add application" onClose={() => setShowAdd(false)}>
          <ApplicationForm onSubmit={handleCreate} loading={createApp.isPending} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit application" onClose={() => setEditing(null)}>
          <ApplicationForm
            initial={{
              ...editing,
              appliedDate: editing.appliedDate?.split('T')[0] ?? '',
              deadline: editing.deadline?.split('T')[0] ?? '',
            }}
            onSubmit={handleUpdate}
            loading={updateApp.isPending}
          />
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Delete application" onClose={() => setConfirmDelete(null)}>
          <p className="text-gray-600 mb-5">
            Are you sure you want to delete{' '}
            <span className="font-medium text-gray-900">{confirmDelete.role}</span> at{' '}
            <span className="font-medium text-gray-900">{confirmDelete.company}</span>?
            This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setConfirmDelete(null)}>
              Cancel
            </button>
            <button
              className="btn-danger flex-1"
              onClick={handleDelete}
              disabled={deleteApp.isPending}
            >
              {deleteApp.isPending ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
