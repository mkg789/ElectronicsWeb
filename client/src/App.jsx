// src/App.jsx (with Protected Routes)

import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import Products from "./pages/products.jsx";
import CheckoutPage from "./pages/ChechoutPage.jsx";
import DummyPaymentPage from "./pages/PaymentPage.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import { useState } from "react";
import { CartProvider } from "./context/CartContext";

// --- ProtectedRoute Component ---
const ProtectedRoute = ({ element, loggedIn }) => {
  if (loggedIn) {
    return element;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <CartProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={<Login onLogin={() => setLoggedIn(true)} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* Protected Routes */}
        <Route
          path="/wishlist"
          element={<ProtectedRoute element={<Wishlist />} loggedIn={loggedIn} />}
        />
        <Route
          path="/cart"
          element={<ProtectedRoute element={<Cart />} loggedIn={loggedIn} />}
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute element={<DummyPaymentPage />} loggedIn={loggedIn} />
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute element={<CheckoutPage />} loggedIn={loggedIn} />
          }
        />
        {/* Order Details */}
        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute element={<OrderDetailsPage />} loggedIn={loggedIn} />
          }
        />

        {/* Order History */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute element={<OrderHistoryPage />} loggedIn={loggedIn} />
          }
        />


      </Routes>
    </CartProvider>
  );
}

export default App;