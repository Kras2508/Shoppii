import React, { useState } from 'react';
import { Dropdown } from '../../components/common';

const ProfileEdit = ({ user, styles, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    phone: user.phone || '',
    add_phone: user.add_phone || '',
    address: user.address || '',
    gender: user.gender || '',
    birthday: user.birthday || ''
  });

  const genderOptions = [
    { value: '', label: 'Chọn giới tính' },
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' }
  ];

  const getGenderLabel = (value) => {
    const option = genderOptions.find(opt => opt.value === value);
    return option ? option.label : 'Chọn giới tính';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Basic Info */}
      <div style={styles.formSection}>
        <h3 style={styles.formTitle}>📋 Thông tin cơ bản</h3>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Họ và tên *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ ...styles.formInput, backgroundColor: '#f5f5f5' }}
              disabled
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Số điện thoại *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Số điện thoại phụ</label>
            <input
              type="tel"
              name="add_phone"
              value={formData.add_phone}
              onChange={handleChange}
              style={styles.formInput}
              placeholder="Số điện thoại dự phòng"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Giới tính</label>
            <Dropdown
              trigger={
                <div style={{
                  ...styles.formInput,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: formData.gender ? '#1F241F' : '#999'
                }}>
                  <span>{getGenderLabel(formData.gender)}</span>
                  <span style={{ fontSize: '12px', color: '#999' }}>▼</span>
                </div>
              }
              align="left"
            >
              <div style={{ minWidth: '200px' }}>
                {genderOptions.map(option => (
                  <div
                    key={option.value}
                    onClick={() => handleGenderSelect(option.value)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      backgroundColor: formData.gender === option.value ? '#647A67' : 'transparent',
                      color: formData.gender === option.value ? '#fff' : '#1F241F',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.gender !== option.value) {
                        e.target.style.backgroundColor = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.gender !== option.value) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </Dropdown>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Ngày sinh</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div style={styles.formSection}>
        <h3 style={styles.formTitle}>📍 Địa chỉ giao hàng</h3>
        <div style={styles.formGrid}>
          <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
            <label style={styles.formLabel}>Địa chỉ đầy đủ *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={styles.formTextarea}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              required
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div style={styles.formSection}>
        <h3 style={styles.formTitle}>🔒 Bảo mật</h3>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Mật khẩu hiện tại</label>
            <input
              type="password"
              style={styles.formInput}
              placeholder="Nhập để đổi mật khẩu"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Mật khẩu mới</label>
            <input
              type="password"
              style={styles.formInput}
              placeholder="Mật khẩu mới"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.formActions}>
        <button type="button" style={styles.cancelBtn} onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" style={styles.saveBtn}>
          💾 Lưu thay đổi
        </button>
      </div>
    </form>
  );
};

export default ProfileEdit;
