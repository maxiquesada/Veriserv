import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { contractorsAPI } from '../services/api'
import ContractorCard from '../components/contractor/ContractorCard'
import SearchFilters from '../components/search/SearchFilters'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    rubro: searchParams.get('rubro') || '',
    ubicacion: searchParams.get('ubicacion') || '',
    orden: searchParams.get('orden') || 'rating',
    page: 1,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['contractors', filters],
    queryFn: () => contractorsAPI.list(filters).then((r) => r.data),
  })

  const applyFilters = (newFilters) => {
    const merged = { ...filters, ...newFilters, page: 1 }
    setFilters(merged)
    setSearchParams(merged)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Encontrá tu profesional</h1>
      <SearchFilters filters={filters} onFilter={applyFilters} />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : data?.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No encontramos profesionales con esos filtros.</p>
          <button onClick={() => applyFilters({ rubro: '', ubicacion: '', orden: 'rating' })}
            className="mt-4 text-blue-600 hover:underline text-sm">Limpiar filtros</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {data?.map((c) => <ContractorCard key={c.id} contractor={c} />)}
        </div>
      )}
    </div>
  )
}
