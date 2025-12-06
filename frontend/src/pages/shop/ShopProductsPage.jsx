import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shopStyles from './shopStyles';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import createPrivateClient from '../../clients/private.client';

const ShopProductsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getMyShopProducts(privateClient),
          categoryService.getCategories()
        ]);
        
        if (productsRes.data?.data?.products) {
          setProducts(productsRes.data.data.products.map(p => ({
            product_id: p.product_id,
            product_name: p.product_name,
            image: p.image,
            category: p.category_name,
            items: p.items || [], // Array of ProductItems
            item_count: p.item_count || 0,
            total_stock: p.total_stock || 0,
            total_sold: p.total_sold || 0,
            min_price: p.min_price || 0,
            max_price: p.max_price || 0,
            status: p.status,
            rating: p.avg_rating || 0
          })));
        }
        
        if (categoriesRes.data?.data) {
          const categoryList = categoriesRes.data.data.flat || categoriesRes.data.data.categories || [];
          setCategories(['All', ...categoryList.map(c => c.category_name)]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Cannot load products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, navigate]);

  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return { ...shopStyles.statusBadge, ...shopStyles.statusActive };
      case 'Inactive':
        return { ...shopStyles.statusBadge, ...shopStyles.statusInactive };
      case 'Out of Stock':
        return { ...shopStyles.statusBadge, ...shopStyles.statusOutOfStock };
      default:
        return shopStyles.statusBadge;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Active': return 'Đang bán';
      case 'Inactive': return 'Ngừng bán';
      case 'Out of Stock': return 'Hết hàng';
      default: return status;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await productService.deleteProduct(productToDelete.product_id, privateClient);
        setProducts(products.filter(p => p.product_id !== productToDelete.product_id));
        setShowDeleteModal(false);
        setProductToDelete(null);
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Cannot delete product. Please try again later.');
      }
    }
  };

  const toggleExpand = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  if (loading) {
    return (
      <div style={shopStyles.page}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p>Loading product list...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={shopStyles.page}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>❌</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={shopStyles.page}>
      <div style={shopStyles.container}>
        {/* Header */}
        <div style={shopStyles.pageHeader}>
          <div>
            <h1 style={shopStyles.pageTitle}>📦 Manage Products</h1>
            <p style={{ color: '#666', marginTop: '4px' }}>
              {products.length} products
            </p>
          </div>
          <Link to="/shop/products/new" style={{ textDecoration: 'none' }}>
            <button style={shopStyles.primaryBtn}>
              ➕ Add New Product
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div style={shopStyles.card}>
          <div style={shopStyles.filterRow}>
            <input
              type="text"
              placeholder="🔍 Search products..."
              style={shopStyles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              style={shopStyles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <select
              style={shopStyles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All categories</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div style={shopStyles.card}>
          {filteredProducts.length === 0 ? (
            <div style={shopStyles.emptyState}>
              <div style={shopStyles.emptyIcon}>📦</div>
              <p style={shopStyles.emptyText}>No products found</p>
              <Link to="/shop/products/new" style={{ textDecoration: 'none' }}>
                <button style={shopStyles.primaryBtn}>
                  Add new product
                </button>
              </Link>
            </div>
          ) : (
            <table style={shopStyles.table}>
              <thead style={shopStyles.tableHeader}>
                <tr>
                  <th style={shopStyles.th}>Product / Item</th>
                  <th style={shopStyles.th}>Color / Type</th>
                  <th style={shopStyles.th}>Price</th>
                  <th style={shopStyles.th}>Stock</th>
                  <th style={shopStyles.th}>Sold</th>
                  <th style={shopStyles.th}>Status</th>
                  <th style={shopStyles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const isExpanded = expandedProducts[product.product_id];
                  const hasItems = product.items && product.items.length > 0;
                  
                  return (
                    <React.Fragment key={product.product_id}>
                      {/* Main Product Row */}
                      <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                        <td style={shopStyles.td}>
                          <div style={shopStyles.productRow}>
                            {hasItems && (
                              <button
                                onClick={() => toggleExpand(product.product_id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  marginRight: '8px',
                                  padding: '0',
                                  transition: 'transform 0.2s'
                                }}
                                title={isExpanded ? 'Collapse items' : 'Expand items'}
                              >
                                {isExpanded ? '▼' : '▶'}
                              </button>
                            )}
                            <img
                              src={product.image}
                              alt={product.product_name}
                              style={shopStyles.productImage}
                            />
                            <div style={shopStyles.productInfo}>
                              <div style={shopStyles.productName}>{product.product_name}</div>
                              <div style={shopStyles.productCategory}>{product.category}</div>
                              <div style={{ fontSize: '12px', color: '#FFB800' }}>
                                ⭐ {product.rating}
                              </div>
                              {hasItems && (
                                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                                  {product.item_count} item{product.item_count > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={shopStyles.td}>
                          <span style={{ color: '#999', fontSize: '12px' }}>—</span>
                        </td>
                        <td style={shopStyles.td}>
                          <strong style={{ color: '#647A67' }}>
                            {product.min_price === product.max_price 
                              ? formatPrice(product.min_price)
                              : `${formatPrice(product.min_price)} - ${formatPrice(product.max_price)}`
                            }
                          </strong>
                        </td>
                        <td style={shopStyles.td}>
                          <strong>{product.total_stock}</strong>
                        </td>
                        <td style={shopStyles.td}>
                          <strong>{product.total_sold}</strong>
                        </td>
                        <td style={shopStyles.td}>
                          <span style={getStatusStyle(product.status)}>
                            {getStatusText(product.status)}
                          </span>
                        </td>
                        <td style={shopStyles.td}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                backgroundColor: '#f39c12',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onClick={() => navigate(`/shop/products/${product.product_id}/edit`)}
                              title="Edit product"
                            >
                              Edit
                            </button>
                            <button
                              style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onClick={() => handleDeleteClick(product)}
                              title="Delete product"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ProductItem Rows (Expandable) */}
                      {isExpanded && hasItems && product.items.map((item, idx) => (
                        <tr key={`${product.product_id}-item-${idx}`} style={{ backgroundColor: '#fff' }}>
                          <td style={{ ...shopStyles.td, paddingLeft: '60px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={`${item.color} ${item.type}`}
                                  style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                                />
                              )}
                              <span style={{ fontSize: '13px', color: '#666' }}>
                                Item #{idx + 1}
                              </span>
                            </div>
                          </td>
                          <td style={shopStyles.td}>
                            <div style={{ fontSize: '13px' }}>
                              <div><strong>Color:</strong> {item.color}</div>
                              <div><strong>Type:</strong> {item.type}</div>
                            </div>
                          </td>
                          <td style={shopStyles.td}>
                            <span style={{ color: '#647A67' }}>{formatPrice(item.price)}</span>
                          </td>
                          <td style={shopStyles.td}>
                            <span style={{ color: item.stock === 0 ? '#dc3545' : '#333' }}>
                              {item.stock}
                            </span>
                          </td>
                          <td style={shopStyles.td}>
                            <span style={{ color: '#28a745' }}>{item.sold || 0}</span>
                          </td>
                          <td style={shopStyles.td}>
                            <span style={{ fontSize: '12px', color: '#666' }}>—</span>
                          </td>
                          <td style={shopStyles.td}>
                            <span style={{ fontSize: '12px', color: '#999' }}>—</span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Back to Dashboard */}
        <div style={{ marginTop: '20px' }}>
          <Link to="/shop" style={{ color: '#647A67', textDecoration: 'none' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={shopStyles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div style={shopStyles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={shopStyles.modalTitle}> Confirm Deletion</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Are you sure you want to delete the product <strong>"{productToDelete?.product_name}"</strong>?
              <br />
              This action cannot be undone.
            </p>
            <div style={shopStyles.modalActions}>
              <button
                style={shopStyles.secondaryBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                style={shopStyles.dangerBtn}
                onClick={handleDeleteConfirm}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopProductsPage;
