import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({
  size = 'medium',
  color = 'primary',
  fullScreen = false,
  text,
  className = ''
}) => {
  const spinnerClass = [
    'spinner',
    `spinner--${size}`,
    `spinner--${color}`,
    fullScreen && 'spinner--fullscreen',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <div className="spinner__wrapper">
      <div className="spinner__circle">
        <svg className="spinner__svg" viewBox="0 0 50 50">
          <circle
            className="spinner__path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
          />
        </svg>
      </div>
      {text && <p className="spinner__text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner__overlay">
        <div className={spinnerClass}>{content}</div>
      </div>
    );
  }

  return <div className={spinnerClass}>{content}</div>;
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white']),
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
  className: PropTypes.string
};

export default Spinner;
