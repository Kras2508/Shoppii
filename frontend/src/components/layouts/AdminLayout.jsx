import React from 'react';
import AdminHeader from './AdminHeader.jsx';

const AdminLayout = ({ children }) => {
  const styles = {
    layout: {
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    },
    main: {
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '24px 40px',
      boxSizing: 'border-box'
    }
  };

  return (
    <div style={styles.layout}>
      <AdminHeader />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
