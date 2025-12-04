import publicClient from '../clients/public.client'
import createPrivateClient from '../clients/private.client'

export const reviewService = {
  // Get all reviews
  getReviews: (params) => {
    return publicClient.get('/reviews', { params })
  },

  // Get my reviews
  getMyReviews: (privateClient, params) => {
    return privateClient.get('/reviews/my-reviews', { params })
  },

  // Get review by ID
  getReviewById: (id) => {
    return publicClient.get(`/reviews/${id}`)
  },

  // Get shop reviews
  getShopReviews: (shopId, params) => {
    return publicClient.get(`/reviews/${shopId}/shop-reviews`, { params })
  },

  // Create review
  createReview: (data, privateClient) => {
    return privateClient.post('/reviews', data)
  },

  // Update review
  updateReview: (id, data, privateClient) => {
    return privateClient.put(`/reviews/${id}`, data)
  },

  // Delete review
  deleteReview: (id, privateClient) => {
    return privateClient.delete(`/reviews/${id}`)
  },
}
