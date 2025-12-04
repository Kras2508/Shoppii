import createPrivateClient from '../clients/private.client'

export const cartService = {
  // Get cart
  getCart: (privateClient) => {
    return privateClient.get('/cart')
  },

  // Add to cart
  addToCart: (itemId, quantity, privateClient) => {
    return privateClient.post('/cart/add', { item_id: itemId, quantity })
  },

  // Update cart item
  updateCartItem: (itemId, quantity, privateClient) => {
    return privateClient.put(`/cart/items/${itemId}`, { quantity })
  },

  // Remove from cart
  removeFromCart: (itemId, privateClient) => {
    return privateClient.delete(`/cart/items/${itemId}`)
  },

  // Clear cart
  clearCart: (privateClient) => {
    return privateClient.delete('/cart/clear')
  },
}
