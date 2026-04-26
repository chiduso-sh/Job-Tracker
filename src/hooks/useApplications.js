import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api.js'

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useApplications = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.status)  params.set('status', filters.status)
  if (filters.search)  params.set('search', filters.search)
  if (filters.sort)    params.set('sort', filters.sort)
  if (filters.order)   params.set('order', filters.order)

  return useQuery({
    queryKey: ['applications', filters],
    queryFn: () => api.get(`/applications?${params}`).then((r) => r.data),
  })
}

export const useApplication = (id) =>
  useQuery({
    queryKey: ['applications', id],
    queryFn: () => api.get(`/applications/${id}`).then((r) => r.data.application),
    enabled: !!id,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateApplication = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/applications', data).then((r) => r.data.application),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  })
}

export const useUpdateApplication = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      api.patch(`/applications/${id}`, data).then((r) => r.data.application),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['applications'] })
      qc.invalidateQueries({ queryKey: ['applications', id] })
    },
  })
}

export const useDeleteApplication = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/applications/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  })
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export const useNotes = (applicationId) =>
  useQuery({
    queryKey: ['notes', applicationId],
    queryFn: () =>
      api.get(`/applications/${applicationId}/notes`).then((r) => r.data.notes),
    enabled: !!applicationId,
  })

export const useCreateNote = (applicationId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (content) =>
      api.post(`/applications/${applicationId}/notes`, { content }).then((r) => r.data.note),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes', applicationId] }),
  })
}

export const useDeleteNote = (applicationId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (noteId) => api.delete(`/notes/${noteId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes', applicationId] }),
  })
}
