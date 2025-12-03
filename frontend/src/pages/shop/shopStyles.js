const shopStyles = {
  // Layout
  page: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  
  // Header
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1F241F',
    margin: 0
  },
  
  // Cards
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #eee'
  },
  
  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#647A67',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#758173'
  },
  
  // Buttons
  primaryBtn: {
    backgroundColor: '#647A67',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  secondaryBtn: {
    backgroundColor: 'white',
    color: '#647A67',
    border: '1px solid #647A67',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  dangerBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  iconBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s'
  },
  
  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: '#f9f9f9',
    borderBottom: '2px solid #eee'
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase'
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '14px',
    color: '#333'
  },
  
  // Product Row
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  productImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #eee'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '4px'
  },
  productCategory: {
    fontSize: '12px',
    color: '#999'
  },
  
  // Status Badge
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },
  statusActive: {
    backgroundColor: '#d4edda',
    color: '#155724'
  },
  statusInactive: {
    backgroundColor: '#f8d7da',
    color: '#721c24'
  },
  statusOutOfStock: {
    backgroundColor: '#fff3cd',
    color: '#856404'
  },
  
  // Actions
  actions: {
    display: 'flex',
    gap: '8px'
  },
  
  // Form Styles
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px'
  },
  formSection: {
    marginBottom: '20px'
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '8px'
  },
  formInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  formTextarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    minHeight: '120px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  formSelect: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'white',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  formHelper: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px'
  },
  formError: {
    fontSize: '12px',
    color: '#dc3545',
    marginTop: '4px'
  },
  
  // Image Upload
  imageUpload: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  imageUploadHover: {
    borderColor: '#647A67',
    backgroundColor: '#f0fff0'
  },
  imagePreviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginTop: '12px'
  },
  imagePreview: {
    position: 'relative',
    paddingTop: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #eee'
  },
  imagePreviewImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  // Variants
  variantSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '16px'
  },
  variantRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    alignItems: 'center'
  },
  variantInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px'
  },
  addVariantBtn: {
    backgroundColor: '#C5EFCB',
    color: '#647A67',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  
  // Sidebar
  sidebar: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px'
  },
  sidebarSection: {
    marginBottom: '20px'
  },
  sidebarTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px'
  },
  
  // Filters
  filterRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px'
  },
  filterSelect: {
    padding: '10px 16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
    minWidth: '150px'
  },
  
  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px'
  },
  
  // Pagination
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '24px'
  },
  pageBtn: {
    padding: '8px 14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  },
  pageBtnActive: {
    backgroundColor: '#647A67',
    color: 'white',
    borderColor: '#647A67'
  },
  
  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px'
  }
};

export default shopStyles;
