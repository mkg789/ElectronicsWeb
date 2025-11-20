import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyOrders from "./pages/MyOrders";
import CategoryPage from "./pages/CategoryPage.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import ProductPage from "./pages/ProductPage";
import { useState } from "react";

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
      <Route
        path="/orders"
        element={loggedIn ? <MyOrders /> : <Navigate to="/login" />}
      />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/category/:name" element={<CategoryPage />} />

      <Route path="/search" element={<SearchResults />} />

      <Route path="/product/:id" element={<ProductPage />} />

    </Routes>
  );
}

export default App;
