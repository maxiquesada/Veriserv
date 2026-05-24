import axios from 'axios'

const api = axios.create({
  baseURL: '',
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('veriserv_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('veriserv_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login:    (data) => api.post('/api/auth/login', data),
  me:       ()     => api.get('/api/users/me'),
}

export const contractorsAPI = {
  list:   (params) => api.get('/api/contractors', { params }),
  get:    (id)     => api.get(`/api/contractors/${id}`),
  create: (data)   => api.post('/api/contractors', data),
  update: (id, d)  => api.put(`/api/contractors/${id}`, d),
  rubros: ()       => api.get('/api/contractors/rubros/list'),
}

export const jobsAPI = {
  byContractor: (id)   => api.get(`/api/jobs/contractor/${id}`),
  create:       (form) => api.post('/api/jobs', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:       (id)   => api.delete(`/api/jobs/${id}`),
}

export const reviewsAPI = {
  byContractor: (id)   => api.get(`/api/reviews/contractor/${id}`),
  create:       (data) => api.post('/api/reviews', data),
}

export const adminAPI = {
  stats:          ()   => api.get('/api/admin/stats'),
  users:          ()   => api.get('/api/admin/users'),
  toggleUser:     (id) => api.put(`/api/admin/users/${id}/toggle`),
  pendingReviews: ()   => api.get('/api/admin/reviews/pending'),
  approveReview:  (id) => api.put(`/api/admin/reviews/${id}/approve`),
  deleteReview:   (id) => api.delete(`/api/admin/reviews/${id}`),
}

export default api
