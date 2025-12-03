const checkoutStyles = {
  page: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    paddingBottom: '40px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '20px'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  // Address Section
  addressInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    outline: 'none'
  },
  userInfo: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px',
    fontSize: '14px'
  },
  // Products Section
  shopGroup: {
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f0f0f0'
  },
  shopName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  productItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #f5f5f5'
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid #e0e0e0'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: '14px',
    color: '#1F241F',
    marginBottom: '6px'
  },
  productVariant: {
    fontSize: '12px',
    color: '#758173',
    marginBottom: '6px'
  },
  productPrice: {
    fontSize: '14px',
    color: '#647A67',
    fontWeight: '600'
  },
  productQuantity: {
    fontSize: '14px',
    color: '#758173'
  },
  // Shipping Section
  shippingOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  shippingOptionActive: {
    border: '1px solid #647A67',
    backgroundColor: '#f9fff9'
  },
  radio: {
    marginRight: '12px',
    accentColor: '#647A67'
  },
  shippingInfo: {
    flex: 1
  },
  shippingName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1F241F'
  },
  shippingDays: {
    fontSize: '12px',
    color: '#758173'
  },
  shippingFee: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#647A67'
  },
  // Voucher Section
  voucherRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  voucherInput: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
    outline: 'none'
  },
  voucherBtn: {
    padding: '10px 20px',
    backgroundColor: '#647A67',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  voucherApplied: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#647A67'
  },
  removeVoucher: {
    background: 'none',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '16px'
  },
  // Payment Section
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  paymentOptionActive: {
    border: '1px solid #647A67',
    backgroundColor: '#f9fff9'
  },
  paymentIcon: {
    fontSize: '24px',
    marginRight: '12px'
  },
  paymentName: {
    fontSize: '14px',
    color: '#1F241F'
  },
  // Summary Section
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px'
  },
  summaryLabel: {
    color: '#758173'
  },
  summaryValue: {
    color: '#1F241F'
  },
  summaryDiscount: {
    color: '#647A67'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderTop: '1px solid #e0e0e0',
    marginTop: '8px'
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#1F241F'
  },
  totalValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#647A67'
  },
  // Place Order Button
  placeOrderBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#647A67',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    marginTop: '16px'
  },
  // Note
  noteTextarea: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '80px',
    boxSizing: 'border-box',
    outline: 'none'
  }
};

export default checkoutStyles;
