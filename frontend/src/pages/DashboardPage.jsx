import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/authStore'
import { contractorsAPI, jobsAPI } from '../services/api'
import { StarRating } from '../components/contractor/ContractorCard'
import { User, Wrench, MapPin, Plus, Upload, Briefcase, CheckCircle, Clock, ExternalLink, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

function ClientDashboard({ user }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Hola 👋</h1>
      <p className="text-gray-500 mb-8">Tu cuenta de cliente en VeriServ</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{user.email}</div>
            <div className="text-sm text-gray-500">Cliente</div>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
          <Info className="w-4 h-4 inline mr-1.5" />
          Podés buscar profesionales, ver perfiles y dejar opiniones sobre trabajos contratados.
        </div>
      </div>
      <Link to="/buscar" className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-medium transition-colors">
        <span>Buscar profesionales</span>
        <ExternalLink className="w-5 h-5" />
      </Link>
    </div>
  )
}

function CreateProfileForm({ onCreated }) {
  const { register, handleSubmit } = useForm()
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => contractorsAPI.create(data),
    onSuccess: () => { toast.success('Perfil creado'); onCreated() },
    onError: (e) => toast.error(e.response?.data?.detail || 'Error al crear perfil'),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input {...register('nombre', { required: true })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rubro</label>
          <select {...register('rubro', { required: true })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Seleccioná...</option>
            {['Plomero','Electricista','Gasista','Pintor','Carpintero','Albañil','Cerrajero','Jardinero'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Zona de trabajo</label>
        <input {...register('ubicacion', { required: true })} placeholder="Ej: Córdoba Capital, Villa Carlos Paz..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
        <textarea {...register('descripcion')} rows={3} placeholder="Contá tu experiencia y especialidades..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (opcional)</label>
        <input {...register('whatsapp')} placeholder="+54 9 351 000 0000"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button type="submit" disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors">
        {isPending ? 'Creando...' : 'Crear mi perfil'}
      </button>
    </form>
  )
}

function PublishJobForm({ onPublished }) {
  const { register, handleSubmit, reset } = useForm()
  const [images, setImages] = useState([])
  const { mutate, isPending } = useMutation({
    mutationFn: (fd) => jobsAPI.create(fd),
    onSuccess: () => { toast.success('Trabajo publicado'); reset(); setImages([]); onPublished() },
    onError: (e) => toast.error(e.response?.data?.detail || 'Error al publicar'),
  })
  const onSubmit = (data) => {
    const fd = new FormData()
    fd.append('descripcion', data.descripcion)
    fd.append('fecha', data.fecha)
    images.forEach((img) => fd.append('imagenes', img))
    mutate(fd)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea {...register('descripcion', { required: true, minLength: 10 })} rows={3}
          placeholder="¿Qué trabajo realizaste?"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input type="date" {...register('fecha', { required: true })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fotos (hasta 5)</label>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-5 cursor-pointer hover:border-blue-300 transition-colors">
          <Upload className="w-6 h-6 text-gray-400" />
          <span className="text-sm text-gray-500">Seleccioná imágenes</span>
          <input type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))} />
        </label>
        {images.length > 0 && <p className="text-xs text-green-600 mt-1">{images.length} imagen(es) seleccionada(s)</p>}
      </div>
      <button type="submit" disabled={isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors">
        {isPending ? 'Publicando...' : 'Publicar trabajo'}
      </button>
    </form>
  )
}

function ContractorDashboard({ user }) {
  const [showJobForm, setShowJobForm] = useState(false)
  const qc = useQueryClient()

  const { data: contractors = [], refetch } = useQuery({
    queryKey: ['all-contractors-mine', user.id],
    queryFn: () => contractorsAPI.list({ limit: 100 }).then(r => r.data),
  })
  const contractor = contractors.find(c => c.usuario_id === user.id)

  const { data: jobs = [] } = useQuery({
    queryKey: ['my-jobs', contractor?.id],
    queryFn: () => contractor ? jobsAPI.byContractor(contractor.id).then(r => r.data) : Promise.resolve([]),
    enabled: !!contractor,
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi panel profesional</h1>

      {!contractor ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Creá tu perfil profesional</div>
              <div className="text-sm text-gray-500">Todavía no tenés un perfil de contratista</div>
            </div>
          </div>
          <CreateProfileForm onCreated={() => refetch()} />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl">
                  {contractor.nombre.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{contractor.nombre}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Wrench className="w-3.5 h-3.5" />{contractor.rubro}
                    <MapPin className="w-3.5 h-3.5 ml-1" />{contractor.ubicacion}
                  </div>
                </div>
              </div>
              <Link to={`/contratista/${contractor.id}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                Ver perfil <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-6 pt-4 border-t border-gray-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{contractor.rating_promedio.toFixed(1)}</div>
                <StarRating rating={contractor.rating_promedio} size="sm" />
                <div className="text-xs text-gray-400 mt-0.5">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{contractor.total_reviews}</div>
                <div className="text-xs text-gray-400 mt-1">Opiniones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
                <div className="text-xs text-gray-400 mt-1">Trabajos</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <Plus className="w-5 h-5 text-indigo-600" /> Publicar trabajo
              </div>
              <button onClick={() => setShowJobForm(!showJobForm)} className="text-sm text-blue-600 hover:underline">
                {showJobForm ? 'Cancelar' : 'Agregar'}
              </button>
            </div>
            {showJobForm && (
              <PublishJobForm onPublished={() => { setShowJobForm(false); qc.invalidateQueries(['my-jobs']) }} />
            )}
          </div>

          {jobs.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                <Briefcase className="w-5 h-5 text-gray-400" /> Mis trabajos ({jobs.length})
              </div>
              <div className="space-y-3">
                {jobs.slice(0, 10).map((j) => (
                  <div key={j.id} className="flex items-start gap-3 py-3 border-t border-gray-50 first:border-0 first:pt-0">
                    {j.images?.[0] ? (
                      <img src={j.images[0].url_cloudinary} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 line-clamp-2">{j.descripcion}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span>{j.fecha}</span>
                        <span className="flex items-center gap-0.5">
                          {j.review ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Clock className="w-3 h-3" />}
                          {j.review ? 'Calificado' : 'Sin calificar'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  if (!user) return null
  return user.tipo === 'cliente' ? <ClientDashboard user={user} /> : <ContractorDashboard user={user} />
}
