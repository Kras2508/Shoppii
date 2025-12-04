import publicClient from '../clients/public.client'
import createPrivateClient from '../clients/private.client'

export const voucherService = {
  // Get all vouchers
  getVouchers: (params) => {
    return publicClient.get('/vouchers', { params })
  },

  // Get voucher by ID
  getVoucherById: (id) => {
    return publicClient.get(`/vouchers/${id}`)
  },

  // Apply voucher
  applyVoucher: (voucherId, privateClient) => {
    return privateClient.post('/vouchers/apply', { voucherId })
  },

  // Create voucher (Admin only)
  createVoucher: (data, privateClient) => {
    return privateClient.post('/vouchers', data)
  },

  // Update voucher (Admin only)
  updateVoucher: (id, data, privateClient) => {
    return privateClient.put(`/vouchers/${id}`, data)
  },

  // Delete voucher (Admin only)
  deleteVoucher: (id, privateClient) => {
    return privateClient.delete(`/vouchers/${id}`)
  },
}
