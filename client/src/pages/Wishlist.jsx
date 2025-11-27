import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
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
  Snackbar, // 🛑 ADDED for user feedback
  Stack, // 🛑 ADDED for layout control
} from "@mui/material";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // 🛑 State for Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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
      // Only run if user is loaded and not already loading
      if (!user) return; 
      setLoading(true);
      try {
        const res = await API.get("/wishlist");
        setWishlist(res.data);
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        // Better error handling: don't redirect if it's just a fetch error
        // Instead, show an error alert on the page.
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadWishlist();
    }
  }, [user]); // 🛑 Depend on user state

  // Remove item
  const removeFromWishlist = async (productId) => {
    try {
      await API.post("/wishlist/remove", { productId });
      setWishlist((prev) => prev.filter(item => item.productId._id !== productId)); // Optimistic UI update
      setSnackbarMessage("Item removed from your wishlist.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Remove wishlist error:", err);
      setSnackbarMessage("Failed to remove item.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Move to cart
  const moveToCart = async (productId) => {
    try {
      // 1. Add to cart
      await API.post("/cart/add", { productId });
      
      // 2. Remove from wishlist
      await API.post("/wishlist/remove", { productId });
      
      // 3. Update local state
      setWishlist((prev) => prev.filter(item => item.productId._id !== productId));
      
      // 4. Show success message (using Snackbar instead of alert)
      setSnackbarMessage("Product successfully moved to cart! 🛒");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (err) {
      console.error("Move to cart error:", err);
      setSnackbarMessage("Failed to move item to cart. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading || !user)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );

  return (
    // 🛑 Design Fix: Apply consistent page background and padding 🛑
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F0F2F5", // Matches CartPage background
        py: 6,
      }}
    >
      {/* Centering and max-width container */}
      <Box sx={{ maxWidth: "1200px", margin: "0 auto", px: 3 }}>

        <Typography variant="h3" fontWeight={700} mb={5} color="text.primary">
          {user ? `${user.name}'s Wishlist` : "Your Wishlist"}
        </Typography>

        {wishlist.length === 0 ? (
          // Empty Wishlist Design (consistent with CartPage empty state)
          <Box 
            textAlign="center" 
            py={10}
            sx={{ 
              backgroundColor: "white", 
              borderRadius: 4, 
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
             <i className="fas fa-heart" style={{ fontSize: 60, color: '#f44336', marginBottom: '16px' }}></i>
            <Typography variant="h5" fontWeight={600} color="text.secondary" mb={2}>
              Your wishlist is empty.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, borderRadius: 3, px: 4, py: 1.5, textTransform: "none" }}
              onClick={() => navigate("/")}
            >
              Start Browsing
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {wishlist.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                <Card sx={{ boxShadow: 3, borderRadius: 3, height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    // Placeholder for image loading error
                    image={item.productId.imageUrl || `https://placehold.co/400x180/E0E0E0/333?text=${item.productId.name.substring(0, 15)}`}
                    alt={item.productId.name}
                  />

                  <CardContent sx={{ height: 'auto' }}>
                    <Stack justifyContent="space-between" height="100%">
                      <Box>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {item.productId.name}
                        </Typography>

                        <Typography variant="body1" color="primary" fontWeight={700} mb={2}>
                          ${item.productId.price.toFixed(2)}
                        </Typography>
                      </Box>

                      <Box>
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          onClick={() => removeFromWishlist(item.productId._id)}
                          sx={{ mb: 1, borderRadius: 2 }}
                        >
                          Remove
                        </Button>

                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => moveToCart(item.productId._id)}
                          sx={{ borderRadius: 2 }}
                        >
                          Move to Cart 🛒
                        </Button>
                      </Box>
                    </Stack>
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
      
      {/* 🛑 Snackbar for notifications 🛑 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}