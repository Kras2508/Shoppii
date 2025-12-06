import React from 'react';

const ProfileHeader = ({ user, styles, onEditProfile }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.profileHeader}>
      <div style={styles.avatarSection}>
        <img
          src={user.avatar || 'https://i.pinimg.com/1200x/f9/53/c9/f953c93a8bc71461c34beaddf96a5afd.jpg'}
          alt={user.full_name}
          style={styles.avatar}
        />
        <button style={styles.changeAvatarBtn}>
          📷 Change avatar
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
            📍 {user.address || 'Address not updated'}
          </span>
        </div>

        <p style={styles.memberSince}>
          🎂 Member since: {formatDate(user.created_at)}
        </p>

        <div style={{ marginTop: '16px' }}>
          <button style={styles.editProfileBtn} onClick={onEditProfile}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
