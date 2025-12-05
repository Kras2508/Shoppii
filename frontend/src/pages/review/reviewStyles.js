// Review Page Styles
const reviewStyles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '24px 16px',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },

  header: {
    marginBottom: '24px'
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
    color: '#666',
    marginBottom: '12px'
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F241F'
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
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

  // Product info
  productInfo: {
    display: 'flex',
    gap: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #eee',
    marginBottom: '20px'
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  productDetails: {
    flex: 1
  },
  productName: {
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '4px'
  },
  productVariant: {
    fontSize: '13px',
    color: '#999',
    marginBottom: '8px'
  },
  productPrice: {
    color: '#e53935',
    fontWeight: '600',
    fontSize: '15px'
  },

  // Rating section
  ratingSection: {
    marginBottom: '24px'
  },
  ratingLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '12px'
  },
  starsContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  star: {
    fontSize: '40px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    filter: 'grayscale(100%)',
    opacity: 0.5
  },
  starActive: {
    filter: 'grayscale(0%)',
    opacity: 1,
    transform: 'scale(1.1)'
  },
  ratingText: {
    marginLeft: '12px',
    fontSize: '14px',
    color: '#666'
  },

  // Review content
  reviewSection: {
    marginBottom: '20px'
  },
  reviewLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '12px'
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '12px 14px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  textareaFocus: {
    borderColor: '#647A67'
  },
  charCount: {
    fontSize: '13px',
    color: '#999',
    marginTop: '6px',
    textAlign: 'right'
  },

  // Image upload
  imageUploadLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '12px'
  },
  uploadArea: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '12px'
  },
  uploadAreaHover: {
    borderColor: '#647A67',
    backgroundColor: '#f8fdf8'
  },
  uploadIcon: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  uploadText: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '4px'
  },
  uploadSubtext: {
    color: '#999',
    fontSize: '13px'
  },
  fileInput: {
    display: 'none'
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '12px'
  },
  imageItem: {
    position: 'relative',
    paddingBottom: '100%',
    overflow: 'hidden',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5'
  },
  imageImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  removeBtn: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '28px',
    height: '28px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // Options
  optionsSection: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee'
  },
  optionsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '12px'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  checkboxItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#647A67'
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#666',
    cursor: 'pointer'
  },

  // Anonymous option
  anonymousSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8fdf8',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  anonymousCheckbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: '#647A67'
  },
  anonymousLabel: {
    fontSize: '14px',
    color: '#666',
    flex: 1,
    cursor: 'pointer'
  },

  // Actions
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '20px',
    borderTop: '1px solid #eee'
  },
  cancelBtn: {
    padding: '12px 32px',
    backgroundColor: '#fff',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px'
  },
  submitBtn: {
    padding: '12px 32px',
    backgroundColor: '#647A67',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'background 0.2s'
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },

  // Success message
  successMessage: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #C3E6CB'
  },
  successIcon: {
    marginRight: '8px'
  }
};

export default reviewStyles;
