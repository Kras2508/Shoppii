import React from 'react';
import PropTypes from 'prop-types';


const Badge = ({
  children,
  variant = 'primary',
  size = 'medium',
  rounded = false,
  dot = false,
  className = ''
}) => {
  const badgeClass = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    rounded && 'badge--rounded',
    dot && 'badge--dot',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClass}>
      {dot && <span className="badge__dot" />}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  rounded: PropTypes.bool,
  dot: PropTypes.bool,
  className: PropTypes.string
};

export default Badge;
