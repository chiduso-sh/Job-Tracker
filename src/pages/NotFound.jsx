import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="text-6xl font-bold text-gray-100 mb-2">404</p>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Page not found</h1>
        <p className="text-gray-500 text-sm mb-6">
          The page you're looking for doesn't exist.
        </p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Go home
        </button>
      </div>
    </div>
  )
}
