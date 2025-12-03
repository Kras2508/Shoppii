import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Textarea = forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  readOnly = false,
  required = false,
  fullWidth = false,
  rows = 4,
  resize = 'vertical',
  className = '',
  ...rest
}, ref) => {
  const textareaClass = [
    'textarea__field',
    error && 'textarea__field--error',
    disabled && 'textarea__field--disabled',
    `textarea__field--resize-${resize}`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`textarea ${fullWidth ? 'textarea--full-width' : ''}`}>
      {label && (
        <label className="textarea__label">
          {label}
          {required && <span className="textarea__required">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={textareaClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={rows}
        {...rest}
      />
      {(error || helperText) && (
        <div className={`textarea__message ${error ? 'textarea__message--error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  rows: PropTypes.number,
  resize: PropTypes.oneOf(['none', 'vertical', 'horizontal', 'both']),
  className: PropTypes.string
};

export default Textarea;
