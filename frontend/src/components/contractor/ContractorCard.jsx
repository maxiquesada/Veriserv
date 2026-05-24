import { Link } from 'react-router-dom'
import { Star, MapPin, Wrench, MessageCircle } from 'lucide-react'
import clsx from 'clsx'

export function StarRating({ rating, size = 'sm' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={clsx(
          size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5',
          s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'
        )} />
      ))}
    </div>
  )
}

export default function ContractorCard({ contractor: c }) {
  return (
    <Link to={`/contratista/${c.id}`} className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500" />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-lg flex-shrink-0">
            {c.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">{c.nombre}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Wrench className="w-3.5 h-3.5" /><span>{c.rubro}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{c.ubicacion}</span>
        </div>
        {c.descripcion && <p className="text-sm text-gray-600 line-clamp-2 mb-4">{c.descripcion}</p>}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <StarRating rating={c.rating_promedio} />
            <span className="text-sm font-medium text-gray-700">{c.rating_promedio.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({c.total_reviews})</span>
          </div>
          {c.whatsapp && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <MessageCircle className="w-3.5 h-3.5" /><span>WhatsApp</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
