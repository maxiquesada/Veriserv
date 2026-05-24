import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ContractorProfilePage from './pages/ContractorProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } } })

function PrivateRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuthStore()
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin()) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const loadUser = useAuthStore((s) => s.loadUser)
  useEffect(() => { loadUser() }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"                element={<HomePage />} />
            <Route path="/buscar"          element={<SearchPage />} />
            <Route path="/contratista/:id" element={<ContractorProfilePage />} />
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/registro"        element={<RegisterPage />} />
            <Route path="/dashboard"       element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/admin"           element={<PrivateRoute adminOnly><AdminPage /></PrivateRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
