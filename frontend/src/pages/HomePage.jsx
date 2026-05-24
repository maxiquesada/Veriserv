import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { contractorsAPI } from '../services/api'
import ContractorCard from '../components/contractor/ContractorCard'
import { ShieldCheck, Star, Search, Award, MessageCircle, ArrowRight, ChevronRight } from 'lucide-react'

const RUBROS = [
  { label: 'Plomero',       emoji: '🔧' },
  { label: 'Electricista',  emoji: '⚡' },
  { label: 'Gasista',       emoji: '🔥' },
  { label: 'Pintor',        emoji: '🎨' },
  { label: 'Carpintero',    emoji: '🪚' },
  { label: 'Albañil',       emoji: '🧱' },
  { label: 'Cerrajero',     emoji: '🔑' },
  { label: 'Jardinero',     emoji: '🌿' },
]

function HeroSearch() {
  const [rubro, setRubro] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const navigate = useNavigate()
  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (rubro) params.set('rubro', rubro)
    if (ubicacion) params.set('ubicacion', ubicacion)
    navigate(`/buscar?${params.toString()}`)
  }
  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto">
      <select value={rubro} onChange={(e) => setRubro(e.target.value)}
        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
        <option value="">¿Qué servicio necesitás?</option>
        {RUBROS.map((r) => <option key={r.label} value={r.label}>{r.emoji} {r.label}</option>)}
      </select>
      <input type="text" placeholder="¿En qué ciudad o zona?" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}
        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm">
        <Search className="w-4 h-4" /> Buscar
      </button>
    </form>
  )
}

function FeatureCard({ icon: Icon, title, desc, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { data: topContractors = [] } = useQuery({
    queryKey: ['contractors', { orden: 'rating', limit: 6 }],
    queryFn: () => contractorsAPI.list({ orden: 'rating', limit: 6 }).then((r) => r.data),
  })

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <ShieldCheck className="w-4 h-4" /> Reputación verificable en cada trabajo
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Encontrá al profesional<br />que necesitás, con confianza
          </h1>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
            Plomeros, electricistas, gasistas y más — con opiniones reales de trabajos efectivamente realizados.
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* Rubros rápidos */}
      <section className="max-w-5xl mx-auto px-4 py-12 w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">¿Qué servicio necesitás?</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {RUBROS.map((r) => (
            <button key={r.label} onClick={() => navigate(`/buscar?rubro=${r.label}`)}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
              <span className="text-2xl">{r.emoji}</span>
              <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors font-medium text-center leading-tight">{r.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FeatureCard icon={Search} title="Buscá por rubro y zona"
              desc="Filtrá por el servicio que necesitás y tu ubicación para ver los profesionales disponibles."
              color="bg-blue-50 text-blue-600" />
            <FeatureCard icon={Star} title="Revisá la reputación"
              desc="Cada calificación está vinculada a un trabajo real. Sin opiniones inventadas."
              color="bg-amber-50 text-amber-600" />
            <FeatureCard icon={MessageCircle} title="Contactá directamente"
              desc="Escribile por WhatsApp o formulario al profesional que más te convenza."
              color="bg-green-50 text-green-600" />
          </div>
        </div>
      </section>

      {/* Top contratistas */}
      {topContractors.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-16 w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mejor valorados</h2>
              <p className="text-sm text-gray-500 mt-0.5">Profesionales con las mejores calificaciones</p>
            </div>
            <button onClick={() => navigate('/buscar?orden=rating')}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors">
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topContractors.map((c) => <ContractorCard key={c.id} contractor={c} />)}
          </div>
        </section>
      )}

      {/* CTA contratistas */}
      <section className="bg-indigo-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Award className="w-12 h-12 mx-auto mb-4 text-indigo-300" />
          <h2 className="text-2xl font-bold mb-3">¿Sos profesional de servicios del hogar?</h2>
          <p className="text-indigo-200 mb-8">Creá tu perfil gratis y empezá a recibir clientes que confían en tu reputación.</p>
          <button onClick={() => navigate('/registro?tipo=contratista')}
            className="inline-flex items-center gap-2 bg-white text-indigo-800 hover:bg-indigo-50 px-7 py-3 rounded-xl font-semibold transition-colors">
            Crear perfil gratis <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  )
}
