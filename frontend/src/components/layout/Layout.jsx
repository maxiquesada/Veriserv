import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ShieldCheck, Search, LogIn, LogOut, LayoutDashboard, Settings } from 'lucide-react'

export default function Layout() {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            VeriServ
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/buscar" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Search className="w-4 h-4" /> Buscar
            </Link>
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> Mi panel
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                    <Settings className="w-4 h-4" /> Admin
                  </Link>
                )}
                <button onClick={() => { logout(); navigate('/') }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors ml-1">
                  <LogOut className="w-4 h-4" /> Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <LogIn className="w-4 h-4" /> Ingresar
                </Link>
                <Link to="/registro" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors ml-1">
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
          <span>© 2025 VeriServ — Servicios del hogar con reputación verificable</span>
          <div className="flex gap-4">
            <Link to="/buscar" className="hover:text-gray-600 transition-colors">Buscar profesionales</Link>
            <Link to="/registro" className="hover:text-gray-600 transition-colors">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
