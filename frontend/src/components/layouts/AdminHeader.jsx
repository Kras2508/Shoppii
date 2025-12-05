import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slice/auth.slice.js';
import { Dropdown, DropdownItem, DropdownDivider, Avatar, Badge } from '../common/index.js';

const AdminHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const currentPath = window.location.pathname;

  const styles = {
    header: {
      backgroundColor: '#1a1a2e',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    },
    container: {
      width: '100%',
      padding: '12px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
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
      gap: '10px',
      textDecoration: 'none',
      color: 'white',
      fontSize: '22px',
      fontWeight: '700'
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    navLink: {
      color: 'rgba(255,255,255,0.7)',
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
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    userTrigger: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '6px',
      transition: 'background 0.2s'
    },
    userName: {
      fontSize: '14px'
    },
    dropdownHeader: {
      padding: '12px 16px',
      borderBottom: '1px solid #eee',
      fontSize: '13px',
      color: '#666'
    }
  };

  const navItems = [
    { path: '/admin', label: '📊 Dashboard', exact: true },
    { path: '/admin/users', label: '👥 Users' },
    { path: '/admin/shops', label: '🏪 Shops' },
    { path: '/admin/products', label: '📦 Products' },
    { path: '/admin/orders', label: '🛒 Orders' },
    { path: '/admin/reviews', label: '⭐ Reviews' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  // User trigger for dropdown
  const userTrigger = (
    <div style={styles.userTrigger}>
      <Avatar 
        name={user?.full_name || 'Admin'} 
        size="small" 
        status="online"
      />
      <span style={styles.userName}>{user?.full_name || 'Admin'}</span>
      <span style={{ fontSize: '10px' }}>▼</span>
    </div>
  );

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <Link to="/admin" style={styles.logo}>
            <span>🛡️</span>
            <span>ShopMart</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {navItems.map(item => {
            const isActive = item.exact 
              ? currentPath === item.path
              : currentPath.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {})
                }}
                onMouseEnter={(e) => !isActive && (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => !isActive && (e.target.style.backgroundColor = 'transparent')}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div style={styles.rightSection}>
          {/* User Dropdown */}
          <Dropdown trigger={userTrigger} align="right">
            <div style={styles.dropdownHeader}>
              {user?.email || 'admin@gmail.com'}
            </div>
            <DropdownItem icon="👤" onClick={() => navigate('/admin')}>
              Trang Admin
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem icon="🚪" danger onClick={handleLogout}>
              Sign out
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
