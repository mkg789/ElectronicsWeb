import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CategoryPage from "./pages/CategoryPage.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import ProductPage from "./pages/ProductPage";
import { useState } from "react";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";


function App() {
  // Check if user is logged in via token
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={<Login onLogin={() => setLoggedIn(true)} />}
      />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/category/:name" element={<CategoryPage />} />

      <Route path="/search" element={<SearchResults />} />

      <Route path="/product/:id" element={<ProductPage />} />

      <Route path="/wishlist" element={<Wishlist />} />

      <Route path="/cart" element={<Cart />} />


    </Routes>
  );
}

export default App;
