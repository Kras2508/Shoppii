import publicClient from '../clients/public.client'
import createPrivateClient from '../clients/private.client'

export const productService = {
  // Get all products
  getProducts: (params) => {
    return publicClient.get('/products', { params })
  },

  // Get product by ID
  getProductById: (id) => {
    return publicClient.get(`/products/${id}`)
  },

  // Get shop products
  getShopProducts: (shopId, params) => {
    return publicClient.get('/products', { params: { shop_id: shopId, ...params } })
  },

  // Get my shop products (Shop only)
  getMyShopProducts: (privateClient, params) => {
    return privateClient.get('/products/shop/my-products', { params })
  },

  // Create product (Shop only)
  createProduct: (data, privateClient) => {
    return privateClient.post('/products', data)
  },

  // Update product (Shop only)
  updateProduct: (id, data, privateClient) => {
    return privateClient.put(`/products/${id}`, data)
  },

  // Delete product (Shop only)
  deleteProduct: (id, privateClient) => {
    return privateClient.delete(`/products/${id}`)
  },

  // Create variant
  createVariant: (productId, data, privateClient) => {
    return privateClient.post(`/products/${productId}/variants`, data)
  },

  // Update variant
  updateVariant: (productId, variantId, data, privateClient) => {
    return privateClient.put(`/products/${productId}/variants/${variantId}`, data)
  },

  // Delete variant
  deleteVariant: (productId, variantId, privateClient) => {
    return privateClient.delete(`/products/${productId}/variants/${variantId}`)
  },
}
