const cartStyles = {
  page: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    paddingBottom: '100px'
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
  // Cart Header
  cartHeader: {
    display: 'grid',
    gridTemplateColumns: '50px 1fr 150px 150px 150px 100px',
    gap: '16px',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '16px 20px',
    borderRadius: '8px 8px 0 0',
    marginBottom: '2px',
    fontSize: '14px',
    color: '#758173'
  },
  // Shop Group
  shopGroup: {
    backgroundColor: 'white',
    marginBottom: '16px',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  shopHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa'
  },
  shopName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1F241F',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  // Cart Item
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '50px 1fr 150px 150px 150px 100px',
    gap: '16px',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #f0f0f0'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#647A67'
  },
  productInfo: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid #e0e0e0'
  },
  productDetails: {
    flex: 1
  },
  productName: {
    fontSize: '14px',
    color: '#1F241F',
    marginBottom: '8px',
    lineHeight: '1.4',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  productVariant: {
    fontSize: '12px',
    color: '#758173',
    backgroundColor: '#f5f5f5',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  },
  priceSection: {
    textAlign: 'center'
  },
  currentPrice: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#647A67'
  },
  oldPrice: {
    fontSize: '12px',
    color: '#999',
    textDecoration: 'line-through'
  },
  // Quantity Control
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    width: 'fit-content',
    margin: '0 auto'
  },
  quantityBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s'
  },
  quantityInput: {
    width: '50px',
    height: '32px',
    border: 'none',
    borderLeft: '1px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
    textAlign: 'center',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  totalPrice: {
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: '600',
    color: '#647A67'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '8px',
    transition: 'color 0.2s',
    textAlign: 'center'
  },
  // Empty Cart
  emptyCart: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '8px'
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  emptyText: {
    fontSize: '16px',
    color: '#758173',
    marginBottom: '20px'
  },
  shopNowBtn: {
    padding: '12px 40px',
    backgroundColor: '#647A67',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background 0.2s'
  },
  // Footer Checkout
  checkoutFooter: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 100
  },
  checkoutContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  checkoutLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  selectAllLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#1F241F',
    cursor: 'pointer'
  },
  deleteSelected: {
    color: '#999',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px 16px'
  },
  checkoutRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  checkoutInfo: {
    textAlign: 'right'
  },
  checkoutTotal: {
    fontSize: '14px',
    color: '#758173',
    marginBottom: '4px'
  },
  checkoutPrice: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#647A67'
  },
  checkoutSavings: {
    fontSize: '12px',
    color: '#647A67'
  },
  checkoutBtn: {
    padding: '14px 60px',
    backgroundColor: '#647A67',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
};

export default cartStyles;
