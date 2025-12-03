import React from 'react';

const FilterSidebar = ({
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategories,
  onCategoryChange,
  selectedRating,
  setSelectedRating,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  onClearFilters
}) => {
  const styles = {
    sidebar: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      height: 'fit-content',
      position: 'sticky',
      top: '100px'
    },
    filterTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    filterSection: {
      marginBottom: '24px',
      paddingBottom: '20px',
      borderBottom: '1px solid #f0f0f0'
    },
    filterLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '12px'
    },
    searchInput: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      outline: 'none'
    },
    categoryList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxHeight: '300px',
      overflowY: 'auto'
    },
    categoryItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#3C433B',
      cursor: 'pointer'
    },
    checkbox: {
      width: '16px',
      height: '16px',
      accentColor: '#647A67',
      cursor: 'pointer'
    },
    ratingFilter: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    ratingOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '6px 10px',
      borderRadius: '4px',
      transition: 'background 0.2s'
    },
    stars: {
      color: '#FFB800',
      fontSize: '16px'
    },
    priceInputs: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    priceInput: {
      flex: 1,
      padding: '8px 10px',
      fontSize: '13px',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      fontFamily: 'inherit',
      outline: 'none',
      boxSizing: 'border-box'
    },
    sortOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    sortOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 10px',
      fontSize: '14px',
      color: '#3C433B',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'background 0.2s'
    },
    sortOptionActive: {
      backgroundColor: '#C6DEC6',
      color: '#647A67',
      fontWeight: '500'
    },
    clearBtn: {
      width: '100%',
      padding: '10px',
      backgroundColor: 'white',
      border: '1px solid #647A67',
      color: '#647A67',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  };

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'sold', label: 'Bán chạy' },
    { value: 'rating-desc', label: 'Đánh giá cao nhất' },
    { value: 'rating-asc', label: 'Đánh giá thấp nhất' },
    { value: 'price-asc', label: 'Giá thấp đến cao' },
    { value: 'price-desc', label: 'Giá cao đến thấp' },
  ];

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.filterTitle}>
        <span>☰</span> Bộ Lọc
      </h2>

      {/* Search */}
      <div style={styles.filterSection}>
        <div style={styles.filterLabel}>Tìm Kiếm</div>
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Category */}
      <div style={styles.filterSection}>
        <div style={styles.filterLabel}>Danh Mục</div>
        <div style={styles.categoryList}>
          {categories.map(cat => (
            <label key={cat.category_id} style={styles.categoryItem}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.category_id)}
                onChange={() => onCategoryChange(cat.category_id)}
                style={styles.checkbox}
              />
              <span>{cat.category_name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div style={styles.filterSection}>
        <div style={styles.filterLabel}>Đánh Giá</div>
        <div style={styles.ratingFilter}>
          {[5, 4, 3, 2, 1].map(rating => (
            <div
              key={rating}
              style={{
                ...styles.ratingOption,
                backgroundColor: selectedRating === rating ? '#C6DEC6' : 'transparent'
              }}
              onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
            >
              <span style={styles.stars}>
                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
              </span>
              <span style={{ fontSize: '13px', color: '#758173' }}>trở lên</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div style={styles.filterSection}>
        <div style={styles.filterLabel}>Khoảng Giá</div>
        <div style={styles.priceInputs}>
          <input
            type="number"
            placeholder="Từ"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            style={styles.priceInput}
          />
          <span style={{ color: '#999' }}>—</span>
          <input
            type="number"
            placeholder="Đến"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            style={styles.priceInput}
          />
        </div>
      </div>

      {/* Sort By */}
      <div style={styles.filterSection}>
        <div style={styles.filterLabel}>Sắp Xếp Theo</div>
        <div style={styles.sortOptions}>
          {sortOptions.map(option => (
            <div
              key={option.value}
              style={{
                ...styles.sortOption,
                ...(sortBy === option.value ? styles.sortOptionActive : {})
              }}
              onClick={() => setSortBy(option.value)}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: sortBy === option.value ? '#647A67' : 'transparent',
                border: '1px solid #647A67'
              }} />
              {option.label}
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        style={styles.clearBtn}
        onClick={onClearFilters}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#647A67';
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.color = '#647A67';
        }}
      >
        Xóa Bộ Lọc
      </button>
    </aside>
  );
};

export default FilterSidebar;
