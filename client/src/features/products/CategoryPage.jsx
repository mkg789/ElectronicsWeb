import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Alert, Container, useTheme } from "@mui/material";
import { useCategoryProducts } from "./hooks";
import ProductGrid from "./ProductGrid";

export default function CategoryPage() {
  const { name } = useParams();
  const { products, loading } = useCategoryProducts(name);
  const theme = useTheme();

  if (loading)
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
      <Typography
        variant="h4"
        fontWeight={600}
        mb={3}
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
        <ProductGrid products={products} />
      )}
    </Container>
  );
}
