const adminStyles = {
  // Layout
  page: {
    backgroundColor: '#f0f2f5',
    minHeight: '100vh'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px'
  },
  
  // Header
  header: {
    backgroundColor: '#1a1a2e',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  headerContainer: {
    width: '100%',
    padding: '12px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: 'white',
    fontSize: '22px',
    fontWeight: '700'
  },
  adminBadge: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  navLink: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '10px 16px',
    borderRadius: '6px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  navLinkActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white'
  },

  // Page Title
  pageTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
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
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  statIcon: {
    fontSize: '32px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666'
  },

  // Section
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #eee'
  },

  // Filter Row
  filterRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    minWidth: '250px',
    padding: '10px 16px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none'
  },
  filterSelect: {
    padding: '10px 16px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    minWidth: '150px'
  },

  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '14px 12px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #eee'
  },
  td: {
    padding: '14px 12px',
    fontSize: '14px',
    borderBottom: '1px solid #f0f0f0',
    color: '#333'
  },

  // Status Badge
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'white'
  },
  statusActive: {
    backgroundColor: '#27ae60'
  },
  statusBanned: {
    backgroundColor: '#e74c3c'
  },
  statusPending: {
    backgroundColor: '#f39c12'
  },

  // Role Badge
  roleBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  roleCustomer: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2'
  },
  roleShop: {
    backgroundColor: '#e8f5e9',
    color: '#388e3c'
  },
  roleAdmin: {
    backgroundColor: '#fce4ec',
    color: '#c2185b'
  },

  // Action Buttons
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  },
  actionBtn: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  actionBtnSmall: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  btnDanger: {
    backgroundColor: '#e74c3c',
    color: 'white'
  },
  btnSuccess: {
    backgroundColor: '#27ae60',
    color: 'white'
  },
  btnWarning: {
    backgroundColor: '#f39c12',
    color: 'white'
  },
  btnPrimary: {
    backgroundColor: '#3498db',
    color: 'white'
  },

  // Activity List
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  activityType: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    minWidth: '80px',
    textAlign: 'center'
  },
  activityDesc: {
    flex: 1,
    fontSize: '14px',
    color: '#333'
  },
  activityTime: {
    fontSize: '12px',
    color: '#999'
  },

  // User Section
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'white',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '6px'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#e74c3c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600'
  },

  // Modal
  modal: {
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
    width: '500px',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  modalHeader: {
    padding: '20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600'
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999'
  },
  modalBody: {
    padding: '20px'
  },
  modalFooter: {
    padding: '16px 20px',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  }
};

export default adminStyles;
