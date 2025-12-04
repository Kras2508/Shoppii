import publicClient from '../clients/public.client'
import createPrivateClient from '../clients/private.client'

export const adminService = {
  // Get dashboard
  getDashboard: (privateClient) => {
    return privateClient.get('/admin/dashboard')
  },

  // Get all users
  getAllUsers: (privateClient, params) => {
    return privateClient.get('/admin/users', { params })
  },

  // Get user by ID
  getUserById: (id, privateClient) => {
    return privateClient.get(`/admin/users/${id}`)
  },

  // Toggle user status
  toggleUserStatus: (id, privateClient) => {
    return privateClient.put(`/admin/users/${id}/status`)
  },

  // Get all shops
  getAllShops: (privateClient, params) => {
    return privateClient.get('/admin/shops', { params })
  },

  // Get all orders
  getAllOrders: (privateClient, params) => {
    return privateClient.get('/admin/orders', { params })
  },

  // Update order status
  updateOrderStatus: (id, status, privateClient) => {
    return privateClient.put(`/admin/orders/${id}/status`, { status })
  },

  // Get all products
  getAllProducts: (privateClient, params) => {
    return privateClient.get('/admin/products', { params })
  },

  // Delete product
  deleteProduct: (id, privateClient) => {
    return privateClient.delete(`/admin/products/${id}`)
  },

  // Get all reviews
  getAllReviews: (privateClient, params) => {
    return privateClient.get('/admin/reviews', { params })
  },

  // Delete review
  deleteReview: (id, privateClient) => {
    return privateClient.delete(`/admin/reviews/${id}`)
  },
}
