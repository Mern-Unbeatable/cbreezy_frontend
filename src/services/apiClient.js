

import axios from 'axios'
import { STORAGE_KEYS } from '../utils/constants'
import { clearAuthSession } from '../utils/authSession'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/'


const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

const isAuthSessionError = (status, data) => {
  if (status !== 401) return false

  const message = String(data?.error || data?.message || '').toLowerCase()

  if (message.includes('invalid_client') || message.includes('paypal')) {
    return false
  }

  return (
    data?.success === false ||
    message.includes('token') ||
    message.includes('login') ||
    message.includes('no token')
  )
}

/**
 * Request Interceptor
 * 
 * Intercepts all outgoing requests to add:
 * - Authentication tokens
 * - Custom headers
 * - Request logging (in development)
 */
apiClient.interceptors.request.use(
  (config) => {
    // Let browser set multipart boundaries automatically for FormData payloads.
    if (typeof FormData !== 'undefined' && config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type']
    }

    // Get auth token from localStorage (if exists)
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    
    // Add token to headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', config.method?.toUpperCase(), config.url)
    }

    return config
  },
  (error) => {
    // Handle request error
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * 
 * Intercepts all incoming responses to handle:
 * - Success responses
 * - Error responses
 * - Token expiration
 * - Network errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('API Response:', response.status, response.config.url)
    }

    // Return response data directly
    return response
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      switch (status) {
        case 401:
          if (isAuthSessionError(status, data)) {
            console.error('Unauthorized access - logging out')
            clearAuthSession({ redirectToLogin: true })
          } else {
            console.error('Payment or external service error:', data?.error || data?.message || status)
          }
          break
        
        case 403:
          // Forbidden
          console.error('Access forbidden')
          break
        
        case 404:
          // Not found
          console.error('Resource not found')
          break
        
        case 500:
          // Server error
          console.error('Server error:', data?.message || data?.error || 'Internal server error')
          break
        
        default:
          console.error('API Error:', status, data)
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response received')
    } else {
      // Error in request configuration
      console.error('Request configuration error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
