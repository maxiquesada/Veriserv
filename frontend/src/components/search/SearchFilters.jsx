import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { contractorsAPI } from '../../services/api'
import { SlidersHorizontal } from 'lucide-react'

const RUBROS_DEFAULT = [
  'Plomero', 'Electricista', 'Gasista', 'Pintor',
  'Carpintero', 'Albañil', 'Cerrajero', 'Jardinero',
]

export default function SearchFilters({ filters, onFilter }) {
  const [local, setLocal] = useState({ ...filters })

  const { data: rubrosAPI = [] } = useQuery({
    queryKey: ['rubros'],
    queryFn: () => contractorsAPI.rubros().then((r) => r.data),
  })

  const rubros = rubrosAPI.length ? rubrosAPI : RUBROS_DEFAULT

  const apply = () => onFilter(local)

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-600">
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={local.rubro}
          onChange={(e) => setLocal({ ...local, rubro: e.target.value })}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los rubros</option>
          {rubros.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        <input
          type="text"
          placeholder="Ciudad o zona..."
          value={local.ubicacion}
          onChange={(e) => setLocal({ ...local, ubicacion: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={local.orden}
          onChange={(e) => setLocal({ ...local, orden: e.target.value })}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="rating">Mejor valorados</option>
          <option value="reciente">Más recientes</option>
        </select>

        <button
          onClick={apply}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          Aplicar
        </button>
      </div>
    </div>
  )
}
