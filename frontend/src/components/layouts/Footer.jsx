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
    { id: 1, text: 'Trung Tâm Trợ Giúp', href: '/help' },
    { id: 2, text: 'ShopMart Blog', href: '/blog' },
    { id: 3, text: 'Hướng Dẫn Mua Hàng', href: '/guide' },
    { id: 4, text: 'Hướng Dẫn Bán Hàng', href: '/sell-guide' },
    { id: 5, text: 'Thanh Toán', href: '/payment' },
    { id: 6, text: 'Vận Chuyển', href: '/shipping' },
    { id: 7, text: 'Trả Hàng & Hoàn Tiền', href: '/returns' }
  ];

  const aboutLinks = [
    { id: 1, text: 'Giới Thiệu Về ShopMart', href: '/about' },
    { id: 2, text: 'Tuyển Dụng', href: '/careers' },
    { id: 3, text: 'Điều Khoản ShopMart', href: '/terms' },
    { id: 4, text: 'Chính Sách Bảo Mật', href: '/privacy' },
    { id: 5, text: 'Chính Hãng', href: '/authentic' },
    { id: 6, text: 'Kênh Người Bán', href: '/seller' },
    { id: 7, text: 'Flash Sales', href: '/flash-sales' }
  ];

  const categoriesLinks = [
    { id: 1, text: 'Thời Trang Nam', href: '/men-fashion' },
    { id: 2, text: 'Thời Trang Nữ', href: '/women-fashion' },
    { id: 3, text: 'Điện Thoại & Phụ Kiện', href: '/phones' },
    { id: 4, text: 'Máy Tính & Laptop', href: '/computers' },
    { id: 5, text: 'Sắc Đẹp', href: '/beauty' },
    { id: 6, text: 'Nhà Cửa & Đời Sống', href: '/home' },
    { id: 7, text: 'Thể Thao & Du Lịch', href: '/sports' }
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
              Nền tảng thương mại điện tử hàng đầu Việt Nam. 
              Mua sắm và bán hàng online đơn giản, nhanh chóng và an toàn.
            </p>
            <div style={styles.payment}>
              <div style={styles.paymentTitle}>Thanh toán</div>
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
              <h3 style={styles.columnTitle}>Chăm Sóc Khách Hàng</h3>
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
              <h3 style={styles.columnTitle}>Về ShopMart</h3>
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
              <h3 style={styles.columnTitle}>Danh Mục</h3>
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
