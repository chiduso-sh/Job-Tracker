import { useState } from 'react'
import { ALL_STATUSES, STATUS_CONFIG } from '../../lib/statusConfig.js'

const DEFAULT = {
  company: '',
  role: '',
  status: 'APPLIED',
  appliedDate: new Date().toISOString().split('T')[0],
  deadline: '',
  location: '',
  salary: '',
  jobUrl: '',
}

export default function ApplicationForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({ ...DEFAULT, ...initial })
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.company.trim() || !form.role.trim()) {
      setError('Company and role are required.')
      return
    }
    try {
      await onSubmit({
        ...form,
        deadline: form.deadline || null,
        salary: form.salary || null,
        location: form.location || null,
        jobUrl: form.jobUrl || null,
      })
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Company *</label>
          <input className="input" value={form.company} onChange={set('company')} placeholder="Google" />
        </div>
        <div>
          <label className="label">Role *</label>
          <input className="input" value={form.role} onChange={set('role')} placeholder="Software Engineer" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={set('status')}>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Applied date *</label>
          <input className="input" type="date" value={form.appliedDate} onChange={set('appliedDate')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Location</label>
          <input className="input" value={form.location} onChange={set('location')} placeholder="Remote" />
        </div>
        <div>
          <label className="label">Deadline</label>
          <input className="input" type="date" value={form.deadline} onChange={set('deadline')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Salary range</label>
          <input className="input" value={form.salary} onChange={set('salary')} placeholder="$80k – $100k" />
        </div>
        <div>
          <label className="label">Job URL</label>
          <input className="input" value={form.jobUrl} onChange={set('jobUrl')} placeholder="https://..." />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Saving…' : 'Save application'}
        </button>
      </div>
    </form>
  )
}
