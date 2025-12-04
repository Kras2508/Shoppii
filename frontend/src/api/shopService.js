import publicClient from '../clients/public.client'
import createPrivateClient from '../clients/private.client'

export const shopService = {
  // Get all shops
  getShops: (params) => {
    return publicClient.get('/shops', { params })
  },

  // Get shop by ID
  getShopById: (id) => {
    return publicClient.get(`/shops/${id}`)
  },

  // Get shop dashboard (Shop only)
  getShopDashboard: (privateClient) => {
    return privateClient.get('/shops/my/dashboard')
  },

  // Get shop revenue report (Shop only)
  getShopRevenueReport: (privateClient, params) => {
    return privateClient.get('/shops/my/revenue-report', { params })
  },

  // Update shop profile (Shop only)
  updateShopProfile: (data, privateClient) => {
    return privateClient.put('/shops/my/profile', data)
  },
}
