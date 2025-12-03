import React from 'react';
import ShopHeader from './ShopHeader';
import Footer from './Footer';

const ShopLayout = ({ children }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <ShopHeader />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ShopLayout;
