import { Box, Snackbar, Alert, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import HeroBanner from "./HeroBanner";
import CategoryStrip from "./CategoryStrip";
import FeaturedProducts from "./FeaturedProducts";
import useECommerceData from "./useECommerceData";
import { getProductBrand } from "../products/productUtils";

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

  const handleOpenProduct = useCallback(
    (id) => navigate(`/product/${id}`),
    [navigate]
  );
  const brands = [...new Set(products.map(getProductBrand).filter(Boolean))];

  return (
    <Box className="lux-page home-page">
      <Helmet>
        <title>Zyntrica – Premium Electronics</title>
        <meta
          name="description"
          content="Shop premium electronics, gadgets, and accessories at Zyntrica."
        />
        <meta property="og:title" content="Zyntrica – Premium Electronics" />
        <meta
          property="og:description"
          content="Shop premium electronics, gadgets, and accessories at Zyntrica."
        />
      </Helmet>

      {/* HERO BANNER */}
      <HeroBanner />

      <CategoryStrip categories={categories} loading={loading} />

      <FeaturedProducts
        products={products.slice(0, 8)}
        cart={cart}
        wishlist={wishlist}
        loading={loading}
        onAddToCart={addToCart}
        onUpdateQty={updateCartQuantity}
        onToggleWishlist={toggleWishlist}
        onOpenProduct={handleOpenProduct}
      />

      <Box component="section" className="lux-section brand-section" id="brands">
        <div className="lux-container">
          <div className="lux-section-heading">
            <div>
              <span className="lux-eyebrow">The names behind the technology</span>
              <Typography component="h2" className="lux-heading">Shop by brand</Typography>
            </div>
          </div>
          {brands.length > 0 ? (
            <div className="brand-list">
              {brands.map((brand) => (
                <button
                  type="button"
                  className="brand-tile"
                  key={brand}
                  onClick={() => navigate(`/products?brand=${encodeURIComponent(brand)}`)}
                >
                  {brand}
                  <span>Explore products&nbsp; →</span>
                </button>
              ))}
            </div>
          ) : (
            <Typography className="brand-data-note" color="text.secondary">
              Brand details will appear here when included in the product catalog.
            </Typography>
          )}
        </div>
      </Box>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar(prev => ({ ...prev, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          mb: { xs: 7, sm: 2 }, // above mobile bottom nav
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
