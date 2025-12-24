import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Alert, Container } from "@mui/material";
import { useCategoryProducts } from "./hooks";
import ProductGrid from "./ProductGrid";

export default function CategoryPage() {
  const { name } = useParams();
  const { products, loading } = useCategoryProducts(name);

  if (loading)
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
        textAlign={{ xs: "center", md: "left" }}
      >
        {name} Products
      </Typography>

      {products.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Alert severity="info" sx={{ width: "100%", maxWidth: 500 }}>
            No products found in this category.
          </Alert>
        </Box>
      ) : (
        <ProductGrid products={products} spacing={3} />
      )}
    </Container>
  );
}
