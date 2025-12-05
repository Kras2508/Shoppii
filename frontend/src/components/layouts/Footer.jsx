import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: '#B8D2B3',
      borderTop: '4px solid #647A67',
      padding: '50px 0 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    container: {
      padding: '0 20px'
    },
    topSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '50px',
      flexWrap: 'wrap',
      gap: '40px'
    },
    brandSection: {
      flex: '1 1 300px',
      minWidth: '250px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px',
      fontSize: '24px',
      fontWeight: '700',
      color: '#1F241F'
    },
    logoIcon: {
      fontSize: '32px'
    },
    tagline: {
      color: '#3C433B',
      fontSize: '13px',
      lineHeight: '1.8',
      marginBottom: '15px'
    },
    payment: {
      marginTop: '20px'
    },
    paymentTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '10px'
    },
    paymentIcons: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    paymentIcon: {
      width: '50px',
      height: '30px',
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    },
    linksSection: {
      display: 'flex',
      gap: '80px',
      flex: '2 1 500px',
      justifyContent: 'flex-end',
      flexWrap: 'wrap'
    },
    linkColumn: {
      minWidth: '140px'
    },
    columnTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '18px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    linkList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    linkItem: {
      marginBottom: '12px'
    },
    link: {
      color: '#3C433B',
      textDecoration: 'none',
      fontSize: '13px',
      transition: 'color 0.2s ease',
      cursor: 'pointer'
    },
    linkHover: {
      color: '#020402'
    },
    bottomSection: {
      borderTop: '1px solid #e0e0e0',
      marginTop: '40px',
      paddingTop: '25px',
      textAlign: 'center'
    },
    copyright: {
      color: '#999',
      fontSize: '12px',
      marginBottom: '15px'
    },
    certifications: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginTop: '20px',
      flexWrap: 'wrap'
    },
    cert: {
      padding: '8px 15px',
      backgroundColor: '#C6DEC6',
      border: '1px solid #8FA38A',
      borderRadius: '4px',
      fontSize: '11px',
      color: '#1F241F'
    },
    socialLinks: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      marginTop: '20px'
    },
    socialIcon: {
      color: '#3C433B',
      fontSize: '24px',
      transition: 'color 0.2s ease',
      cursor: 'pointer',
      textDecoration: 'none'
    }
  };

  const [hoveredLink, setHoveredLink] = React.useState(null);

  const customerCareLinks = [
    { id: 1, text: 'Help Center', href: '/help' },
    { id: 2, text: 'ShopMart Blog', href: '/blog' },
    { id: 3, text: 'Purchase Guide', href: '/guide' },
    { id: 4, text: 'Selling Guide', href: '/sell-guide' },
    { id: 5, text: 'Payment', href: '/payment' },
    { id: 6, text: 'Shipping', href: '/shipping' },
    { id: 7, text: 'Returns & Refunds', href: '/returns' }
  ];

  const aboutLinks = [
    { id: 1, text: 'About ShopMart', href: '/about' },
    { id: 2, text: 'Careers', href: '/careers' },
    { id: 3, text: 'ShopMart Terms', href: '/terms' },
    { id: 4, text: 'Privacy Policy', href: '/privacy' },
    { id: 5, text: 'Authenticity', href: '/authentic' },
    { id: 6, text: 'Seller Channel', href: '/seller' },
    { id: 7, text: 'Flash Sales', href: '/flash-sales' }
  ];

  const categoriesLinks = [
    { id: 1, text: 'Men\'s Fashion', href: '/men-fashion' },
    { id: 2, text: 'Women\'s Fashion', href: '/women-fashion' },
    { id: 3, text: 'Phones & Accessories', href: '/phones' },
    { id: 4, text: 'Computers & Laptops', href: '/computers' },
    { id: 5, text: 'Beauty', href: '/beauty' },
    { id: 6, text: 'Home & Living', href: '/home' },
    { id: 7, text: 'Sports & Travel', href: '/sports' }
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.topSection}>
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🛒</span>
              <span>ShopMart</span>
            </div>
            <p style={styles.tagline}>
              The leading e-commerce platform in HCMUT. 
              Shop and sell online easily, quickly, and safely.
            </p>
            <div style={styles.payment}>
              <div style={styles.paymentTitle}>Payment</div>
              <div style={styles.paymentIcons}>
                <div style={styles.paymentIcon}>💳</div>
                <div style={styles.paymentIcon}>🏦</div>
                <div style={styles.paymentIcon}>📱</div>
                <div style={styles.paymentIcon}>💰</div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div style={styles.linksSection}>
            {/* Customer Care Column */}
            <div style={styles.linkColumn}>
              <h3 style={styles.columnTitle}>Customer Care</h3>
              <ul style={styles.linkList}>
                {customerCareLinks.map((link) => (
                  <li key={link.id} style={styles.linkItem}>
                    <a
                      href={link.href}
                      style={{
                        ...styles.link,
                        ...(hoveredLink === `care-${link.id}` ? styles.linkHover : {})
                      }}
                      onMouseEnter={() => setHoveredLink(`care-${link.id}`)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Column */}
            <div style={styles.linkColumn}>
              <h3 style={styles.columnTitle}>About ShopMart</h3>
              <ul style={styles.linkList}>
                {aboutLinks.map((link) => (
                  <li key={link.id} style={styles.linkItem}>
                    <a
                      href={link.href}
                      style={{
                        ...styles.link,
                        ...(hoveredLink === `about-${link.id}` ? styles.linkHover : {})
                      }}
                      onMouseEnter={() => setHoveredLink(`about-${link.id}`)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories Column */}
            <div style={styles.linkColumn}>
              <h3 style={styles.columnTitle}>Categories</h3>
              <ul style={styles.linkList}>
                {categoriesLinks.map((link) => (
                  <li key={link.id} style={styles.linkItem}>
                    <a
                      href={link.href}
                      style={{
                        ...styles.link,
                        ...(hoveredLink === `cat-${link.id}` ? styles.linkHover : {})
                      }}
                      onMouseEnter={() => setHoveredLink(`cat-${link.id}`)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
