import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  title,
  subtitle,
  image,
  imagePosition = 'top',
  footer,
  hoverable = false,
  clickable = false,
  onClick,
  className = ''
}) => {
  const cardClass = [
    'card',
    hoverable && 'card--hoverable',
    clickable && 'card--clickable',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const CardWrapper = clickable ? 'button' : 'div';

  return (
    <CardWrapper className={cardClass} onClick={onClick}>
      {image && imagePosition === 'top' && (
        <div className="card__image card__image--top">
          <img src={image} alt={title || 'Card image'} />
        </div>
      )}
      <div className="card__content">
        {(title || subtitle) && (
          <div className="card__header">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="card__body">{children}</div>
      </div>
      {footer && <div className="card__footer">{footer}</div>}
    </CardWrapper>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  imagePosition: PropTypes.oneOf(['top']),
  footer: PropTypes.node,
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Card;
