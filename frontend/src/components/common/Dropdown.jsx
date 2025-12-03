import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({
  trigger,
  children,
  align = 'left',
  className = '',
  closeOnClick = true,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleContentClick = () => {
    if (closeOnClick) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown ${className} ${disabled ? 'dropdown--disabled' : ''}`}
    >
      <div onClick={toggleDropdown} className="dropdown__trigger">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`dropdown__menu dropdown__menu--${align}`}
          onClick={handleContentClick}
        >
          {children}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center']),
  className: PropTypes.string,
  closeOnClick: PropTypes.bool,
  disabled: PropTypes.bool
};

export const DropdownItem = ({ children, onClick, icon, danger = false, disabled = false }) => {
  return (
    <div
      className={`dropdown__item ${danger ? 'dropdown__item--danger' : ''} ${
        disabled ? 'dropdown__item--disabled' : ''
      }`}
      onClick={disabled ? undefined : onClick}
    >
      {icon && <span className="dropdown__item-icon">{icon}</span>}
      <span className="dropdown__item-text">{children}</span>
    </div>
  );
};

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  danger: PropTypes.bool,
  disabled: PropTypes.bool
};

export const DropdownDivider = () => {
  return <div className="dropdown__divider" />;
};

export default Dropdown;
