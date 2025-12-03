import React, { useState } from 'react';
import reviewStyles from './reviewStyles';

const ImageUploader = ({ images, setImages, styles }) => {
  const [dragActive, setDragActive] = useState(false);
  const maxImages = 5;

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && images.length < maxImages) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            src: e.target.result
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div style={styles.reviewSection}>
      <div style={styles.imageUploadLabel}>
        📸 Hình ảnh sản phẩm ({images.length}/{maxImages})
      </div>

      {images.length < maxImages && (
        <>
          <div
            style={{
              ...styles.uploadArea,
              ...(dragActive ? styles.uploadAreaHover : {})
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('imageInput').click()}
          >
            <div style={styles.uploadIcon}>📤</div>
            <div style={styles.uploadText}>Kéo hình ảnh vào đây</div>
            <div style={styles.uploadSubtext}>hoặc nhấp để chọn</div>
          </div>
          <input
            id="imageInput"
            type="file"
            multiple
            accept="image/*"
            style={styles.fileInput}
            onChange={handleChange}
          />
        </>
      )}

      {images.length > 0 && (
        <div style={styles.imageGrid}>
          {images.map(image => (
            <div key={image.id} style={styles.imageItem}>
              <img src={image.src} alt="review" style={styles.imageImg} />
              <button
                style={styles.removeBtn}
                onClick={() => removeImage(image.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
