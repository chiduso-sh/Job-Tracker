import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useApplication,
  useUpdateApplication,
  useDeleteApplication,
  useNotes,
  useCreateNote,
  useDeleteNote,
} from '../hooks/useApplications.js'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Modal from '../components/ui/Modal.jsx'
import ApplicationForm from '../components/ui/ApplicationForm.jsx'
import { ALL_STATUSES, STATUS_CONFIG } from '../lib/statusConfig.js'

// Status progression order for the history tracker
const STATUS_ORDER = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER']

function DeadlineBadge({ deadline }) {
  if (!deadline) return null
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
  const isPast = days < 0

  const cls = isPast
    ? 'bg-red-50 text-red-700 border-red-200'
    : days <= 3
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-green-50 text-green-700 border-green-200'

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${cls}`}>
      {isPast
        ? `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`
        : days === 0
        ? 'Due today'
        : days === 1
        ? 'Due tomorrow'
        : `Due in ${days} days`}
    </span>
  )
}

function StatusTracker({ current }) {
  const isTerminal = current === 'REJECTED' || current === 'WITHDRAWN'
  const currentIdx = STATUS_ORDER.indexOf(current)

  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        {STATUS_ORDER.map((s, i) => {
          const reached = !isTerminal && currentIdx >= i
          return (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-colors ${
                    reached
                      ? 'bg-brand-600 border-brand-600'
                      : 'bg-white border-gray-200'
                  }`}
                />
                <span className="text-xs text-gray-400 mt-1 whitespace-nowrap">
                  {STATUS_CONFIG[s].label}
                </span>
              </div>
              {i < STATUS_ORDER.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mb-3 transition-colors ${
                    !isTerminal && currentIdx > i ? 'bg-brand-600' : 'bg-gray-100'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
      {isTerminal && (
        <p className="text-xs text-center text-gray-400 mt-1">
          Application {STATUS_CONFIG[current].label.toLowerCase()}
        </p>
      )}
    </div>
  )
}

export default function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [noteText, setNoteText] = useState('')

  const { data: application, isLoading } = useApplication(id)
  const { data: notes = [] } = useNotes(id)
  const updateApp = useUpdateApplication()
  const deleteApp = useDeleteApplication()
  const createNote = useCreateNote(id)
  const deleteNote = useDeleteNote(id)

  const handleUpdate = async (form) => {
    await updateApp.mutateAsync({ id, ...form })
    setEditing(false)
  }

  const handleStatusChange = (status) => updateApp.mutate({ id, status })

  const handleDelete = async () => {
    if (!confirm('Delete this application? This cannot be undone.')) return
    await deleteApp.mutateAsync(id)
    navigate('/applications')
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!noteText.trim()) return
    await createNote.mutateAsync(noteText.trim())
    setNoteText('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="text-center py-24 text-gray-400">
        <p>Application not found.</p>
        <button className="btn-secondary mt-4" onClick={() => navigate('/applications')}>
          Back to applications
        </button>
      </div>
    )
  }

  const fields = [
    { label: 'Location', value: application.location },
    { label: 'Salary',   value: application.salary },
    { label: 'Applied',  value: application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : null },
    { label: 'Job URL',  value: application.jobUrl, isLink: true },
  ]

  return (
    <div className="max-w-3xl">
      <button
        className="text-sm text-gray-400 hover:text-gray-600 mb-5 flex items-center gap-1"
        onClick={() => navigate('/applications')}
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-semibold text-gray-900">{application.role}</h1>
            <StatusBadge status={application.status} />
            {application.deadline && <DeadlineBadge deadline={application.deadline} />}
          </div>
          <p className="text-gray-500">{application.company}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="btn-secondary text-sm" onClick={() => setEditing(true)}>Edit</button>
          <button className="btn-danger text-sm" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {/* Status tracker */}
      <div className="card mb-5">
        <h2 className="font-medium text-gray-900 mb-4 text-sm">Progress</h2>
        <StatusTracker current={application.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left — details + notes */}
        <div className="md:col-span-2 space-y-5">
          {/* Info */}
          <div className="card space-y-3">
            {fields.map(({ label, value, isLink }) =>
              value ? (
                <div key={label} className="flex items-start justify-between text-sm gap-4">
                  <span className="text-gray-400 w-20 shrink-0">{label}</span>
                  {isLink ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 hover:underline truncate"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-gray-900 text-right">{value}</span>
                  )}
                </div>
              ) : null
            )}
            {fields.every(({ value }) => !value) && (
              <p className="text-sm text-gray-400">No additional details. Click Edit to add some.</p>
            )}
          </div>

          {/* Notes */}
          <div className="card">
            <h2 className="font-medium text-gray-900 mb-4">
              Notes
              {notes.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">({notes.length})</span>
              )}
            </h2>
            <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
              <input
                className="input flex-1"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note…"
              />
              <button
                type="submit"
                className="btn-primary px-4 shrink-0"
                disabled={createNote.isPending || !noteText.trim()}
              >
                Add
              </button>
            </form>

            {notes.length === 0 ? (
              <p className="text-sm text-gray-400">No notes yet.</p>
            ) : (
              <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {notes.map((note) => (
                  <li key={note.id} className="flex items-start justify-between gap-3 text-sm group">
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">{note.content}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      className="text-gray-200 group-hover:text-red-400 text-xs shrink-0 transition-colors pt-0.5"
                      onClick={() => deleteNote.mutate(note.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right — status picker */}
        <div className="card self-start">
          <h2 className="font-medium text-gray-900 mb-3 text-sm">Change status</h2>
          <div className="space-y-1">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  application.status === s
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => handleStatusChange(s)}
                disabled={application.status === s || updateApp.isPending}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {editing && (
        <Modal title="Edit application" onClose={() => setEditing(false)}>
          <ApplicationForm
            initial={{
              ...application,
              appliedDate: application.appliedDate?.split('T')[0] ?? '',
              deadline: application.deadline?.split('T')[0] ?? '',
            }}
            onSubmit={handleUpdate}
            loading={updateApp.isPending}
          />
        </Modal>
      )}
    </div>
  )
}
