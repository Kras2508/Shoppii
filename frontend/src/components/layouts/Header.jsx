import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slice/auth.slice.js';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const styles = {
    // Top Bar (Notifications & Links)
    topBar: {
      background: '#647A67',
      color: 'white',
      fontSize: '13px',
      padding: '8px 0'
    },
    topBarContainer: {
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    topBarLeft: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center'
    },
    topBarRight: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center'
    },
    topBarLink: {
      color: 'white',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      transition: 'opacity 0.2s'
    },
    // Main Header
    header: {
      backgroundColor: '#C5EFCB',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 1px rgba(0,0,0,.09)'
    },
    container: {
      padding: '15px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: '#1F241F',
      fontSize: '28px',
      fontWeight: '700',
      letterSpacing: '-0.5px',
      flexShrink: 0
    },
    logoText: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    searchSection: {
      flex: 1,
      maxWidth: '800px',
      margin: '0 auto'
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: '2px',
      overflow: 'hidden',
      height: '40px'
    },
    searchInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      padding: '0 15px',
      fontSize: '14px',
      fontFamily: 'inherit'
    },
    searchButton: {
      backgroundColor: '#647A67',
      border: 'none',
      color: 'white',
      padding: '0 30px',
      height: '40px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background 0.2s'
    },
    searchButtonHover: {
      backgroundColor: '#3C433B'
    },
    cartSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      flexShrink: 0
    },
    cartIcon: {
      position: 'relative',
      color: '#1F241F',
      fontSize: '26px',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    },
    cartBadge: {
      position: 'absolute',
      top: '-5px',
      right: '-10px',
      backgroundColor: '#647A67',
      color: 'white',
      fontSize: '11px',
      fontWeight: '600',
      padding: '2px 6px',
      borderRadius: '10px',
      border: '2px solid #647A67'
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#1F241F',
      cursor: 'pointer'
    },
    avatar: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#647A67',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      color: 'white',
      fontWeight: '600'
    },
    userName: {
      fontSize: '14px'
    },
    signInButton: {
      backgroundColor: '#647A67',
      color: 'white',
      border: 'none',
      padding: '8px 20px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap'
    },
    signInButtonHover: {
      backgroundColor: '#3C433B',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }
  };

  return (
    <>
      {/* Main Header */}
      <header style={styles.header}>
        <div style={styles.container}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <div style={styles.logoText}>
              <span style={{ fontSize: '32px' }}>🛒</span>
              <span>ShopMart</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div style={styles.searchSection}>
            <div style={styles.searchBar}>
              <input
                type="text"
                placeholder="Find products, brands and more"
                style={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
              <button
                style={{
                  ...styles.searchButton,
                  ...(hoveredItem === 'search' ? styles.searchButtonHover : {})
                }}
                onMouseEnter={() => setHoveredItem('search')}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>

          {/* Cart & User */}
          <div style={styles.cartSection}>
            <Link
              to="/cart"
              style={{
                ...styles.cartIcon,
                textDecoration: 'none',
                ...(hoveredItem === 'cart' ? { transform: 'scale(1.1)' } : {})
              }}
              onMouseEnter={() => setHoveredItem('cart')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              🛒
            </Link>
            
            {/* User Section - Show Sign In button or Avatar */}
            {isAuthenticated && user ? (
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div style={{
                  ...styles.userSection,
                  cursor: 'pointer'
                }}>
                  <div style={styles.avatar}>
                    {(user.full_name || user.fullName)?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span style={styles.userName}>{user.full_name || user.fullName || 'Tài khoản'}</span>
                  <span style={{ fontSize: '12px' }}>▼</span>
                </div>

                {/* Dropdown Menu */}
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
                      minWidth: '220px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 1001,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #eee',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1F241F'
                      }}>
                        {user.full_name || user.fullName}
                      </div>
                      <div style={{
                        padding: '10px 16px',
                        fontSize: '13px',
                        color: '#666',
                        borderBottom: '1px solid #eee'
                      }}>
                        {user.email}
                      </div>
                      <div style={{
                        padding: '8px 0'
                      }}>
                        <div style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => {
                          navigate('/profile');
                          setShowUserMenu(false);
                        }}
                        >
                          <span>👤</span> My profile
                        </div>
                        <div style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => {
                          navigate('/profile');
                          setShowUserMenu(false);
                        }}
                        >
                          <span>📦</span> My orders
                        </div>
                        <div style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#d9534f',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'background 0.2s',
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
                          <span>🚪</span> Sign out
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    ...styles.signInButton,
                    ...(hoveredItem === 'signin' ? styles.signInButtonHover : {})
                  }}
                  onMouseEnter={() => setHoveredItem('signin')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  Sign in
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
