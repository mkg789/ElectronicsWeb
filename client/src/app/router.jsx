import { Routes, Route, Navigate } from "react-router-dom";

// Pages (temporary: still using existing pages/)
import HomePage from "../features/home/HomePage";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";

import ProductsPage from "../features/products/ProductsPage";
import CategoryPage from "../features/products/CategoryPage";
import SearchResults from "../features/products/SearchResultsLive";
import ProductPage from "../features/products/ProductPage"; // updated path

import WishlistPage from "../features/wishlist/WishlistPage";
import CartPage from "../features/cart/CartPage";
import CheckoutPage from "../features/cart/CheckoutPage";

import OrderHistoryPage from "../features/orders/OrderHistoryPage";
import OrderDetailsPage from "../features/orders/OrderDetailsPage";
import OrderSuccess from "../features/orders/OrderSuccess";

import { useAuth } from "../features/auth/AuthContext";
import PaymentPage from "../features/payments/PaymentPage";
import PaymentResult from "../features/payments/PaymentResult";

/* ---------------- Protected Route ---------------- */

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/* ---------------- Router ---------------- */

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/products" element={<ProductsPage />} />
      <Route path="/category/:name" element={<CategoryPage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/product/:id" element={<ProductPage />} />

      {/* Protected */}
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={<PaymentPage />}
      />
      <Route
        path="/payment-result"
        element={<PaymentResult />}
      />

      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute>
            <OrderDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/order-success" element={<OrderSuccess />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
