import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import API from "../api/api";
import { FaHeart } from "react-icons/fa";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";

import { useCartContext } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { cart, wishlist, addToCart, addToWishlist } = useCartContext();

  const inCart = useMemo(
    () => cart?.some((item) => item.productId?._id === id),
    [cart, id]
  );

  const inWishlist = useMemo(
    () => wishlist?.some((item) => item.productId?._id === id),
    [wishlist, id]
  );

  /** Load user from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch (err) {
      console.error("Failed to read user", err);
    }
  }, []);

  /** Load product */
  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Fetch product failed:", err);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id]);

  /** Snackbar helper */
  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  /** Ensure user is logged in before performing action */
  const requireUser = useCallback(() => {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  }, [user, navigate]);

  /** Add product to cart */
  const handleAddToCart = async () => {
    if (!requireUser()) return;
    setActionLoading(true);

    try {
      await addToCart(product);
      showSnackbar("Added to cart 🛒");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to add to cart", "error");
    } finally {
      setActionLoading(false);
    }
  };

  /** Add product to wishlist */
  const handleAddToWishlist = async () => {
    if (!requireUser()) return;
    setActionLoading(true);

    try {
      await addToWishlist(product);
      showSnackbar("Added to wishlist ❤️");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to add to wishlist", "error");
    } finally {
      setActionLoading(false);
    }
  };

  /** Loading state */
  if (loadingProduct)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  /** No product */
  if (!product)
    return (
      <Typography variant="h6" textAlign="center" mt={6} color="error">
        Product not found.
      </Typography>
    );

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        {product.name}
      </Typography>

      <Grid container spacing={4}>
        {/* PRODUCT IMAGE */}
        <Grid item xs={12} md={5}>
          <Card sx={{ boxShadow: 3 }}>
            <CardMedia
              component="img"
              height="350"
              image={product.imageUrl || "https://placehold.co/600x400?text=No+Image"}
              alt={product.name}
            />
          </Card>
        </Grid>

        {/* PRODUCT DETAILS */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">
                <strong>Price:</strong> ${product.price}
              </Typography>

              <Typography variant="body1" mt={1}>
                <strong>Category:</strong> {product.category}
              </Typography>

              <Typography variant="body1" mt={3} fontWeight="bold">
                Description:
              </Typography>

              <Typography variant="body2" mt={1} color="text.secondary">
                {product.description || "No description available."}
              </Typography>

              {/* ACTION BUTTONS */}
              <Box display="flex" gap={2} mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={inCart || actionLoading}
                  onClick={handleAddToCart}
                >
                  {inCart ? "In Cart 🛒" : "Add to Cart"}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<FaHeart />}
                  disabled={inWishlist || actionLoading}
                  onClick={handleAddToWishlist}
                >
                  {inWishlist ? "In Wishlist ❤️" : "Wishlist"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
