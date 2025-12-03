// Profile Page Styles
const profileStyles = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },

  // Profile Header
  profileHeader: {
    display: 'flex',
    gap: '24px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #C5EFCB'
  },
  changeAvatarBtn: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #647A67',
    borderRadius: '6px',
    color: '#647A67',
    cursor: 'pointer',
    fontSize: '14px'
  },
  profileInfo: {
    flex: 1
  },
  userName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F241F',
    marginBottom: '8px'
  },
  userMeta: {
    display: 'flex',
    gap: '24px',
    marginBottom: '16px',
    color: '#666',
    fontSize: '14px'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  memberSince: {
    color: '#999',
    fontSize: '13px'
  },
  editProfileBtn: {
    padding: '10px 24px',
    backgroundColor: '#647A67',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  // Stats Cards
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
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
    color: '#666'
  },

  // Tabs
  tabsContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    overflow: 'hidden'
  },
  tabsHeader: {
    display: 'flex',
    borderBottom: '1px solid #eee'
  },
  tab: {
    flex: 1,
    padding: '16px 24px',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '3px solid transparent',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.2s'
  },
  tabActive: {
    color: '#647A67',
    borderBottom: '3px solid #647A67',
    backgroundColor: '#f8fdf8'
  },
  tabContent: {
    padding: '24px'
  },

  // Orders Tab
  orderFilters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#666'
  },
  filterBtnActive: {
    backgroundColor: '#647A67',
    color: '#fff',
    borderColor: '#647A67'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  orderCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #eee'
  },
  orderShop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    color: '#1F241F'
  },
  orderStatus: {
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500'
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
  orderItems: {
    padding: '16px'
  },
  orderItem: {
    display: 'flex',
    gap: '12px',
    paddingBottom: '12px',
    marginBottom: '12px',
    borderBottom: '1px solid #f0f0f0'
  },
  orderItemLast: {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0
  },
  orderItemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  orderItemInfo: {
    flex: 1
  },
  orderItemName: {
    fontWeight: '500',
    color: '#1F241F',
    marginBottom: '4px'
  },
  orderItemVariant: {
    fontSize: '13px',
    color: '#999',
    marginBottom: '4px'
  },
  orderItemPrice: {
    color: '#e53935',
    fontWeight: '600'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#fafafa',
    borderTop: '1px solid #eee'
  },
  orderDate: {
    fontSize: '13px',
    color: '#999'
  },
  orderTotal: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  orderTotalLabel: {
    color: '#666',
    fontSize: '14px'
  },
  orderTotalValue: {
    color: '#e53935',
    fontSize: '18px',
    fontWeight: '700'
  },
  orderActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px'
  },
  orderActionBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  viewOrderBtn: {
    backgroundColor: '#647A67',
    color: '#fff',
    border: 'none'
  },
  reviewBtn: {
    backgroundColor: '#fff',
    color: '#647A67',
    border: '1px solid #647A67'
  },
  reorderBtn: {
    backgroundColor: '#fff',
    color: '#666',
    border: '1px solid #ddd'
  },

  // Edit Profile Form
  formSection: {
    marginBottom: '24px'
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid #eee'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  formGroupFull: {
    gridColumn: '1 / -1'
  },
  formLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  formInput: {
    padding: '12px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  formTextarea: {
    padding: '12px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    minHeight: '100px',
    resize: 'vertical'
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px'
  },
  saveBtn: {
    padding: '12px 32px',
    backgroundColor: '#647A67',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px'
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

  // Statistics Tab
  statsSection: {
    marginBottom: '32px'
  },
  statsSectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '16px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px'
  },
  statsDetailCard: {
    backgroundColor: '#f8fdf8',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e8f5e9'
  },
  statsDetailLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  statsDetailValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#647A67'
  },
  statsDetailSubtext: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px'
  },

  // Chart placeholder
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #eee',
    marginBottom: '24px'
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F241F',
    marginBottom: '16px'
  },
  chartPlaceholder: {
    height: '200px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999'
  },

  // Spending breakdown
  spendingBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  spendingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  spendingBar: {
    flex: 1,
    height: '24px',
    backgroundColor: '#eee',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  spendingFill: {
    height: '100%',
    backgroundColor: '#647A67',
    borderRadius: '4px',
    transition: 'width 0.3s'
  },
  spendingLabel: {
    width: '120px',
    fontSize: '14px',
    color: '#666'
  },
  spendingValue: {
    width: '100px',
    textAlign: 'right',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F241F'
  },

  // Empty state
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#999'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyText: {
    fontSize: '16px',
    marginBottom: '16px'
  },
  emptyAction: {
    padding: '12px 24px',
    backgroundColor: '#647A67',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },

  // Responsive
  '@media (max-width: 768px)': {
    statsContainer: {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    formGrid: {
      gridTemplateColumns: '1fr'
    }
  }
};

export default profileStyles;
