import "./HomePage.css";
import { FiSearch } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

const categories = [
  "Mobiles",
  "Laptops",
  "Accessories",
  "Audio",
  "Gaming",
  "Wearables",
  "Camera",
];

const products = [
  { id: 1, name: "iPhone 14 Pro", price: "$999", img: "https://via.placeholder.com/200" },
  { id: 2, name: "Samsung S23", price: "$799", img: "https://via.placeholder.com/200" },
  { id: 3, name: "Sony Headphones", price: "$199", img: "https://via.placeholder.com/200" },
  { id: 4, name: "Asus Gaming Laptop", price: "$1299", img: "https://via.placeholder.com/200" },
];

export default function HomePage() {
  const navigate = useNavigate(); // ✅ initialize navigate

  return (
    <div className="home-container">

      {/* ---------------- NAVBAR ---------------- */}
      <nav className="navbar">
        <h2 className="logo">Zyntrica</h2>

        <div className="nav-icons">
            <FiSearch className="icon" />

            {/* NEW PROFILE DROPDOWN */}
            <div className="profile-wrapper">
                <CgProfile className="icon profile-icon" />

                <div className="profile-menu">
                  <p className="menu-title">Welcome</p>
                  <button className="login-btn" onClick={() => navigate("/login")}>Login</button>

                  <hr />

                  <p className="menu-item">My Orders</p>
                  <p className="menu-item">Wishlist</p>
                  <p className="menu-item">Account Settings</p>
                  <p className="menu-item">Help Center</p>
                  <p className="menu-item">Logout</p>
                </div>
            </div>
        </div>

      </nav>

      {/* ---------------- SEARCH BAR ---------------- */}
      <div className="search-wrapper">
        <FiSearch className="search-icon-left" />
        <input
            type="text"
            className="search-input"
            placeholder="Search for products, brands and more..."
        />
        <button className="search-btn">Search</button>
      </div>

      {/* ---------------- CATEGORIES ---------------- */}
      <div className="category-scroll">
        {categories.map((cat) => (
          <button key={cat} className="category-btn">
            {cat}
          </button>
        ))}
      </div>

      {/* ---------------- HERO BANNER ---------------- */}
      <div className="hero">
        <h1>Latest Electronics, Best Prices</h1>
        <p>Get premium gadgets delivered to your door</p>
        <button className="shop-btn">Shop Now</button>
      </div>

      {/* ---------------- PRODUCT GRID ---------------- */}
      <h2 className="section-title">Trending Products</h2>
      <div className="product-grid">
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <p className="price">{item.price}</p>
            <button className="buy-btn">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}
