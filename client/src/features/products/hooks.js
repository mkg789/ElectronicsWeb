// features/products/hooks.js
import { useEffect, useState } from "react";
import {
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
  searchProducts,
} from "./api";

/**
 * Fetch all products
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    fetchProducts()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { products, loading, error };
}

/**
 * Fetch single product by ID
 */
export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    setLoading(true);
    fetchProductById(id)
      .then((data) => {
        if (mounted) setProduct(data);
      })
      .catch((err) => {
        console.error("Failed to fetch product", err);
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return { product, loading, error };
}

/**
 * Fetch products by category
 */
export function useCategoryProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;

    let mounted = true;

    setLoading(true);
    fetchProductsByCategory(category)
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch((err) => {
        console.error("Failed to fetch category products", err);
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [category]);

  return { products, loading, error };
}

/**
 * Search products
 */
export function useSearchProducts(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || !query.trim()) {
      setResults([]);
      return;
    }

    let mounted = true;

    setLoading(true);
    searchProducts(query)
      .then((data) => {
        if (mounted) setResults(data);
      })
      .catch((err) => {
        console.error("Product search failed", err);
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [query]);

  return { results, loading, error };
}
