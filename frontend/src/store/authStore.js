import { create } from 'zustand'
import { authAPI } from '../services/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('veriserv_token') || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const { data } = await authAPI.login({ email, password })
      localStorage.setItem('veriserv_token', data.access_token)
      const me = await authAPI.me()
      set({ token: data.access_token, user: me.data, loading: false })
      return { success: true, tipo: data.tipo }
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  register: async (email, password, tipo) => {
    set({ loading: true })
    try {
      const { data } = await authAPI.register({ email, password, tipo })
      localStorage.setItem('veriserv_token', data.access_token)
      const me = await authAPI.me()
      set({ token: data.access_token, user: me.data, loading: false })
      return { success: true, tipo: data.tipo }
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('veriserv_token')
    set({ user: null, token: null })
  },

  loadUser: async () => {
    if (!get().token) return
    try {
      const { data } = await authAPI.me()
      set({ user: data })
    } catch {
      get().logout()
    }
  },

  isAuthenticated: () => !!get().token,
  isAdmin:         () => get().user?.tipo === 'admin',
  isContractor:    () => get().user?.tipo === 'contratista',
}))
