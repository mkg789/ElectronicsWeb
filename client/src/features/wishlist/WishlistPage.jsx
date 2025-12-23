import Grid from "../../shared/components/Grid2";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import useWishlist from "./useWishlist";

export default function WishlistPage() {
  const navigate = useNavigate();
  const {
    user,
    wishlist,
    loading,
    removeItem,
    moveToCart,
    snackbar,
    closeSnackbar,
  } = useWishlist();

  if (loading || !user) {
    return (
      <Box display="flex" justifyContent="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F0F2F5", py: 6 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3 }}>
        <Typography variant="h3" fontWeight={700} mb={5}>
          {user.name}'s Wishlist
        </Typography>

        {wishlist.length === 0 ? (
          <Box textAlign="center" py={10} bgcolor="white" borderRadius={4}>
            <Typography variant="h5" fontWeight={600} mb={2}>
              Your wishlist is empty
            </Typography>
            <Button variant="contained" onClick={() => navigate("/")}>
              Start Browsing
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {wishlist.map(item => (
              <Grid xs={12} sm={6} md={4} lg={3} key={item._id}>
                  <Card sx={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.productId.imageUrl || "/placeholder.svg"}
                    alt={item.productId.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.svg" }}
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography fontWeight={600} noWrap>
                        {item.productId.name}
                      </Typography>
                      <Typography fontWeight={700}>
                        ${item.productId.price.toFixed(2)}
                      </Typography>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeItem(item.productId._id)}
                      >
                        Remove
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => moveToCart(item.productId._id)}
                      >
                        Move to Cart
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Button sx={{ mt: 4 }} onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar}>
        <Alert severity={snackbar.severity} onClose={closeSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
