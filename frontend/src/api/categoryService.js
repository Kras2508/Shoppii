import publicClient from '../clients/public.client'
import createPrivateClient from '../clients/private.client'

export const categoryService = {
  // Get all categories
  getCategories: (params) => {
    return publicClient.get('/categories', { params })
  },

  // Get category by ID
  getCategoryById: (id) => {
    return publicClient.get(`/categories/${id}`)
  },

  // Create category (Admin only)
  createCategory: (data, privateClient) => {
    return privateClient.post('/categories', data)
  },

  // Update category (Admin only)
  updateCategory: (id, data, privateClient) => {
    return privateClient.put(`/categories/${id}`, data)
  },

  // Delete category (Admin only)
  deleteCategory: (id, privateClient) => {
    return privateClient.delete(`/categories/${id}`)
  },
}
