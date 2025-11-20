import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductPage.css";

import API from "../api";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-page-container" style={{ padding: "20px" }}>
      <h2>{product.name}</h2>
      <div className="product-page-content" style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        
        {/* Product Image */}
        <div className="product-image-wrapper" style={{ flex: "1 1 300px" }}>
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px" }}
          />
        </div>

        {/* Product Details */}
        <div className="product-details" style={{ flex: "2 1 400px" }}>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Description:</strong></p>
          <p style={{ whiteSpace: "pre-line" }}>{product.description || "No description available."}</p>
        </div>
      </div>
    </div>
  );
}
