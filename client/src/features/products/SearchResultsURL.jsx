// src/features/products/SearchResultsURL.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import ProductGrid from "./ProductGrid";
import Loader from "../../shared/components/Loader";
import { searchProducts } from "./api";

export default function SearchResultsURL() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q")?.trim() || "");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products whenever the query changes
  useEffect(() => {
    if (!query) {
      setProducts([]);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await searchProducts(query, { signal: controller.signal });
        setProducts(res || []);
      } catch (err) {
        if (err.name !== "AbortError") setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [query]);

  // Listen for searchTriggered events (from Navbar)
  useEffect(() => {
    const handleSearchEvent = (e) => {
      const newQuery = e.detail?.trim() || "";
      setQuery(newQuery);
    };

    window.addEventListener("searchTriggered", handleSearchEvent);
    return () => window.removeEventListener("searchTriggered", handleSearchEvent);
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Typography variant="h5" fontWeight={700} mt={3} mb={2}>
        {query ? `Search results for "${query}"` : "Search products"}
      </Typography>

      {loading ? (
        <Loader fullPage />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <Typography color="text.secondary">
          {query ? `No products found for "${query}".` : "Start typing to search products."}
        </Typography>
      )}
    </Box>
  );
}
