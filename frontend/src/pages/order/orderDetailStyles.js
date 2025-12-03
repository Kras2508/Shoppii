// Order Detail Page Styles
const orderDetailStyles = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#666'
  },
  orderIdBadge: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F241F'
  },
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  statusProcessing: {
    backgroundColor: '#FFF3CD',
    color: '#856404'
  },
  statusShipped: {
    backgroundColor: '#CCE5FF',
    color: '#004085'
  },
  statusDelivered: {
    backgroundColor: '#D4EDDA',
    color: '#155724'
  },
  statusCancelled: {
    backgroundColor: '#F8D7DA',
    color: '#721C24'
  },

  // Main Grid
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '24px'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  // Timeline
  timeline: {
    position: 'relative',
    paddingLeft: '32px'
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: '24px',
    paddingLeft: '24px',
    borderLeft: '2px solid #e0e0e0'
  },
  timelineItemActive: {
    borderLeftColor: '#647A67'
  },
  timelineItemLast: {
    borderLeft: 'none',
    paddingBottom: 0
  },
  timelineDot: {
    position: 'absolute',
    left: '-9px',
    top: '0',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#e0e0e0',
    border: '3px solid #fff',
    boxShadow: '0 0 0 2px #e0e0e0'
  },
  timelineDotActive: {
    backgroundColor: '#647A67',
    boxShadow: '0 0 0 2px #647A67'
  },
  timelineDotCurrent: {
    backgroundColor: '#647A67',
    boxShadow: '0 0 0 4px rgba(100, 122, 103, 0.3)'
  },
  timelineContent: {
    marginLeft: '8px'
  },
  timelineTitle: {
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '4px'
  },
  timelineTime: {
    fontSize: '13px',
    color: '#999'
  },
  timelineDesc: {
    fontSize: '13px',
    color: '#666',
    marginTop: '4px'
  },

  // Products
  productItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  productItemLast: {
    borderBottom: 'none'
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '4px',
    textDecoration: 'none'
  },
  productVariant: {
    fontSize: '13px',
    color: '#999',
    marginBottom: '8px'
  },
  productPriceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  productOriginalPrice: {
    textDecoration: 'line-through',
    color: '#999',
    fontSize: '14px'
  },
  productPrice: {
    color: '#e53935',
    fontWeight: '600',
    fontSize: '15px'
  },
  productQuantity: {
    color: '#666',
    fontSize: '14px'
  },
  productTotal: {
    textAlign: 'right',
    fontWeight: '600',
    color: '#1F241F',
    fontSize: '15px'
  },

  // Shop header
  shopHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '12px',
    borderBottom: '1px solid #eee',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#1F241F'
  },

  // Info rows
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f5f5f5'
  },
  infoRowLast: {
    borderBottom: 'none'
  },
  infoLabel: {
    color: '#666',
    fontSize: '14px'
  },
  infoValue: {
    fontWeight: '500',
    color: '#1F241F',
    fontSize: '14px',
    textAlign: 'right',
    maxWidth: '60%'
  },

  // Summary
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0'
  },
  summaryLabel: {
    color: '#666',
    fontSize: '14px'
  },
  summaryValue: {
    fontWeight: '500',
    color: '#1F241F',
    fontSize: '14px'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 0 0',
    marginTop: '8px',
    borderTop: '1px solid #eee'
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F241F'
  },
  totalValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#e53935'
  },

  // Actions
  actionButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px'
  },
  primaryBtn: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#647A67',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  secondaryBtn: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#fff',
    color: '#647A67',
    border: '1px solid #647A67',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  dangerBtn: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#fff',
    color: '#dc3545',
    border: '1px solid #dc3545',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },

  // Help card
  helpCard: {
    backgroundColor: '#f8fdf8',
    border: '1px solid #C5EFCB',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center'
  },
  helpTitle: {
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '8px'
  },
  helpText: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '12px'
  },
  helpBtn: {
    padding: '10px 20px',
    backgroundColor: '#647A67',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px'
  },

  // Not found
  notFound: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  notFoundIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  notFoundText: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '20px'
  }
};

export default orderDetailStyles;
