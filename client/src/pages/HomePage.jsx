import "./HomePage.css";
import { FiSearch } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api"; // Axios instance

export default function HomePage() {
  const navigate = useNavigate();

  // State hooks
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch all categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await API.get("/products/categories/all");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Search handler
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="home-container">

      {/* ---------------- NAVBAR ---------------- */}
      <nav className="navbar">
        <h2 className="logo">Zyntrica</h2>

        <div className="nav-icons">
          <FiSearch className="icon" />

          <div className="profile-wrapper" onClick={() => setMenuOpen(!menuOpen)}>
            <CgProfile className="icon profile-icon" />
            {menuOpen && (
              <div className="profile-menu">
                <p className="menu-title">Welcome</p>
                <button className="login-btn" onClick={() => navigate("/login")}>
                  Login
                </button>
                <hr />
                <p className="menu-item" onClick={() => navigate("/orders")}>My Orders</p>
                <p className="menu-item">Wishlist</p>
                <p className="menu-item">Account Settings</p>
                <p className="menu-item">Help Center</p>
                <p className="menu-item" onClick={() => alert("Logged out!")}>Logout</p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ---------------- SEARCH BAR ---------------- */}
      <div className="search-wrapper">
        <FiSearch className="search-icon-left" />
        <input
          type="text"
          className="search-input"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* ---------------- CATEGORIES ---------------- */}
      <div className="category-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            className="category-btn"
            onClick={() => navigate(`/category/${cat}`)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ---------------- HERO BANNER ---------------- */}
      <div className="hero">
        <h1>Latest Electronics, Best Prices</h1>
        <p>Get premium gadgets delivered to your door</p>
        <button className="shop-btn" onClick={() => navigate("/products")}>
          Shop Now
        </button>
      </div>

      {/* ---------------- PRODUCT GRID ---------------- */}
      <h2 className="section-title">Trending Products</h2>
      <div className="product-grid">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((item) => (
            <div key={item._id} className="product-card">

              {/* Fixed-size image */}
              <div className="product-image-wrapper">
                <img
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.name}
                  loading="lazy"
                />
              </div>

              {/* Clickable product name */}
              <h3
                className="product-name"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                {item.name}
              </h3>

              <p className="price">${item.price}</p>

              <button
                className="buy-btn"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                View
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
