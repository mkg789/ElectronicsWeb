import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import { useMemo, useState } from "react";

import { useProduct } from "./hooks";
import ProductDetails from "./ProductDetails";
import { useCartContext } from "../cart/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProduct(id);
  const { cart, wishlist, addToCart, addToWishlist } = useCartContext();

  const [snackbar, setSnackbar] = useState({ open: false, msg: "", type: "info" });
  const [actionLoading, setActionLoading] = useState(false);

  const inCart = useMemo(() => cart?.some(i => i.productId?._id === id), [cart, id]);
  const inWishlist = useMemo(() => wishlist?.some(i => i.productId?._id === id), [wishlist, id]);

  const requireAuth = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleCart = async () => {
    if (!requireAuth()) return;
    setActionLoading(true);
    await addToCart(product);
    setSnackbar({ open: true, msg: "Added to cart 🛒", type: "success" });
    setActionLoading(false);
  };

  const handleWishlist = async () => {
    if (!requireAuth()) return;
    setActionLoading(true);
    await addToWishlist(product);
    setSnackbar({ open: true, msg: "Added to wishlist ❤️", type: "success" });
    setActionLoading(false);
  };

  // Loading state
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

  // Product not found
  if (!product)
    return (
      <Typography
        sx={{ mt: 6, textAlign: "center", color: "error.main" }}
        variant="h6"
      >
        Product not found
      </Typography>
    );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
      <Typography
        variant="h4"
        fontWeight={600}
        mb={3}
        textAlign={{ xs: "center", md: "left" }}
      >
        {product.name}
      </Typography>

      <ProductDetails
        product={product}
        inCart={inCart}
        inWishlist={inWishlist}
        loading={actionLoading}
        onAddToCart={handleCart}
        onAddToWishlist={handleWishlist}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.type} variant="filled">
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
