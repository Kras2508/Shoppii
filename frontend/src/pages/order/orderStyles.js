const orderStyles = {
  page: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    paddingBottom: '40px'
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px'
  },
  
  // Success Section
  successSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
    marginBottom: '20px'
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#647A67',
    color: 'white',
    fontSize: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px'
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '12px'
  },
  successMessage: {
    fontSize: '15px',
    color: '#758173',
    marginBottom: '24px'
  },
  orderIdBox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f5f5f5',
    padding: '12px 24px',
    borderRadius: '8px'
  },
  orderIdLabel: {
    fontSize: '14px',
    color: '#758173'
  },
  orderIdValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#647A67'
  },
  
  // Timeline Section
  timelineSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '20px'
  },
  timelineTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '24px'
  },
  timeline: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    padding: '0 20px'
  },
  timelineStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    position: 'relative'
  },
  timelineConnector: {
    position: 'absolute',
    top: '25px',
    left: '-50%',
    right: '50%',
    height: '3px',
    zIndex: 0
  },
  timelineCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '3px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    zIndex: 1,
    transition: 'all 0.3s ease'
  },
  timelineContent: {
    marginTop: '12px',
    textAlign: 'center'
  },
  timelineLabel: {
    fontSize: '14px',
    marginBottom: '4px'
  },
  timelineDesc: {
    fontSize: '12px'
  },
  currentBadge: {
    marginTop: '8px',
    padding: '4px 12px',
    backgroundColor: '#C5EFCB',
    color: '#647A67',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600'
  },
  
  // Cancelled
  cancelledBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#fff0f0',
    borderRadius: '8px',
    border: '1px solid #ffcccc'
  },
  cancelledIcon: {
    fontSize: '40px'
  },
  cancelledTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#d9534f',
    marginBottom: '4px'
  },
  cancelledDate: {
    fontSize: '13px',
    color: '#999'
  },
  
  // Info Section
  infoSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '20px'
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '20px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  infoCard: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#fafafa',
    borderRadius: '8px'
  },
  infoCardIcon: {
    fontSize: '24px'
  },
  infoCardContent: {
    flex: 1
  },
  infoCardLabel: {
    fontSize: '12px',
    color: '#758173',
    marginBottom: '4px'
  },
  infoCardValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1F241F'
  },
  infoCardSub: {
    fontSize: '12px',
    color: '#647A67',
    marginTop: '4px'
  },
  
  // Items Section
  itemsSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '20px'
  },
  itemsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '20px'
  },
  shopGroup: {
    marginBottom: '16px',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  shopHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#fafafa',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F241F'
  },
  productItem: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    borderBottom: '1px solid #f5f5f5',
    alignItems: 'center'
  },
  productImage: {
    width: '70px',
    height: '70px',
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
    textDecoration: 'none',
    marginBottom: '4px',
    display: 'block'
  },
  productVariant: {
    fontSize: '12px',
    color: '#758173',
    marginBottom: '6px'
  },
  productPriceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  productPrice: {
    fontSize: '14px',
    color: '#647A67',
    fontWeight: '500'
  },
  productQuantity: {
    fontSize: '13px',
    color: '#999'
  },
  productTotal: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1F241F'
  },
  
  // Order Summary
  orderSummary: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #f0f0f0'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: '#758173'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 0 0',
    borderTop: '1px solid #f0f0f0',
    marginTop: '8px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F241F'
  },
  totalAmount: {
    color: '#647A67',
    fontSize: '20px'
  },
  
  // Actions
  actionsSection: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  primaryBtn: {
    padding: '14px 32px',
    backgroundColor: '#647A67',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background 0.2s'
  },
  secondaryBtn: {
    padding: '14px 32px',
    backgroundColor: 'white',
    color: '#647A67',
    border: '1px solid #647A67',
    borderRadius: '4px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s'
  }
};

export default orderStyles;
