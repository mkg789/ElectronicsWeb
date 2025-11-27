import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (!saved) return navigate("/login");
      setUser(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to parse user:", err);
      navigate("/login");
    }
  }, [navigate]);

  // Fetch wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const res = await API.get("/wishlist");
        setWishlist(res.data);
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [navigate]);

  // Remove item
  const removeFromWishlist = async (productId) => {
    try {
      await API.post("/wishlist/remove", { productId });
      const res = await API.get("/wishlist");
      setWishlist(res.data);
    } catch (err) {
      console.error("Remove wishlist error:", err);
    }
  };

  // Move to cart
  const moveToCart = async (productId) => {
    try {
      await API.post("/cart/add", { productId });
      await API.post("/wishlist/remove", { productId });
      const res = await API.get("/wishlist");
      setWishlist(res.data);
      alert("Moved to cart!");
    } catch (err) {
      console.error("Move to cart error:", err);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        {user ? `${user.name}'s Wishlist` : "Wishlist"}
      </Typography>

      {wishlist.length === 0 ? (
        <Alert severity="info" sx={{ mt: 3 }}>
          Your wishlist is empty.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.productId.imageUrl || "/placeholder.png"}
                  alt={item.productId.name}
                />

                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {item.productId.name}
                  </Typography>

                  <Typography variant="body1" color="primary" mb={2}>
                    ${item.productId.price}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => removeFromWishlist(item.productId._id)}
                    sx={{ mb: 1 }}
                  >
                    Remove
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => moveToCart(item.productId._id)}
                  >
                    Move to Cart 🛒
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Button
        variant="text"
        sx={{ mt: 4 }}
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </Button>
    </Box>
  );
}
