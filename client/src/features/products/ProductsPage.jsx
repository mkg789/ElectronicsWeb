import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Container, Button } from "@mui/material";
import ProductGrid from "./ProductGrid";
import { fetchProducts } from "./api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      const res = await fetchProducts();
      setProducts(res || []);
      setError(null);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );

  if (error)
    return (
      <Container sx={{ py: { xs: 4, md: 6 }, textAlign: "center" }}>
        <Typography variant="h6" color="error" mb={2}>
          {error}
        </Typography>
        <Button variant="contained" onClick={loadProducts}>
          Retry
        </Button>
      </Container>
    );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
        textAlign={{ xs: "center", md: "left" }}
      >
        All Products
      </Typography>
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <Typography variant="body1" textAlign="center">
          No products available at the moment.
        </Typography>
      )}
    </Container>
  );
}
