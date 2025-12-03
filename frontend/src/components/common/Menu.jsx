import React from 'react';
import PropTypes from 'prop-types';

const Menu = ({ children, orientation = 'horizontal', className = '' }) => {
  return (
    <nav className={`menu menu--${orientation} ${className}`}>
      <ul className="menu__list">{children}</ul>
    </nav>
  );
};

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string
};

export const MenuItem = ({ 
  children, 
  active = false, 
  disabled = false, 
  icon,
  badge,
  onClick,
  href
}) => {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  const content = (
    <>
      {icon && <span className="menu__item-icon">{icon}</span>}
      <span className="menu__item-text">{children}</span>
      {badge && <span className="menu__item-badge">{badge}</span>}
    </>
  );

  const className = `menu__item ${active ? 'menu__item--active' : ''} ${
    disabled ? 'menu__item--disabled' : ''
  }`;

  if (href && !disabled) {
    return (
      <li>
        <a href={href} className={className} onClick={handleClick}>
          {content}
        </a>
      </li>
    );
  }

  return (
    <li>
      <button className={className} onClick={handleClick} disabled={disabled}>
        {content}
      </button>
    </li>
  );
};

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  badge: PropTypes.node,
  onClick: PropTypes.func,
  href: PropTypes.string
};

export const MenuDivider = () => {
  return <li className="menu__divider" />;
};

export default Menu;
