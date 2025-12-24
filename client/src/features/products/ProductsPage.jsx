import { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
} from "@mui/material";

import Loader from "../../shared/components/Loader";
import ProductGrid from "./ProductGrid";
import { fetchProducts } from "./api";

export default function ProductsPage() {
  const mountedRef = useRef(true);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchProducts();
      if (mountedRef.current) {
        setProducts(res || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      if (mountedRef.current) {
        setError("Failed to load products. Please try again.");
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadProducts();
    return () => {
      mountedRef.current = false;
    };
  }, [loadProducts]);

  /* ---------------- States ---------------- */

  if (loading) {
    return <Loader message="Loading products..." />;
  }

  if (error) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          py: { xs: 4, md: 6 },
          textAlign: "center",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h6"
          color="error.main"
          mb={2}
        >
          {error}
        </Typography>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={loadProducts}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      disableGutters
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 3, md: 5 },
      }}
    >
      {/* Header */}
      <Typography
        variant="h5"
        fontWeight={700}
        mb={{ xs: 2, md: 3 }}
        textAlign={{ xs: "center", md: "left" }}
      >
        All Products
      </Typography>

      {/* Content */}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <Box
          textAlign="center"
          py={{ xs: 4, md: 6 }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
          >
            No products available at the moment.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
