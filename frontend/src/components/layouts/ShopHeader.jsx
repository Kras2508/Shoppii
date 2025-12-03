import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slice/auth.slice.js';

const ShopHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock pending orders count
  const pendingOrdersCount = 5;

  const styles = {
    header: {
      backgroundColor: '#1F241F',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 1px rgba(0,0,0,.09)'
    },
    container: {
      width: '100%',
      padding: '12px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      boxSizing: 'border-box'
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: 'white',
      fontSize: '24px',
      fontWeight: '700',
      gap: '8px'
    },
    shopBadge: {
      backgroundColor: '#647A67',
      color: 'white',
      padding: '4px 10px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600'
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '14px',
      padding: '8px 12px',
      borderRadius: '6px',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    navLinkActive: {
      backgroundColor: '#647A67'
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    pendingBadge: {
      position: 'relative',
      color: 'white',
      textDecoration: 'none',
      fontSize: '14px',
      padding: '8px 12px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      backgroundColor: 'rgba(255,255,255,0.1)'
    },
    badgeCount: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      backgroundColor: '#dc3545',
      color: 'white',
      fontSize: '11px',
      fontWeight: '600',
      padding: '2px 6px',
      borderRadius: '10px',
      minWidth: '18px',
      textAlign: 'center'
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: 'white',
      cursor: 'pointer',
      padding: '6px 10px',
      borderRadius: '6px',
      transition: 'background 0.2s'
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#647A67',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      color: 'white',
      fontWeight: '600'
    },
    userName: {
      fontSize: '14px'
    }
  };

  const currentPath = window.location.pathname;

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <Link to="/shop" style={styles.logo}>
            <span>🏪</span>
            <span>ShopMart</span>
          </Link>
          <span style={styles.shopBadge}>Kênh người bán</span>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          <Link
            to="/shop"
            style={{
              ...styles.navLink,
              ...(currentPath === '/shop' ? styles.navLinkActive : {})
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => {
              if (currentPath !== '/shop') e.target.style.backgroundColor = 'transparent';
            }}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/shop/products"
            style={{
              ...styles.navLink,
              ...(currentPath.includes('/shop/products') ? styles.navLinkActive : {})
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => {
              if (!currentPath.includes('/shop/products')) e.target.style.backgroundColor = 'transparent';
            }}
          >
            📦 Sản phẩm
          </Link>
          <Link
            to="/shop/orders"
            style={{
              ...styles.navLink,
              ...(currentPath.includes('/shop/orders') ? styles.navLinkActive : {})
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => {
              if (!currentPath.includes('/shop/orders')) e.target.style.backgroundColor = 'transparent';
            }}
          >
            🛒 Đơn hàng
          </Link>
          <Link
            to="/shop/reviews"
            style={{
              ...styles.navLink,
              ...(currentPath.includes('/shop/reviews') ? styles.navLinkActive : {})
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => {
              if (!currentPath.includes('/shop/reviews')) e.target.style.backgroundColor = 'transparent';
            }}
          >
            ⭐ Đánh giá
          </Link>
          <Link
            to="/shop/reports"
            style={{
              ...styles.navLink,
              ...(currentPath.includes('/shop/reports') ? styles.navLinkActive : {})
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => {
              if (!currentPath.includes('/shop/reports')) e.target.style.backgroundColor = 'transparent';
            }}
          >
            📈 Báo cáo
          </Link>
        </nav>

        {/* Right Section */}
        <div style={styles.rightSection}>
          {/* Pending Orders */}
          <Link to="/shop/orders?status=pending" style={styles.pendingBadge}>
            ⏳ Chờ xử lý
            {pendingOrdersCount > 0 && (
              <span style={styles.badgeCount}>{pendingOrdersCount}</span>
            )}
          </Link>

          {/* User Menu */}
          {isAuthenticated && user && (
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <div
                style={styles.userSection}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={styles.avatar}>
                  {(user.full_name || user.fullName)?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={styles.userName}>{user.full_name || user.fullName}</span>
                <span style={{ fontSize: '10px' }}>▼</span>
              </div>

              {/* Dropdown */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  paddingTop: '8px'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    minWidth: '200px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #eee',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1F241F'
                    }}>
                      🏪 {user.full_name || user.fullName}
                    </div>
                    <div
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#333'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => {
                        navigate('/shop/settings');
                        setShowUserMenu(false);
                      }}
                    >
                      ⚙️ Cài đặt Shop
                    </div>
                    <div
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#d9534f',
                        borderTop: '1px solid #eee'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff0f0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => {
                        dispatch(logout());
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                    >
                      🚪 Đăng xuất
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
