import { Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
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
    <>
      <Toaster position="top-right" expand={true} richColors />
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
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/products/create" element={<CreateProduct />} />
        <Route path="/seller/products/edit/:id" element={<EditProduct />} />
        <Route path="/seller/orders/:id/update" element={<SellerShippingUpdate />} />
        
        {/* User profile routes */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        
        {/* Communication & Utils */}
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/report/:id" element={<ReportView />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reports/:id" element={<AdminReportView />} />

        {/* 404 must be inside layout or outside? Usually inside or has its own layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </>
  );
}
