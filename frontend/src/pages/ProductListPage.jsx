import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar, ProductGrid } from './productList';
import { productService } from '../api/productService.js';
import { categoryService } from '../api/categoryService.js';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filters from URL
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search') || '';
  const saleParam = searchParams.get('sale');

  // State for fetched data
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategories, setSelectedCategories] = useState(
    categoryParam ? [parseInt(categoryParam)] : []
  );
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts({ limit: 100 })
        ]);

        setCategories(categoriesRes.data?.data?.flat || []);
        setProducts(productsRes.data?.data?.products || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products using useMemo for performance
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // Filter by search
      if (searchQuery && !product.product_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filter by category
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category_id)) {
        return false;
      }

      // Filter by rating
      if (selectedRating > 0 && product.avg_rating < selectedRating) {
        return false;
      }

      // Filter by price range
      const minPrice = priceRange.min ? parseInt(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseInt(priceRange.max) : Infinity;
      if (product.min_price < minPrice || product.max_price > maxPrice) return false;

      return true;
    });

    // Sort products
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.min_price || a.price || 0) - (b.min_price || b.price || 0);
        case 'price-desc':
          return (b.min_price || b.price || 0) - (a.min_price || a.price || 0);
        case 'rating-desc':
          return (b.avg_rating || 0) - (a.avg_rating || 0);
        case 'rating-asc':
          return (a.avg_rating || 0) - (b.avg_rating || 0);
        case 'sold':
          return (b.review_count || 0) - (a.review_count || 0);
        case 'newest':
        default:
          return b.product_id - a.product_id;
      }
    });

    return result;
  }, [searchQuery, selectedCategories, selectedRating, sortBy, priceRange, products]);

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
    if (categoryParam) {
      const cat = categories.find(c => c.category_id === parseInt(categoryParam));
      return cat ? `${cat.category_name}` : 'Sản Phẩm';
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

  if (loading) {
    return (
      <div style={{ ...styles.page, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.page, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Sidebar Filter */}
        <FilterSidebar
          categories={categories}
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
              {filteredProducts.length} products
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
