import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slice/auth.slice.js';
import { getMockCredentials } from '../mockData/mockUsers.js';

const SignInPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    role: 'Customer' // 'Customer', 'Shop' hoặc 'Admin'
  });

  const [showCredentials, setShowCredentials] = React.useState(false);

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
    logo: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#647A67',
      marginBottom: '20px'
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
    forgotLink: {
      textAlign: 'right',
      marginBottom: '24px'
    },
    link: {
      color: '#647A67',
      textDecoration: 'none',
      fontSize: '14px',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({
      email: formData.email,
      password: formData.password
    }));
    
    if (result.payload && result.payload.user) {
      // Login successful - redirect based on role
      const userRole = result.payload.user.role;
      
      // Redirect theo role thực của user
      if (userRole === 'Admin') {
        navigate('/admin');
      } else if (userRole === 'Shop') {
        navigate('/shop');
      } else {
        navigate('/');
      }
    }
  };

  const fillMockCredentials = (type) => {
    const credentials = getMockCredentials();
    const user = credentials.find(c => c.type === type);
    if (user) {
      setFormData({
        email: user.email,
        password: user.password,
        role: type
      });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <div style={styles.header}>
            <div style={styles.title}>WELCOME TO SHOPMART</div>
            <p style={styles.subtitle}>Login here...</p>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
            {/* Role Selection */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'Customer' }))}
                style={{
                  flex: 1,
                  padding: '12px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: formData.role === 'Customer' ? '2px solid #647A67' : '1px solid #ddd',
                  backgroundColor: formData.role === 'Customer' ? '#C5EFCB' : 'white',
                  color: formData.role === 'Customer' ? '#1F241F' : '#666',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                🛍️ Người mua
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'Shop' }))}
                style={{
                  flex: 1,
                  padding: '12px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: formData.role === 'Shop' ? '2px solid #647A67' : '1px solid #ddd',
                  backgroundColor: formData.role === 'Shop' ? '#C5EFCB' : 'white',
                  color: formData.role === 'Shop' ? '#1F241F' : '#666',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                🏪 Người bán
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'Admin' }))}
                style={{
                  flex: 1,
                  padding: '12px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: formData.role === 'Admin' ? '2px solid #e74c3c' : '1px solid #ddd',
                  backgroundColor: formData.role === 'Admin' ? '#fdeaea' : 'white',
                  color: formData.role === 'Admin' ? '#c0392b' : '#666',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                🛡️ Admin
              </button>
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

            <div style={styles.forgotLink}>
              <a href="#" style={styles.link}>Forgot password?</a>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '20px',
                border: '1px solid #fcc'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                ...styles.button,
                opacity: status === 'loading' ? 0.7 : 1,
                cursor: status === 'loading' ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => status !== 'loading' && (e.target.style.backgroundColor = '#556B5A')}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
            >
              {status === 'loading' ? 'Đang đăng nhập...' : 'Sign in'}
            </button>
          </form>

          {/* Mock Credentials for Testing */}
          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #eee'
          }}>
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '12px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#666',
                marginBottom: '10px'
              }}
            >
              {showCredentials ? '✕ Ẩn' : '📋 Tài khoản test'}
            </button>

            {showCredentials && (
              <div style={{ fontSize: '12px' }}>
                {getMockCredentials().map((cred, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#f9f9f9',
                    padding: '10px',
                    marginBottom: '8px',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{cred.type}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      Email: {cred.email}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '6px' }}>
                      Pass: {cred.password}
                    </div>
                    <button
                      type="button"
                      onClick={() => fillMockCredentials(cred.type)}
                      style={{
                        width: '100%',
                        padding: '6px',
                        fontSize: '11px',
                        backgroundColor: '#647A67',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
                    >
                      Điền tài khoản này
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.divider}>Or</div>

          <div style={styles.socialButtons}>
            <button
              type="button"
              style={styles.socialButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              Sign in with Google
            </button>
            <button
              type="button"
              style={styles.socialButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              Sign in with Facebook
            </button>
          </div>

          <div style={styles.footer}>
            Don’t have an account? <a href="/signup" style={styles.footerLink}>Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
