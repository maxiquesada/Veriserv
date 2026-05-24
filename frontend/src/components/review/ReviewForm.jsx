import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsAPI } from '../../services/api'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} className="focus:outline-none">
          <Star className={clsx('w-8 h-8 transition-colors',
            s <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-100')} />
        </button>
      ))}
    </div>
  )
}

export default function ReviewForm({ contractorId, jobs }) {
  const [stars, setStars] = useState(0)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const qc = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => reviewsAPI.create(data),
    onSuccess: () => {
      toast.success('Opinión enviada. Será visible tras ser aprobada.')
      reset(); setStars(0)
      qc.invalidateQueries(['reviews', contractorId])
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Error al enviar la opinión'),
  })

  const onSubmit = (data) => {
    if (!stars) return toast.error('Seleccioná una calificación')
    mutate({ ...data, estrellas: stars })
  }

  if (!jobs.length) return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
      Solo podés opinar sobre trabajos registrados por el profesional.
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trabajo a calificar</label>
        <select {...register('trabajo_id', { required: true })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Seleccioná un trabajo...</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.fecha} — {j.descripcion.slice(0, 60)}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
        <StarPicker value={stars} onChange={setStars} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
        <textarea {...register('comentario', { required: true, minLength: 10 })} rows={4}
          placeholder="Contá cómo fue tu experiencia..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        {errors.comentario && <p className="text-red-500 text-xs mt-1">Mínimo 10 caracteres</p>}
      </div>
      <button type="submit" disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-medium transition-colors">
        {isPending ? 'Enviando...' : 'Enviar opinión'}
      </button>
    </form>
  )
}
