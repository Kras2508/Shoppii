import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({
  src,
  alt = 'Avatar',
  name,
  size = 'medium',
  status,
  shape = 'circle',
  className = ''
}) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const avatarClass = [
    'avatar',
    `avatar--${size}`,
    `avatar--${shape}`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={avatarClass}>
      <div className="avatar__wrapper">
        {src ? (
          <img src={src} alt={alt} className="avatar__image" />
        ) : (
          <div className="avatar__placeholder">{getInitials(name || alt)}</div>
        )}
      </div>
      {status && <span className={`avatar__status avatar__status--${status}`} />}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  status: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
  shape: PropTypes.oneOf(['circle', 'square']),
  className: PropTypes.string
};

export default Avatar;
