import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CartShopGroup, CartCheckoutFooter, EmptyCart } from './cart';
import cartStyles from './cart/cartStyles';

const CartPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      productId: 1,
      name: 'Áo thun nam cotton cao cấp Premium',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      price: 129000,
      oldPrice: 299000,
      variant: { color: 'Trắng', size: 'L' },
      quantity: 2,
      stock: 99,
      shop: {
        id: 1,
        name: 'Cửa hàng Kim Tín'
      },
      selected: true
    },
    {
      id: 2,
      productId: 3,
      name: 'Giày thể thao nam sneaker',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      price: 449000,
      oldPrice: 899000,
      variant: { color: 'Đỏ', size: '42' },
      quantity: 1,
      stock: 50,
      shop: {
        id: 1,
        name: 'Cửa hàng Kim Tín'
      },
      selected: true
    },
    {
      id: 3,
      productId: 5,
      name: 'Đồng hồ thông minh smartwatch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      price: 599000,
      oldPrice: 1299000,
      variant: { color: 'Đen' },
      quantity: 1,
      stock: 30,
      shop: {
        id: 2,
        name: 'Tech Store VN'
      },
      selected: false
    }
  ]);

  const handleQuantityChange = (itemId, action) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          if (action === 'increase' && item.quantity < item.stock) {
            return { ...item, quantity: item.quantity + 1 };
          } else if (action === 'decrease' && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      })
    );
  };

  const handleSelectItem = (itemId) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = cartItems.every(item => item.selected);
    setCartItems(items =>
      items.map(item => ({ ...item, selected: !allSelected }))
    );
  };

  const handleSelectShop = (shopId) => {
    const shopItems = cartItems.filter(item => item.shop.id === shopId);
    const allShopSelected = shopItems.every(item => item.selected);
    setCartItems(items =>
      items.map(item =>
        item.shop.id === shopId ? { ...item, selected: !allShopSelected } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }
    
    const checkoutItems = selectedItems.map(item => ({
      item_id: item.id,
      product_id: item.productId,
      product_name: item.name,
      image_url: item.image,
      color: item.variant?.color || '',
      type: item.variant?.size || '',
      price: item.price,
      quantity: item.quantity,
      shop: {
        shop_id: item.shop.id,
        shop_name: item.shop.name
      }
    }));
    
    navigate('/checkout', { state: { items: checkoutItems } });
  };

  // Group items by shop
  const groupedByShop = cartItems.reduce((acc, item) => {
    const shopId = item.shop.id;
    if (!acc[shopId]) {
      acc[shopId] = {
        shop: item.shop,
        items: []
      };
    }
    acc[shopId].items.push(item);
    return acc;
  }, {});

  const selectedItems = cartItems.filter(item => item.selected);

  if (cartItems.length === 0) {
    return (
      <div style={cartStyles.page}>
        <div style={cartStyles.container}>
          <h1 style={cartStyles.pageTitle}>Giỏ Hàng</h1>
          <EmptyCart styles={cartStyles} />
        </div>
      </div>
    );
  }

  return (
    <div style={cartStyles.page}>
      <div style={cartStyles.container}>
        <h1 style={cartStyles.pageTitle}>Giỏ Hàng ({cartItems.length} sản phẩm)</h1>

        {/* Cart Header */}
        <div style={cartStyles.cartHeader}>
          <div></div>
          <div>Sản Phẩm</div>
          <div style={{ textAlign: 'center' }}>Đơn Giá</div>
          <div style={{ textAlign: 'center' }}>Số Lượng</div>
          <div style={{ textAlign: 'center' }}>Số Tiền</div>
          <div style={{ textAlign: 'center' }}>Thao Tác</div>
        </div>

        {/* Cart Items grouped by Shop */}
        {Object.values(groupedByShop).map(({ shop, items }) => (
          <CartShopGroup
            key={shop.id}
            shop={shop}
            items={items}
            onQuantityChange={handleQuantityChange}
            onSelect={handleSelectItem}
            onRemove={handleRemoveItem}
            onSelectShop={handleSelectShop}
            styles={cartStyles}
          />
        ))}
      </div>

      {/* Checkout Footer */}
      <CartCheckoutFooter
        cartItems={cartItems}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onCheckout={handleCheckout}
        styles={cartStyles}
      />
    </div>
  );
};

export default CartPage;
