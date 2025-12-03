    import axios from 'axios'
    import { logout } from '../redux/slice/auth.slice'
    
    export default function createPrivateClient(dispatch) {
      const client = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
        timeout: 10000,
      })
    
      // Request interceptor: Add JWT token
      client.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('tss_token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log('🔑 Token attached to request:', config.url, '| Token:', token.substring(0, 20) + '...')
          } else {
            console.warn('⚠️ No token found in localStorage for request:', config.url)
          }
          return config
        },
        (error) => Promise.reject(error)
      )
    
      // Response interceptor: Handle 401 (token expired)
      client.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            // Token expired or invalid
            dispatch(logout())
            // Optional: redirect to login
            // window.location.href = '/login'
          }
          return Promise.reject(error)
        }
      )
    
      return client
    }