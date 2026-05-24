import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { contractorsAPI, reviewsAPI } from '../services/api'
import { StarRating } from '../components/contractor/ContractorCard'
import ReviewForm from '../components/review/ReviewForm'
import { MapPin, Wrench, MessageCircle, Calendar } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function ContractorProfilePage() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuthStore()

  const { data: contractor, isLoading } = useQuery({
    queryKey: ['contractor', id],
    queryFn: () => contractorsAPI.get(id).then((r) => r.data),
  })

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsAPI.byContractor(id).then((r) => r.data),
  })

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="h-48 bg-gray-100 rounded-2xl animate-pulse mb-6" />
      <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
    </div>
  )

  if (!contractor) return <div className="text-center py-20 text-gray-500">Contratista no encontrado.</div>

  const whatsappUrl = contractor.whatsapp
    ? `https://wa.me/${contractor.whatsapp.replace(/\D/g, '')}?text=Hola, te encontré en VeriServ.`
    : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="h-4 bg-gradient-to-r from-blue-500 to-indigo-600" />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-3xl font-bold flex-shrink-0">
              {contractor.nombre.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">{contractor.nombre}</h1>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Wrench className="w-4 h-4" />{contractor.rubro}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{contractor.ubicacion}</span>
              </div>
              {contractor.descripcion && <p className="mt-3 text-gray-600">{contractor.descripcion}</p>}
            </div>
            <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-4 text-center flex-shrink-0">
              <div className="text-3xl font-bold text-gray-900">{contractor.rating_promedio.toFixed(1)}</div>
              <StarRating rating={contractor.rating_promedio} size="md" />
              <div className="text-xs text-gray-500">{contractor.total_reviews} opiniones</div>
            </div>
          </div>
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
              <MessageCircle className="w-5 h-5" /> Contactar por WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Trabajos */}
      {contractor.jobs?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trabajos realizados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contractor.jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {job.images?.[0] && <img src={job.images[0].url_cloudinary} alt="Trabajo" className="w-full h-48 object-cover" />}
                <div className="p-4">
                  <p className="text-sm text-gray-700 line-clamp-3">{job.descripcion}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                    <Calendar className="w-3.5 h-3.5" /><span>{job.fecha}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Opiniones */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Opiniones ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">Todavía no hay opiniones aprobadas.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <StarRating rating={r.estrellas} />
                  <span className="text-xs text-gray-400">{r.created_at?.slice(0, 10)}</span>
                </div>
                <p className="text-sm text-gray-700">{r.comentario}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Formulario review */}
      {isAuthenticated() && user?.tipo === 'cliente' && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dejar una opinión</h2>
          <ReviewForm contractorId={id} jobs={contractor.jobs || []} />
        </section>
      )}
    </div>
  )
}
