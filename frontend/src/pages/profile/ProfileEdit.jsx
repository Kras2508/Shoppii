import React, { useState } from 'react';
import { Dropdown } from '../../components/common';

const ProfileEdit = ({ user, styles, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    phone: user.phone || '',
    add_phone: user.add_phone || '',
    address: user.address || '',
    current_password: '',
    new_password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        <h3 style={styles.formTitle}>📋 General information</h3>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Full name *</label>
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
            <label style={styles.formLabel}>Phone number *</label>
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
            <label style={styles.formLabel}>Secondary phone number</label>
            <input
              type="tel"
              name="add_phone"
              value={formData.add_phone}
              onChange={handleChange}
              style={styles.formInput}
              placeholder="Secondary phone number"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div style={styles.formSection}>
        <h3 style={styles.formTitle}>📍Shipping address</h3>
        <div style={styles.formGrid}>
          <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
            <label style={styles.formLabel}>Full address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={styles.formTextarea}
              placeholder="House number, street, ward/commune, district, city/province"
              required
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div style={styles.formSection}>
        <h3 style={styles.formTitle}>🔒 Security</h3>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Current password</label>
            <input
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              style={styles.formInput}
              placeholder="Enter to change password"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>New password</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              style={styles.formInput}
              placeholder="New password"
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
          💾 Save changes
        </button>
      </div>
    </form>
  );
};

export default ProfileEdit;
