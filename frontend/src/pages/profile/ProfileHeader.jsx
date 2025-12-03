import React from 'react';

const ProfileHeader = ({ user, styles, onEditProfile }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.profileHeader}>
      <div style={styles.avatarSection}>
        <img
          src={user.avatar || 'https://via.placeholder.com/120?text=Avatar'}
          alt={user.full_name}
          style={styles.avatar}
        />
        <button style={styles.changeAvatarBtn}>
          📷 Đổi ảnh
        </button>
      </div>

      <div style={styles.profileInfo}>
        <h1 style={styles.userName}>{user.full_name}</h1>
        
        <div style={styles.userMeta}>
          <span style={styles.metaItem}>
            📧 {user.email}
          </span>
          <span style={styles.metaItem}>
            📱 {user.phone}
          </span>
          <span style={styles.metaItem}>
            📍 {user.address || 'Chưa cập nhật địa chỉ'}
          </span>
        </div>

        <p style={styles.memberSince}>
          🎂 Thành viên từ: {formatDate(user.created_at)}
        </p>

        <div style={{ marginTop: '16px' }}>
          <button style={styles.editProfileBtn} onClick={onEditProfile}>
            ✏️ Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
