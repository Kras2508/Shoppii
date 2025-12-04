import publicClient from '../clients/public.client'
import createPrivateClient from '../clients/private.client'

export const shippingService = {
  // Get all shipping methods
  getShippingMethods: (params) => {
    return publicClient.get('/shipping', { params })
  },

  // Get shipping method by ID
  getShippingById: (id) => {
    return publicClient.get(`/shipping/${id}`)
  },

  // Create shipping (Admin only)
  createShipping: (data, privateClient) => {
    return privateClient.post('/shipping', data)
  },

  // Update shipping (Admin only)
  updateShipping: (id, data, privateClient) => {
    return privateClient.put(`/shipping/${id}`, data)
  },

  // Delete shipping (Admin only)
  deleteShipping: (id, privateClient) => {
    return privateClient.delete(`/shipping/${id}`)
  },
}
