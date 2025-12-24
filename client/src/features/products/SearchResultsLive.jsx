// src/features/products/SearchResultsLive.jsx
import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import SearchBar from "../../shared/components/SearchBar";
import ProductGrid from "./ProductGrid";
import Loader from "../../shared/components/Loader";
import { searchProducts } from "./api";

export default function SearchResultsLive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  /* ---------------- Handle input ---------------- */

  const handleSearchChange = (value) => {
    setQuery(value);
    setSearchParams(value ? { q: value } : {});
  };

  /* ---------------- Fetch from DB ---------------- */

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchProducts(query.trim());
        setProducts(res || []);
      } catch {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Sync with URL query changes (e.g., searches triggered from the Navbar)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== (query || "")) {
      setQuery(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* ---------------- Render ---------------- */

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <SearchBar
        fullWidth
        autoFocus
        initialValue={query}
        onQueryChange={handleSearchChange}
        placeholder="Search for products..."
      />

      <Typography variant="h5" fontWeight={700} mt={3} mb={2}>
        {query ? `Search results for "${query}"` : "Search products"}
      </Typography>

      {loading ? (
        <Loader fullPage />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : products.length ? (
        <ProductGrid products={products} />
      ) : (
        <Typography color="text.secondary">
          {query
            ? `No products found for "${query}".`
            : "Start typing to search products."}
        </Typography>
      )}
    </Box>
  );
}
