import React from 'react';

const SignUpPage = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  });
  const [agreeTerms, setAgreeTerms] = React.useState(false);

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5'
    },
    container: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 20px'
    },
    formWrapper: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '60px 40px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      maxWidth: '400px',
      width: '100%'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1F241F',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      marginBottom: 0
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxSizing: 'border-box',
      transition: 'border 0.3s ease',
      fontFamily: 'inherit'
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '24px',
      fontSize: '14px',
      color: '#666'
    },
    checkbox: {
      width: '16px',
      height: '16px',
      cursor: 'pointer'
    },
    link: {
      color: '#647A67',
      textDecoration: 'none',
      fontWeight: '600'
    },
    button: {
      width: '100%',
      padding: '14px 20px',
      fontSize: '16px',
      fontWeight: '600',
      backgroundColor: '#647A67',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '20px'
    },
    divider: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#999',
      marginBottom: '20px'
    },
    socialButtons: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px'
    },
    socialButton: {
      flex: 1,
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '600',
      border: '1px solid #ddd',
      backgroundColor: 'white',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    footer: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#666'
    },
    footerLink: {
      color: '#647A67',
      textDecoration: 'none',
      fontWeight: '600'
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản và chính sách');
      return;
    }
    console.log('Sign up:', formData);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <div style={styles.header}>
            <h1 style={styles.title}>WELCOME TO SHOPMART</h1>
            <p style={styles.subtitle}>Haven't got an account?</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#647A67'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#647A67'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mật khẩu</label>
              <input
                type="password"
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#647A67'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="terms" style={{ cursor: 'pointer', margin: 0 }}>
                I agree to the <a href="#" style={styles.link}>terms & conditions</a>
              </label>
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                backgroundColor: agreeTerms ? '#647A67' : '#ccc'
              }}
              onMouseEnter={(e) => {
                if (agreeTerms) e.target.style.backgroundColor = '#556B5A';
              }}
              onMouseLeave={(e) => {
                if (agreeTerms) e.target.style.backgroundColor = '#647A67';
              }}
            >
              Signup
            </button>
          </form>

          <div style={styles.divider}>Or</div>

          <div style={styles.socialButtons}>
            <button
              type="button"
              style={styles.socialButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              Sign up with Google
            </button>
            <button
              type="button"
              style={styles.socialButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              Sign up with Facebook
            </button>
          </div>

          <div style={styles.footer}>
            Already have an account? <a href="/signin" style={styles.footerLink}>Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
