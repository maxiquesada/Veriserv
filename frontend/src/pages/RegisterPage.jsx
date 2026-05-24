import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ShieldCheck, User, Wrench } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

function TypeSelector({ value, onChange }) {
  const options = [
    { value: 'cliente',     label: 'Soy cliente',     desc: 'Busco profesionales',   icon: User },
    { value: 'contratista', label: 'Soy profesional', desc: 'Ofrezco mis servicios', icon: Wrench },
  ]
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((o) => {
        const Icon = o.icon
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            className={clsx('flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center',
              value === o.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200')}>
            <Icon className="w-6 h-6" />
            <div>
              <div className="font-medium text-sm">{o.label}</div>
              <div className="text-xs opacity-70">{o.desc}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const [tipo, setTipo] = useState(searchParams.get('tipo') || 'cliente')
  const { register: registerUser, loading } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    if (data.password !== data.confirm) { toast.error('Las contraseñas no coinciden'); return }
    try {
      await registerUser(data.email, data.password, tipo)
      toast.success('¡Cuenta creada! Bienvenido/a a VeriServ.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al crear la cuenta')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta en VeriServ</h1>
          <p className="text-gray-500 text-sm mt-1">Gratis, sin tarjeta de crédito</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">¿Cómo vas a usar VeriServ?</label>
              <TypeSelector value={tipo} onChange={setTipo} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" {...register('email', { required: true })} placeholder="tucorreo@ejemplo.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type="password" {...register('password', { required: true, minLength: 6 })} placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmá la contraseña</label>
              <input type="password" {...register('confirm', { required: true })} placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-medium transition-colors mt-2">
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-5">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Ingresar</Link>
        </p>
      </div>
    </div>
  )
}
