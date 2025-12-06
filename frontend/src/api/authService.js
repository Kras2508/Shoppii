import publicClient from '../clients/public.client'
import createPrivateClient from '../clients/private.client'

export const authService = {
  // Register
  register: (data) => {
    return publicClient.post('/auth/register', data)
  },

  // Login
  login: (email, password, role) => {
    return publicClient.post('/auth/login', { email, password, role })
  },

  // Get Profile
  getProfile: (privateClient) => {
    return privateClient.get('/auth/profile')
  },

  // Update Profile
  updateProfile: (data, privateClient) => {
    return privateClient.put('/auth/profile', data)
  },

  // Change Password
  changePassword: (data, privateClient) => {
    return privateClient.put('/auth/change-password', data)
  },
}
