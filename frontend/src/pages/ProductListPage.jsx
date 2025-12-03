import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar, ProductGrid } from './productList';
import { mockCategories, mockProducts, getCategoryById } from '../mockData/mockProducts';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filters from URL
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search') || '';
  const saleParam = searchParams.get('sale'); // flash-sale, today-deals

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategories, setSelectedCategories] = useState(
    categoryParam ? [parseInt(categoryParam)] : []
  );
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Filter and sort products using useMemo for performance
  const filteredProducts = useMemo(() => {
    let result = mockProducts.filter(product => {
      // Filter by sale type
      if (saleParam === 'flash-sale' && !product.isFlashSale) return false;
      if (saleParam === 'today-deals' && !product.isTodayDeal) return false;

      // Filter by search
      if (searchQuery && !product.product_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filter by category
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category_id)) {
        return false;
      }

      // Filter by rating
      if (selectedRating > 0 && product.rating < selectedRating) {
        return false;
      }

      // Filter by price range
      const minPrice = priceRange.min ? parseInt(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseInt(priceRange.max) : Infinity;
      if (product.price < minPrice || product.price > maxPrice) return false;

      return true;
    });

    // Sort products
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'sold':
          return b.sold - a.sold;
        case 'newest':
        default:
          return b.product_id - a.product_id;
      }
    });

    return result;
  }, [searchQuery, selectedCategories, selectedRating, sortBy, priceRange, saleParam]);

  // Handlers
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedRating(0);
    setSortBy('newest');
    setPriceRange({ min: '', max: '' });
    setSearchParams({});
  };

  // Get page title
  const getPageTitle = () => {
    if (saleParam === 'flash-sale') return '⚡ Flash Sale';
    if (saleParam === 'today-deals') return '🔥 Gợi Ý Hôm Nay';
    if (categoryParam) {
      const cat = getCategoryById(categoryParam);
      return cat ? `${cat.icon} ${cat.category_name}` : 'Sản Phẩm';
    }
    if (searchParam) return `Kết quả tìm kiếm: "${searchParam}"`;
    return 'Tất Cả Sản Phẩm';
  };

  const styles = {
    page: {
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
      gap: '20px'
    },
    main: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    header: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '16px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    pageTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1F241F',
      margin: 0
    },
    resultCount: {
      fontSize: '14px',
      color: '#758173'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Sidebar Filter */}
        <FilterSidebar
          categories={mockCategories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onClearFilters={clearFilters}
        />

        {/* Main Content */}
        <main style={styles.main}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>{getPageTitle()}</h1>
            <span style={styles.resultCount}>
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          {/* Products Grid */}
          <ProductGrid products={filteredProducts} />
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;
