import Grid from "../../shared/components/Grid2";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Loader from "../../shared/components/Loader";
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
    return <Loader fullPage message="Loading wishlist..." />;
  }

  return (
    <Box sx={{ minHeight: "100svh", bgcolor: "grey.100", py: { xs: 4, sm: 6 } }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Typography
          variant="h4"
          fontWeight={700}
          mb={4}
        >
          {user.name}'s Wishlist
        </Typography>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <Box
            textAlign="center"
            py={8}
            px={2}
            bgcolor="background.paper"
            borderRadius={3}
          >
            <Typography variant="h6" fontWeight={600} mb={1}>
              Your wishlist is empty
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={3}
            >
              Save items you love and come back to them later.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
            >
              Start Browsing
            </Button>
          </Box>
        ) : (
          <>
            {/* Grid */}
            <Grid container spacing={3}>
              {wishlist.map((item) => {
                const product = item.productId;

                return (
                  <Grid
                    key={item._id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/product/${product._id}`)}
                      />

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Stack spacing={1.5}>
                          <Typography fontWeight={600} noWrap>
                            {product.name}
                          </Typography>

                          <Typography fontWeight={700}>
                            ${product.price.toFixed(2)}
                          </Typography>

                          <Stack spacing={1} mt={1}>
                            <Button
                              variant="contained"
                              onClick={() => moveToCart(product._id)}
                            >
                              Move to Cart
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => removeItem(product._id)}
                            >
                              Remove
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Back */}
            <Button
              sx={{ mt: 4 }}
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </Button>
          </>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={closeSnackbar}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
