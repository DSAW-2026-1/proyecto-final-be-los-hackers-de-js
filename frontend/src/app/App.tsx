import { Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { HeroSection } from './components/HeroSection';
import { ProductsGrid } from './components/ProductsGrid';
import { ProductSearch } from './components/ProductSearch';
import { ProductDetail } from './components/ProductDetail';
import { CreateProduct } from './components/CreateProduct';
import { ShoppingCart } from './components/ShoppingCart';
import { Checkout } from './components/Checkout';
import { OrderHistory } from './components/OrderHistory';
import { BuyerShippingStatus } from './components/BuyerShippingStatus';
import { SellerShippingUpdate } from './components/SellerShippingUpdate';
import { LeaveReview } from './components/LeaveReview';
import { UserProfile } from './components/UserProfile';
import { EditProfile } from './components/EditProfile';
import { NotFound } from './components/NotFound';
import { SellerDashboard } from './components/SellerDashboard';
import { ChatInterface } from './components/ChatInterface';
import { Notifications } from './components/Notifications';
import { ReportView } from './components/ReportView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminReportView } from './components/AdminReportView';
import { EditProduct } from './components/EditProduct';
import { MainLayout } from './components/MainLayout';
import { AdminLogin } from  './components/AdminLogin.tsx'
import { ScrollToTop } from './components/ScrollToTop';

import { ProtectedRoute } from './components/ProtectedRoute';

function Home() {
  return (
    <>
      <HeroSection />
      <ProductsGrid />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" expand={true} richColors />
        <ScrollToTop>
          <Routes>
            {/* Main app routes with MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<ProductSearch />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/orders/:id/status" element={<BuyerShippingStatus />} />
              <Route path="/orders/:id/review" element={<LeaveReview />} />

              {/* Seller routes */}
              <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
              <Route path="/seller/products/create" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
              <Route path="/seller/products/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
              <Route path="/seller/orders/:id/update" element={<ProtectedRoute><SellerShippingUpdate /></ProtectedRoute>} />

              {/* User profile routes */}
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/profile/:uid" element={<UserProfile />} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />

              {/* Communication & Utils */}
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/report/:id" element={<ReportView />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/reports/:id" element={<AdminReportView />} />

              <Route path="/admin/login" element={<AdminLogin />} />

              {/* TODO: For now, 404 is fine here but the admin panel will use its own distinct layout. How do we handle that? */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ScrollToTop>
      </CartProvider>
    </AuthProvider>
  );
}
