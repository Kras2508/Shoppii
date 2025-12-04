import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import shopStyles from './shopStyles';
import { shopService } from '../../api/shopService';
import createPrivateClient from '../../clients/private.client';

const ShopSettingsPage = () => {
  const { user, token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);
  
  const [shopData, setShopData] = useState({
    shop_name: '',
    shop_phone: '',
    address_shop: '',
    email: '',
    description: '',
    shop_status: 'Open',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Shop',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=300&fit=crop'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const response = await shopService.getShopDashboard(privateClient);
        if (response.data?.data?.shop) {
          const shop = response.data.data.shop;
          setShopData({
            shop_name: shop.shop_name || '',
            shop_phone: shop.shop_phone || '',
            address_shop: shop.address_shop || '',
            email: shop.email || user?.email || '',
            description: shop.description || '',
            shop_status: shop.shop_status || 'Open',
            logo: shop.logo || 'https://api.dicebear.com/7.x/initials/svg?seed=Shop',
            banner: shop.banner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=300&fit=crop'
          });
        }
      } catch (err) {
        console.error('Error fetching shop data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, [token]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(shopData);
  const [activeTab, setActiveTab] = useState('info'); // info, business, notifications

  const styles = {
    ...shopStyles,
    tabNav: {
      display: 'flex',
      gap: '0',
      borderBottom: '1px solid #eee',
      marginBottom: '24px'
    },
    tab: {
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#666',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      transition: 'all 0.2s',
      backgroundColor: 'transparent',
      border: 'none'
    },
    tabActive: {
      color: '#647A67',
      borderBottom: '2px solid #647A67'
    },
    formSection: {
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxSizing: 'border-box',
      transition: 'border 0.2s'
    },
    inputDisabled: {
      backgroundColor: '#f9f9f9',
      color: '#666'
    },
    textarea: {
      width: '100%',
      padding: '12px 14px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxSizing: 'border-box',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit'
    },
    select: {
      width: '100%',
      padding: '12px 14px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    imagePreview: {
      width: '120px',
      height: '120px',
      borderRadius: '12px',
      objectFit: 'cover',
      border: '2px solid #eee'
    },
    bannerPreview: {
      width: '100%',
      height: '150px',
      borderRadius: '8px',
      objectFit: 'cover',
      border: '1px solid #eee'
    },
    uploadBtn: {
      marginTop: '12px',
      padding: '8px 16px',
      fontSize: '13px',
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500'
    },
    statusOpen: {
      backgroundColor: '#C5EFCB',
      color: '#2e7d32'
    },
    statusClosed: {
      backgroundColor: '#ffebee',
      color: '#c62828'
    },
    statusTemp: {
      backgroundColor: '#fff3e0',
      color: '#ef6c00'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid #f0f0f0'
    },
    infoLabel: {
      fontSize: '14px',
      color: '#666'
    },
    infoValue: {
      fontSize: '14px',
      color: '#1F241F',
      fontWeight: '500'
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
      paddingTop: '20px',
      borderTop: '1px solid #eee'
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await shopService.updateShopProfile({
        shop_name: editData.shop_name,
        shop_phone: editData.shop_phone,
        address_shop: editData.address_shop,
        shop_status: editData.shop_status
      }, privateClient);
      setShopData(editData);
      setIsEditing(false);
      alert('Đã lưu thay đổi!');
    } catch (err) {
      console.error('Error saving shop data:', err);
      alert('Không thể lưu thay đổi. Vui lòng thử lại!');
    }
  };

  const handleCancel = () => {
    setEditData(shopData);
    setIsEditing(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return { ...styles.statusBadge, ...styles.statusOpen };
      case 'Closed':
        return { ...styles.statusBadge, ...styles.statusClosed };
      case 'Temporarily Close':
        return { ...styles.statusBadge, ...styles.statusTemp };
      default:
        return styles.statusBadge;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Open': return '🟢 Đang hoạt động';
      case 'Closed': return '🔴 Đã đóng cửa';
      case 'Temporarily Close': return '🟡 Tạm nghỉ';
      default: return status;
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>⚙️ Cài đặt Shop</h1>
          {!isEditing ? (
            <button
              style={styles.primaryBtn}
              onClick={() => setIsEditing(true)}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
            >
              ✏️ Chỉnh sửa
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={styles.secondaryBtn}
                onClick={handleCancel}
              >
                Hủy
              </button>
              <button
                style={styles.primaryBtn}
                onClick={handleSave}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
              >
                💾 Lưu thay đổi
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div style={styles.card}>
          <div style={styles.tabNav}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'info' ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab('info')}
            >
              🏪 Thông tin Shop
            </button>
          </div>

          {/* Tab Content - Shop Info */}
          {activeTab === 'info' && (
            <div>
              {/* Logo & Banner */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>📷 Hình ảnh Shop</h3>
                <div style={{ display: 'flex', gap: '40px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Logo Shop</p>
                    <img src={shopData.logo} alt="Logo" style={styles.imagePreview} />
                    {isEditing && (
                      <button style={styles.uploadBtn}>
                        📤 Thay đổi
                      </button>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Ảnh bìa</p>
                    <img src={shopData.banner} alt="Banner" style={styles.bannerPreview} />
                    {isEditing && (
                      <button style={styles.uploadBtn}>
                        📤 Thay đổi ảnh bìa
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>📝 Thông tin cơ bản</h3>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tên Shop *</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="shop_name"
                        value={editData.shop_name}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    ) : (
                      <div style={{ ...styles.input, ...styles.inputDisabled }}>{shopData.shop_name}</div>
                    )}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Trạng thái</label>
                    {isEditing ? (
                      <select
                        name="shop_status"
                        value={editData.shop_status}
                        onChange={handleInputChange}
                        style={styles.select}
                      >
                        <option value="Open">🟢 Đang hoạt động</option>
                        <option value="Temporarily Close">🟡 Tạm nghỉ</option>
                        <option value="Closed">🔴 Đóng cửa</option>
                      </select>
                    ) : (
                      <div style={getStatusBadge(shopData.shop_status)}>
                        {getStatusText(shopData.shop_status)}
                      </div>
                    )}
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Mô tả Shop</label>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={handleInputChange}
                      style={styles.textarea}
                      placeholder="Mô tả về shop của bạn..."
                    />
                  ) : (
                    <div style={{ ...styles.input, ...styles.inputDisabled, minHeight: '80px' }}>
                      {shopData.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>📞 Thông tin liên hệ</h3>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Số điện thoại Shop</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="shop_phone"
                        value={editData.shop_phone}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    ) : (
                      <div style={{ ...styles.input, ...styles.inputDisabled }}>{shopData.shop_phone}</div>
                    )}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    ) : (
                      <div style={{ ...styles.input, ...styles.inputDisabled }}>{shopData.email}</div>
                    )}
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Địa chỉ Shop</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address_shop"
                      value={editData.address_shop}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  ) : (
                    <div style={{ ...styles.input, ...styles.inputDisabled }}>{shopData.address_shop}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsPage;
