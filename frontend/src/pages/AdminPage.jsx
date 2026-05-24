import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../services/api'
import { Star, Check, Trash2, Users, Briefcase, MessageSquare, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value ?? '—'}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const qc = useQueryClient()
  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: () => adminAPI.stats().then(r => r.data) })
  const { data: pending = [] } = useQuery({ queryKey: ['pending-reviews'], queryFn: () => adminAPI.pendingReviews().then(r => r.data) })
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => adminAPI.users().then(r => r.data) })

  const approve = useMutation({ mutationFn: (id) => adminAPI.approveReview(id), onSuccess: () => { toast.success('Review aprobada'); qc.invalidateQueries() } })
  const deleteRev = useMutation({ mutationFn: (id) => adminAPI.deleteReview(id), onSuccess: () => { toast.success('Review eliminada'); qc.invalidateQueries() } })
  const toggleUser = useMutation({ mutationFn: (id) => adminAPI.toggleUser(id), onSuccess: () => qc.invalidateQueries(['admin-users']) })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de administración</h1>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Usuarios" value={stats.total_usuarios} color="bg-blue-50 text-blue-600" />
          <StatCard icon={Briefcase} label="Contratistas" value={stats.total_contratistas} color="bg-indigo-50 text-indigo-600" />
          <StatCard icon={MessageSquare} label="Pendientes" value={stats.reviews_pendientes} color="bg-amber-50 text-amber-600" />
          <StatCard icon={BarChart3} label="Aprobadas" value={stats.reviews_aprobadas} color="bg-green-50 text-green-600" />
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews pendientes ({pending.length})</h2>
        {pending.length === 0 ? <p className="text-gray-500 text-sm">No hay reviews pendientes.</p> : (
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(r.estrellas)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-sm text-gray-700">{r.comentario}</p>
                    <p className="text-xs text-gray-400 mt-1">{r.created_at?.slice(0, 10)}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => approve.mutate(r.id)}
                      className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                      <Check className="w-3.5 h-3.5" /> Aprobar
                    </button>
                    <button onClick={() => deleteRev.mutate(r.id)}
                      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Usuarios registrados</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Tipo</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-left px-4 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.tipo === 'admin' ? 'bg-purple-100 text-purple-700' :
                      u.tipo === 'contratista' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{u.tipo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.tipo !== 'admin' && (
                      <button onClick={() => toggleUser.mutate(u.id)} className="text-xs text-gray-500 hover:text-gray-800 underline">
                        {u.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
