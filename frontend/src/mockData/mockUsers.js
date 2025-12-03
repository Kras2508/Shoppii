// Mock data for testing - 3 test accounts (Customer, Shop & Admin)
// Khớp với database schema: Account, Customer, Shop, Admin tables

export const mockUsers = {
  // Customer Account - theo bảng Account + Customer
  customer: {
    // Account fields
    account_id: 1,
    email: 'customer@gmail.com',
    password: '123',
    role: 'Customer', // ENUM('Customer','Shop','Admin')
    full_name: 'Nguyễn Văn A',
    phone: '0901234567',
    status: 'Active', // ENUM('Active','Ban')
    created_at: '2024-01-15',
    
    // Customer fields
    customer_id: 1,
    address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    add_phone: '0909123456',
    total_spent: 1500000,
    total_order: 5,
    
    // For frontend display
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer',
    token: 'mock_token_customer_12345',
  },

  // Shop Account - theo bảng Account + Shop
  shop: {
    // Account fields
    account_id: 2,
    email: 'shop@gmail.com',
    password: '123',
    role: 'Shop', // ENUM('Customer','Shop','Admin')
    full_name: 'Trần Văn B',
    phone: '0902345678',
    status: 'Active',
    created_at: '2024-02-20',
    
    // Shop fields
    shop_id: 1,
    shop_name: 'Cửa hàng Kim Tín',
    shop_phone: '0283456789',
    address_shop: '456 Đường Lê Lợi, Quận 1, TP.HCM',
    rating: 5, // CHECK (rating BETWEEN 0 AND 5)
    shop_status: 'Open', // ENUM('Open','Temporarily Close','Closed')
    
    // For frontend display
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shop',
    token: 'mock_token_shop_12345',
  },

  // Admin Account - theo bảng Account + Admin
  admin: {
    // Account fields
    account_id: 3,
    email: 'admin@gmail.com',
    password: '123',
    role: 'Admin', // ENUM('Customer','Shop','Admin')
    full_name: 'System Admin',
    phone: '0903456789',
    status: 'Active',
    created_at: '2024-01-01',
    
    // Admin fields
    admin_id: 1,
    admin_role: 'Super Admin', // Có thể là Super Admin, Moderator, etc.
    note: 'Tài khoản quản trị hệ thống',
    
    // For frontend display
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    token: 'mock_token_admin_12345',
  },
};

/**
 * Simulates login with mock data
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} User data and token if credentials match
 */
export const mockLogin = (email, password) => {
  // Check customer account
  if (
    email === mockUsers.customer.email &&
    password === mockUsers.customer.password
  ) {
    const { password: _, ...userWithoutPassword } = mockUsers.customer;
    return {
      user: userWithoutPassword,
      token: mockUsers.customer.token,
      success: true,
    };
  }

  // Check shop account
  if (
    email === mockUsers.shop.email &&
    password === mockUsers.shop.password
  ) {
    const { password: _, ...userWithoutPassword } = mockUsers.shop;
    return {
      user: userWithoutPassword,
      token: mockUsers.shop.token,
      success: true,
    };
  }

  // Check admin account
  if (
    email === mockUsers.admin.email &&
    password === mockUsers.admin.password
  ) {
    const { password: _, ...userWithoutPassword } = mockUsers.admin;
    return {
      user: userWithoutPassword,
      token: mockUsers.admin.token,
      success: true,
    };
  }

  // Invalid credentials
  return {
    success: false,
    error: 'Email hoặc mật khẩu không chính xác',
  };
};

/**
 * Get all mock users (for development/testing purposes)
 */
export const getMockCredentials = () => {
  return [
    {
      type: 'Customer',
      email: mockUsers.customer.email,
      password: mockUsers.customer.password,
    },
    {
      type: 'Shop',
      email: mockUsers.shop.email,
      password: mockUsers.shop.password,
    },
    {
      type: 'Admin',
      email: mockUsers.admin.email,
      password: mockUsers.admin.password,
    },
  ];
};

// Mock Shipping options - theo bảng Shipping
export const mockShippingOptions = [
  {
    shipping_id: 1,
    name: 'Giao hàng tiêu chuẩn',
    estimated_days: 5,
    fee: 30000,
    status: 'Active'
  },
  {
    shipping_id: 2,
    name: 'Giao hàng nhanh',
    estimated_days: 2,
    fee: 50000,
    status: 'Active'
  },
  {
    shipping_id: 3,
    name: 'Giao hỏa tốc',
    estimated_days: 1,
    fee: 80000,
    status: 'Active'
  }
];

// Mock Vouchers - theo bảng Voucher
export const mockVouchers = [
  {
    voucher_id: 1,
    code: 'GIAM10',
    discount_type: 'Percentage', // ENUM('Percentage','Amount')
    discount_value: 10,
    min_order_value: 200000,
    expired_date: '2025-12-31',
    usage_limit: 100,
    used_count: 45,
    status: 'Active' // ENUM('Active','Expired')
  },
  {
    voucher_id: 2,
    code: 'GIAM50K',
    discount_type: 'Amount',
    discount_value: 50000,
    min_order_value: 500000,
    expired_date: '2025-12-31',
    usage_limit: 50,
    used_count: 20,
    status: 'Active'
  },
  {
    voucher_id: 3,
    code: 'FREESHIP',
    discount_type: 'Amount',
    discount_value: 30000,
    min_order_value: 100000,
    expired_date: '2025-12-31',
    usage_limit: 200,
    used_count: 150,
    status: 'Active'
  }
];

// Mock Categories - theo bảng Category
export const mockCategories = [
  { category_id: 1, category_name: 'Thời Trang Nam', parent_category_id: null },
  { category_id: 2, category_name: 'Thời Trang Nữ', parent_category_id: null },
  { category_id: 3, category_name: 'Điện Tử', parent_category_id: null },
  { category_id: 4, category_name: 'Áo Thun', parent_category_id: 1 },
  { category_id: 5, category_name: 'Quần Jean', parent_category_id: 1 },
  { category_id: 6, category_name: 'Váy Đầm', parent_category_id: 2 },
  { category_id: 7, category_name: 'Điện Thoại', parent_category_id: 3 },
  { category_id: 8, category_name: 'Phụ Kiện', parent_category_id: 3 },
];
