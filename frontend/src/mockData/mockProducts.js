// Mock Categories - theo database schema
export const mockCategories = [
  { category_id: 1, category_name: 'Thời Trang Nam', icon: '👔' },
  { category_id: 2, category_name: 'Thời Trang Nữ', icon: '👗' },
  { category_id: 3, category_name: 'Điện Thoại & Phụ Kiện', icon: '📱' },
  { category_id: 4, category_name: 'Máy Tính & Laptop', icon: '💻' },
  { category_id: 5, category_name: 'Mỹ Phẩm', icon: '💄' },
  { category_id: 6, category_name: 'Nhà Cửa & Đời Sống', icon: '🏠' },
  { category_id: 7, category_name: 'Thể Thao & Du Lịch', icon: '⚽' },
  { category_id: 8, category_name: 'Đồ Chơi', icon: '🎮' },
  { category_id: 9, category_name: 'Giày Dép', icon: '👟' },
  { category_id: 10, category_name: 'Túi Xách', icon: '👜' },
  { category_id: 11, category_name: 'Đồng Hồ', icon: '⌚' },
  { category_id: 12, category_name: 'Sức Khỏe', icon: '💊' },
];

// Mock Products - theo database schema (Product + ProductItem)
export const mockProducts = [
  {
    product_id: 1,
    shop_id: 1,
    category_id: 1,
    product_name: 'Áo thun nam cotton cao cấp Premium',
    description: 'Áo thun chất liệu cotton 100%',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 129000,
    oldPrice: 299000,
    rating: 4.8,
    sold: 1234,
    isFlashSale: true,
    shop_name: 'Cửa hàng Kim Tín'
  },
  {
    product_id: 2,
    shop_id: 1,
    category_id: 1,
    product_name: 'Quần jean nam slim fit cao cấp',
    description: 'Quần jean co giãn thoải mái',
    image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 259000,
    oldPrice: 499000,
    rating: 4.9,
    sold: 876,
    isFlashSale: true,
    shop_name: 'Cửa hàng Kim Tín'
  },
  {
    product_id: 3,
    shop_id: 1,
    category_id: 9,
    product_name: 'Giày thể thao nam sneaker',
    description: 'Giày sneaker phong cách trẻ trung',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 449000,
    oldPrice: 899000,
    rating: 4.7,
    sold: 543,
    isFlashSale: true,
    shop_name: 'Cửa hàng Kim Tín'
  },
  {
    product_id: 4,
    shop_id: 2,
    category_id: 10,
    product_name: 'Túi xách nữ da PU cao cấp',
    description: 'Túi xách thời trang công sở',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 199000,
    oldPrice: 450000,
    rating: 4.6,
    sold: 2103,
    isFlashSale: true,
    shop_name: 'Fashion Store'
  },
  {
    product_id: 5,
    shop_id: 2,
    category_id: 11,
    product_name: 'Đồng hồ thông minh smartwatch',
    description: 'Smartwatch đa chức năng',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 599000,
    oldPrice: 1299000,
    rating: 4.9,
    sold: 654,
    isFlashSale: true,
    shop_name: 'Tech Store VN'
  },
  {
    product_id: 6,
    shop_id: 2,
    category_id: 3,
    product_name: 'Tai nghe bluetooth 5.0',
    description: 'Tai nghe không dây chất lượng cao',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 149000,
    oldPrice: 399000,
    rating: 4.5,
    sold: 3245,
    isFlashSale: true,
    shop_name: 'Tech Store VN'
  },
  {
    product_id: 7,
    shop_id: 1,
    category_id: 10,
    product_name: 'Balo laptop chống nước cao cấp',
    description: 'Balo đựng laptop 15.6 inch',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 229000,
    oldPrice: 499000,
    rating: 4.7,
    sold: 432,
    isTodayDeal: true,
    shop_name: 'Cửa hàng Kim Tín'
  },
  {
    product_id: 8,
    shop_id: 3,
    category_id: 5,
    product_name: 'Kem dưỡng da mặt vitamin C',
    description: 'Kem dưỡng trắng da',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 179000,
    oldPrice: 350000,
    rating: 4.8,
    sold: 876,
    isTodayDeal: true,
    shop_name: 'Beauty Shop'
  },
  {
    product_id: 9,
    shop_id: 1,
    category_id: 6,
    product_name: 'Bình giữ nhiệt inox 500ml',
    description: 'Bình giữ nhiệt cao cấp',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 99000,
    oldPrice: 199000,
    rating: 4.6,
    sold: 1543,
    isTodayDeal: true,
    shop_name: 'Cửa hàng Kim Tín'
  },
  {
    product_id: 10,
    shop_id: 2,
    category_id: 4,
    product_name: 'Chuột gaming RGB LED',
    description: 'Chuột chơi game chuyên nghiệp',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 129000,
    oldPrice: 299000,
    rating: 4.7,
    sold: 765,
    isTodayDeal: true,
    shop_name: 'Tech Store VN'
  },
  {
    product_id: 11,
    shop_id: 2,
    category_id: 3,
    product_name: 'Dây cáp sạc nhanh Type-C',
    description: 'Cáp sạc 65W siêu nhanh',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 39000,
    oldPrice: 99000,
    rating: 4.5,
    sold: 5432,
    isTodayDeal: true,
    shop_name: 'Tech Store VN'
  },
  {
    product_id: 12,
    shop_id: 2,
    category_id: 3,
    product_name: 'Ốp lưng điện thoại silicon',
    description: 'Ốp lưng chống sốc',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 29000,
    oldPrice: 79000,
    rating: 4.4,
    sold: 9876,
    isTodayDeal: true,
    shop_name: 'Tech Store VN'
  },
  {
    product_id: 13,
    shop_id: 1,
    category_id: 2,
    product_name: 'Váy đầm nữ công sở thanh lịch',
    description: 'Đầm công sở cao cấp',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 359000,
    oldPrice: 599000,
    rating: 4.8,
    sold: 234,
    shop_name: 'Cửa hàng Kim Tín'
  },
  {
    product_id: 14,
    shop_id: 3,
    category_id: 5,
    product_name: 'Son môi lì cao cấp chống nước',
    description: 'Son môi không trôi',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 89000,
    oldPrice: 199000,
    rating: 4.6,
    sold: 1876,
    shop_name: 'Beauty Shop'
  },
  {
    product_id: 15,
    shop_id: 1,
    category_id: 7,
    product_name: 'Bộ tạ tập gym tại nhà 20kg',
    description: 'Bộ tạ đa năng',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 450000,
    oldPrice: 750000,
    rating: 4.7,
    sold: 345,
    shop_name: 'Cửa hàng Kim Tín'
  },
  {
    product_id: 16,
    shop_id: 2,
    category_id: 8,
    product_name: 'Bộ xếp hình Lego 500 chi tiết',
    description: 'Đồ chơi xếp hình trí tuệ',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&h=300&fit=crop',
    status: 'In stock',
    price: 289000,
    oldPrice: 450000,
    rating: 4.9,
    sold: 567,
    shop_name: 'Tech Store VN'
  },
];

// Helper functions
export const getProductById = (id) => {
  return mockProducts.find(p => p.product_id === parseInt(id));
};

export const getProductsByCategory = (categoryId) => {
  return mockProducts.filter(p => p.category_id === parseInt(categoryId));
};

export const getFlashSaleProducts = () => {
  return mockProducts.filter(p => p.isFlashSale);
};

export const getTodayDeals = () => {
  return mockProducts.filter(p => p.isTodayDeal);
};

export const getCategoryById = (id) => {
  return mockCategories.find(c => c.category_id === parseInt(id));
};
