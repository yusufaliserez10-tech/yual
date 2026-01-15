import axios from 'axios'
import { AuthResponse, User } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { email, password, name })
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  create: async (product: any) => {
    const response = await api.post('/products', product)
    return response.data
  },

  update: async (id: string, product: any) => {
    const response = await api.put(`/products/${id}`, product)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/products/${id}`)
  },
}

// Cart API
export const cartAPI = {
  get: async () => {
    const response = await api.get('/cart')
    return response.data
  },

  addItem: async (productVariantId: string, quantity: number) => {
    const response = await api.post('/cart/items', { productVariantId, quantity })
    return response.data
  },

  updateItem: async (itemId: string, quantity: number) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity })
    return response.data
  },

  removeItem: async (itemId: string) => {
    await api.delete(`/cart/items/${itemId}`)
  },
}

// Orders API
export const ordersAPI = {
  create: async () => {
    const response = await api.post('/orders')
    return response.data
  },

  getMine: async () => {
    const response = await api.get('/orders/mine')
    return response.data
  },

  getAll: async () => {
    const response = await api.get('/orders')
    return response.data
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/orders/${id}/status`, { status })
    return response.data
  },
}
