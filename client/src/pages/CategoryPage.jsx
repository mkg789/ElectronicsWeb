import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/products/category/${name}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load category products:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [name]);

  return (
    <div className="category-container">
      <h2 className="category-title">{name} Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products available in this category.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div key={p._id} className="product-card">

              {/* Fixed-size image */}
              <div className="product-image-wrapper">
                <img src={p.imageUrl || "/placeholder.png"} alt={p.name} />
              </div>

              {/* Clickable product name */}
              <h3
                className="product-name"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                {p.name}
              </h3>

              <p className="price">${p.price}</p>

              <button
                className="buy-btn"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
