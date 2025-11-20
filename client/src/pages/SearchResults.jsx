import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import "./ProductPage.css"; // reuse styling for product grid

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query && query.trim() !== "") {
      loadResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="category-container" style={{ padding: "20px" }}>
      <h2 className="category-title">Search Results for "{query}"</h2>

      {loading ? (
        <p>Loading results...</p>
      ) : results.length === 0 ? (
        <p>No products found for "{query}"</p>
      ) : (
        <div className="product-grid">
          {results.map((p) => (
            <div key={p._id} className="product-card">
              <div className="product-image-wrapper">
                <img
                  src={p.imageUrl || "/placeholder.png"}
                  alt={p.name}
                  loading="lazy"
                />
              </div>

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
