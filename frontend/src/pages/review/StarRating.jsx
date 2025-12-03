import React, { useState } from 'react';
import reviewStyles from './reviewStyles';

const StarRating = ({ rating, setRating, styles }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const getRatingText = (rate) => {
    const texts = {
      0: 'Chọn đánh giá',
      1: '😞 Rất không hài lòng',
      2: '😐 Không hài lòng',
      3: '🙂 Bình thường',
      4: '😊 Hài lòng',
      5: '😍 Rất hài lòng'
    };
    return texts[rate] || '';
  };

  const displayRating = hoverRating || rating;

  return (
    <div style={styles.ratingSection}>
      <div style={styles.ratingLabel}>Đánh giá sản phẩm</div>
      <div style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            style={{
              ...styles.star,
              ...(star <= displayRating ? styles.starActive : {})
            }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            ⭐
          </span>
        ))}
        <span style={styles.ratingText}>
          {getRatingText(displayRating)}
        </span>
      </div>
    </div>
  );
};

export default StarRating;
