import publicClient from '../clients/public.client'
import createPrivateClient from '../clients/private.client'

export const orderService = {
  // Get my orders
  getOrders: (privateClient, params) => {
    return privateClient.get('/orders', { params })
  },

  // Get order by ID
  getOrderById: (id, privateClient) => {
    return privateClient.get(`/orders/${id}`)
  },

  // Create order
  createOrder: (data, privateClient) => {
    return privateClient.post('/orders', data)
  },

  // Update order status
  updateOrderStatus: (id, status, privateClient) => {
    return privateClient.put(`/orders/${id}/status`, { status })
  },

  // Cancel order
  cancelOrder: (id, privateClient) => {
    return privateClient.put(`/orders/${id}/cancel`)
  },
}
