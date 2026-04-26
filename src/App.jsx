import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AppLayout from './components/layout/AppLayout.jsx'

import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Applications from './pages/Applications.jsx'
import ApplicationDetail from './pages/ApplicationDetail.jsx'
import Reminders from './pages/Reminders.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected — all wrapped in layout with navbar */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/"                   element={<Dashboard />} />
              <Route path="/applications"       element={<Applications />} />
              <Route path="/applications/:id"   element={<ApplicationDetail />} />
              <Route path="/reminders"          element={<Reminders />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
