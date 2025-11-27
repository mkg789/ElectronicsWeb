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

import { useState } from "react";
import { CartProvider } from "./context/CartContext"; // ✅ Add provider

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

        {/* Protected Routes */}
        <Route
          path="/wishlist"
          element={<ProtectedRoute element={<Wishlist />} loggedIn={loggedIn} />}
        />
        <Route
          path="/cart"
          element={<ProtectedRoute element={<Cart />} loggedIn={loggedIn} />}
        />

        {/* Optional 404 */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </CartProvider>
  );
}

export default App;
