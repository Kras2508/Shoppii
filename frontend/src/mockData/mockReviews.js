// Mock Reviews data - theo database schema Review table
export const mockReviews = [
  // Product 1 - Áo thun nam
  {
    review_id: 1,
    product_id: 1,
    customer_id: 1,
    customer_name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment: 'Chất lượng vải rất tốt, mềm mại và thoáng mát. Đúng size luôn, mặc lên trông rất đẹp. Sẽ mua thêm màu khác!',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'
    ],
    attributes: ['quality', 'size'],
    created_at: '2024-11-25T10:30:00',
    is_anonymous: false
  },
  {
    review_id: 2,
    product_id: 1,
    customer_id: 2,
    customer_name: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4,
    comment: 'Áo đẹp, giao hàng nhanh. Màu hơi khác so với hình một chút nhưng vẫn chấp nhận được.',
    images: [],
    attributes: ['delivery'],
    created_at: '2024-11-20T15:45:00',
    is_anonymous: false
  },
  {
    review_id: 3,
    product_id: 1,
    customer_id: 3,
    customer_name: 'Khách hàng ẩn danh',
    avatar: null,
    rating: 5,
    comment: 'Mua lần 3 rồi, lần nào cũng hài lòng. Shop đóng gói cẩn thận.',
    images: [],
    attributes: ['quality', 'color', 'delivery'],
    created_at: '2024-11-18T09:20:00',
    is_anonymous: true
  },

  // Product 2 - Quần jean
  {
    review_id: 4,
    product_id: 2,
    customer_id: 4,
    customer_name: 'Lê Minh C',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    comment: 'Quần jean rất đẹp, co giãn thoải mái. Form slim fit chuẩn luôn!',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=200&h=200&fit=crop'
    ],
    attributes: ['quality', 'size', 'color'],
    created_at: '2024-11-22T14:00:00',
    is_anonymous: false
  },
  {
    review_id: 5,
    product_id: 2,
    customer_id: 5,
    customer_name: 'Phạm Thị D',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 4,
    comment: 'Chất lượng ổn so với giá tiền. Giao hàng hơi lâu 1 chút.',
    images: [],
    attributes: ['quality'],
    created_at: '2024-11-19T11:30:00',
    is_anonymous: false
  },

  // Product 3 - Giày sneaker
  {
    review_id: 6,
    product_id: 3,
    customer_id: 6,
    customer_name: 'Hoàng Văn E',
    avatar: 'https://i.pravatar.cc/150?img=7',
    rating: 5,
    comment: 'Giày đẹp quá trời! Mang rất êm chân, chạy bộ được luôn. Sẽ giới thiệu cho bạn bè.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop'
    ],
    attributes: ['quality', 'size', 'color', 'delivery'],
    created_at: '2024-11-28T16:45:00',
    is_anonymous: false
  },
  {
    review_id: 7,
    product_id: 3,
    customer_id: 7,
    customer_name: 'Nguyễn Thị F',
    avatar: 'https://i.pravatar.cc/150?img=10',
    rating: 4,
    comment: 'Giày nhẹ, thoáng khí. Đế hơi mỏng nhưng overall rất ổn.',
    images: [],
    attributes: ['quality', 'delivery'],
    created_at: '2024-11-15T08:20:00',
    is_anonymous: false
  },

  // Product 4 - Túi xách
  {
    review_id: 8,
    product_id: 4,
    customer_id: 8,
    customer_name: 'Trần Thị G',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    comment: 'Túi đẹp lắm, da mềm, đựng được nhiều đồ. Mang đi làm rất sang!',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop'
    ],
    attributes: ['quality', 'color'],
    created_at: '2024-11-26T10:00:00',
    is_anonymous: false
  },

  // Product 5 - Smartwatch
  {
    review_id: 9,
    product_id: 5,
    customer_id: 9,
    customer_name: 'Lê Văn H',
    avatar: 'https://i.pravatar.cc/150?img=4',
    rating: 5,
    comment: 'Đồng hồ xịn quá! Pin trâu, đo nhịp tim chính xác. Giá quá hời!',
    images: [],
    attributes: ['quality', 'delivery'],
    created_at: '2024-11-27T20:30:00',
    is_anonymous: false
  },
  {
    review_id: 10,
    product_id: 5,
    customer_id: 10,
    customer_name: 'Khách hàng ẩn danh',
    avatar: null,
    rating: 5,
    comment: 'Dùng được 2 tuần rồi, rất hài lòng. Kết nối bluetooth ổn định.',
    images: [],
    attributes: ['quality'],
    created_at: '2024-11-24T13:15:00',
    is_anonymous: true
  },

  // Product 6 - Tai nghe
  {
    review_id: 11,
    product_id: 6,
    customer_id: 11,
    customer_name: 'Phạm Minh I',
    avatar: 'https://i.pravatar.cc/150?img=6',
    rating: 4,
    comment: 'Âm thanh tốt, bass mạnh. Hơi nóng tai khi đeo lâu.',
    images: [],
    attributes: ['quality'],
    created_at: '2024-11-23T17:45:00',
    is_anonymous: false
  },

  // Product 7 - Váy đầm
  {
    review_id: 12,
    product_id: 7,
    customer_id: 12,
    customer_name: 'Nguyễn Thị K',
    avatar: 'https://i.pravatar.cc/150?img=11',
    rating: 5,
    comment: 'Váy đẹp xuất sắc, vải mềm mát, mặc đi tiệc rất hợp!',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop'
    ],
    attributes: ['quality', 'color', 'size'],
    created_at: '2024-11-29T11:00:00',
    is_anonymous: false
  },

  // Product 8 - Son môi
  {
    review_id: 13,
    product_id: 8,
    customer_id: 13,
    customer_name: 'Trần Thị L',
    avatar: 'https://i.pravatar.cc/150?img=16',
    rating: 5,
    comment: 'Màu đẹp lắm, lên môi chuẩn màu, bám lâu không khô môi.',
    images: [],
    attributes: ['quality', 'color'],
    created_at: '2024-11-21T14:30:00',
    is_anonymous: false
  },
  {
    review_id: 14,
    product_id: 8,
    customer_id: 14,
    customer_name: 'Lê Thị M',
    avatar: 'https://i.pravatar.cc/150?img=17',
    rating: 4,
    comment: 'Son xịn, đóng gói cẩn thận. Màu hơi nhạt hơn hình một tí.',
    images: [],
    attributes: ['quality', 'delivery'],
    created_at: '2024-11-17T09:00:00',
    is_anonymous: false
  }
];

// Helper function to get reviews by product ID
export const getReviewsByProductId = (productId) => {
  return mockReviews.filter(review => review.product_id === productId);
};

// Helper function to get average rating
export const getAverageRating = (productId) => {
  const productReviews = getReviewsByProductId(productId);
  if (productReviews.length === 0) return 0;
  const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / productReviews.length).toFixed(1);
};

// Helper function to get review count
export const getReviewCount = (productId) => {
  return getReviewsByProductId(productId).length;
};

// Helper function to get rating distribution
export const getRatingDistribution = (productId) => {
  const productReviews = getReviewsByProductId(productId);
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  productReviews.forEach(review => {
    distribution[review.rating]++;
  });
  return distribution;
};

export default mockReviews;
