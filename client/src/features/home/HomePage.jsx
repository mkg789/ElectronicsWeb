import { Box, Container, Snackbar, Alert } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HeroBanner from "./HeroBanner";
import CategoryStrip from "./CategoryStrip";
import FeaturedProducts from "./FeaturedProducts";
import useECommerceData from "./useECommerceData";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const {
    products,
    categories,
    cart,
    wishlist,
    loading,
    snackbar,
    setSnackbar,
    addToCart,
    updateCartQuantity,
    toggleWishlist,
  } = useECommerceData(user, navigate);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        pb: { xs: 6, md: 8 },
      }}
    >
      <Helmet>
        <title>Zyntrica – Premium Electronics</title>
        <meta
          name="description"
          content="Shop premium electronics, gadgets, and accessories at Zyntrica."
        />
      </Helmet>

      {/* HERO */}
      <HeroBanner />

      {/* MAIN CONTENT */}
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 },
          mt: { xs: 3, md: 5 },
        }}
      >
        {/* CATEGORIES */}
        <Box sx={{ mb: { xs: 3, md: 5 } }}>
          <CategoryStrip categories={categories} loading={loading} />
        </Box>

        {/* FEATURED PRODUCTS */}
        <FeaturedProducts
          products={products}
          cart={cart}
          wishlist={wishlist}
          loading={loading}
          onAddToCart={addToCart}
          onUpdateQty={updateCartQuantity}
          onToggleWishlist={toggleWishlist}
          onOpenProduct={(id) => navigate(`/product/${id}`)}
        />
      </Container>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        sx={{
          mb: { xs: 7, sm: 2 }, // avoids bottom nav overlap on mobile
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
