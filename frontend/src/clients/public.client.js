import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const publicClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor for error handling
publicClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data)
      return Promise.reject(error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message)
      return Promise.reject({ message: 'Network error. Please check your connection.' })
    } else {
      // Something else happened
      console.error('Error:', error.message)
      return Promise.reject({ message: error.message })
    }
  }
)

export default publicClient



