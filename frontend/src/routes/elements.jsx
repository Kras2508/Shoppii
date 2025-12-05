import { useRoutes } from 'react-router-dom'
import Layout from '../components/layouts/Layout'
import ShopLayout from '../components/layouts/ShopLayout'
import HomePage from '../pages/HomePage'
import SignInPage from '../pages/SignInPage'
import SignUpPage from '../pages/SignUpPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import ProductListPage from '../pages/ProductListPage'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import OrderConfirmationPage from '../pages/OrderConfirmationPage'
import OrderDetailPage from '../pages/OrderDetailPage'
import ProfilePage from '../pages/ProfilePage'
import ReviewPage from '../pages/ReviewPage'
import { ShopDashboardPage, ShopProductsPage, ProductFormPage, ShopSettingsPage, ShopReviewsPage, ShopOrdersPage } from '../pages/shop'
import { AdminLayout, AdminDashboard, AdminUsersPage, AdminShopsPage, AdminProductsPage, AdminOrdersPage, AdminReviewsPage } from '../pages/admin'

const useRouterElements = () => {
  const elements = useRoutes([
    {
      path: '/',
      element: <Layout><HomePage /></Layout>
    },
    {
      path: '/signin',
      element: <Layout><SignInPage /></Layout>
    },
    {
      path: '/signup',
      element: <Layout><SignUpPage /></Layout>
    },
    {
      path: '/products',
      element: <Layout><ProductListPage /></Layout>
    },
    {
      path: '/product/:id',
      element: <Layout><ProductDetailPage /></Layout>
    },
    {
      path: '/cart',
      element: <Layout><CartPage /></Layout>
    },
    {
      path: '/checkout',
      element: <Layout><CheckoutPage /></Layout>
    },
    {
      path: '/order/confirmation/:id',
      element: <Layout><OrderConfirmationPage /></Layout>
    },
    {
      path: '/order/:id',
      element: <Layout><OrderDetailPage /></Layout>
    },
    {
      path: '/review/:orderId',
      element: <Layout><ReviewPage /></Layout>
    },
    {
      path: '/profile',
      element: <Layout><ProfilePage /></Layout>
    },
    // Shop Management Routes
    {
      path: '/shop',
      element: <ShopLayout><ShopDashboardPage /></ShopLayout>
    },
    {
      path: '/shop/products',
      element: <ShopLayout><ShopProductsPage /></ShopLayout>
    },
    {
      path: '/shop/products/new',
      element: <ShopLayout><ProductFormPage /></ShopLayout>
    },
    {
      path: '/shop/products/:productId/edit',
      element: <ShopLayout><ProductFormPage /></ShopLayout>
    },
    {
      path: '/shop/products/:productId',
      element: <ShopLayout><ProductFormPage /></ShopLayout>
    },
    {
      path: '/shop/settings',
      element: <ShopLayout><ShopSettingsPage /></ShopLayout>
    },
    {
      path: '/shop/reviews',
      element: <ShopLayout><ShopReviewsPage /></ShopLayout>
    },
    {
      path: '/shop/orders',
      element: <ShopLayout><ShopOrdersPage /></ShopLayout>
    },
    // Admin Panel Routes
    {
      path: '/admin',
      element: <AdminLayout><AdminDashboard /></AdminLayout>
    },
    {
      path: '/admin/users',
      element: <AdminLayout><AdminUsersPage /></AdminLayout>
    },
    {
      path: '/admin/shops',
      element: <AdminLayout><AdminShopsPage /></AdminLayout>
    },
    {
      path: '/admin/products',
      element: <AdminLayout><AdminProductsPage /></AdminLayout>
    },
    {
      path: '/admin/orders',
      element: <AdminLayout><AdminOrdersPage /></AdminLayout>
    },
    {
      path: '/admin/reviews',
      element: <AdminLayout><AdminReviewsPage /></AdminLayout>
    }
  ])

  return elements
}

export default useRouterElements