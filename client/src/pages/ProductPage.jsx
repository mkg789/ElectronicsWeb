import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  Grid
} from "@mui/material";

import { useCartContext } from "../context/CartContext"; // ✅ import cart context

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { cart, addToCart, addToWishlist } = useCartContext(); // ✅ use context

  const [user, setUser] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
    }
  }, []);

  // Fetch product
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  // Check if product is already in cart/wishlist
  useEffect(() => {
    if (!cart) return;
    setInCart(cart.some(item => item.productId._id === id));
    // Optional: if you store wishlist in cart context:
    // setInWishlist(wishlist.some(item => item.productId._id === id));
  }, [cart, id]);

  const showStatus = (msg) => {
    setStatusMsg(msg);
    setOpenSnackbar(true);
  };

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    setLoadingAction(true);
    try {
      await addToCart(product); // ✅ use context function
      showStatus("Added to cart 🛒");
    } catch (err) {
      console.error(err);
      showStatus("Failed to add to cart");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) return navigate("/login");
    setLoadingAction(true);
    try {
      await addToWishlist(product); // ✅ use context function
      showStatus("Added to wishlist ❤️");
    } catch (err) {
      console.error(err);
      showStatus("Failed to add to wishlist");
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!product)
    return (
      <Typography variant="h6" textAlign="center" mt={4} color="error">
        Product not found.
      </Typography>
    );

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        {product.name}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Card sx={{ boxShadow: 3 }}>
            <CardMedia
              component="img"
              height="350"
              image={product.imageUrl || "/placeholder.png"}
              alt={product.name}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ p: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6"><strong>Price:</strong> ${product.price}</Typography>
              <Typography variant="body1" mt={1}><strong>Category:</strong> {product.category}</Typography>
              <Typography variant="body1" mt={3} fontWeight="bold">Description:</Typography>
              <Typography variant="body2" mt={1} color="text.secondary">{product.description || "No description available."}</Typography>

              <Box display="flex" gap={2} mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={!product || loadingAction || inCart}
                >
                  {inCart ? "In Cart 🛒" : "Add to Cart 🛒"}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={handleAddToWishlist}
                  disabled={!product || loadingAction || inWishlist}
                  startIcon={<FaHeart />}
                >
                  {inWishlist ? "In Wishlist ❤️" : "Wishlist"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info" sx={{ width: "100%" }}>{statusMsg}</Alert>
      </Snackbar>
    </Box>
  );
}
