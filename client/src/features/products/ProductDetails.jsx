import Grid from "../../shared/components/Grid2";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from "@mui/material";
import { FaHeart } from "react-icons/fa";

export default function ProductDetails({
  product,
  inCart,
  inWishlist,
  loading,
  onAddToCart,
  onAddToWishlist,
}) {
  const theme = useTheme();

  return (
    <Grid container spacing={4}>
      {/* Product Image */}
      <Grid xs={12} md={5}>
        <Card sx={{ height: "100%" }}>
          <CardMedia
            component="img"
            image={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.svg"; }}
            sx={{
              width: "100%",
              maxHeight: { xs: 300, md: 400 },
              objectFit: "contain",
            }}
          />
        </Card>
      </Grid>

      {/* Product Info */}
      <Grid xs={12} md={7}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} mb={2}>
              {product.name}
            </Typography>

            <Typography variant="h6" mb={1}>
              <strong>Price:</strong> ${product.price}
            </Typography>

            <Typography variant="body1" mb={3}>
              <strong>Category:</strong> {product.category}
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Description:
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 3, maxHeight: 200, overflowY: "auto" }}
            >
              {product.description || "No description available."}
            </Typography>

            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
            >
              <Button
                variant="contained"
                fullWidth
                disabled={inCart || loading}
                onClick={onAddToCart}
                sx={{ py: 1.5 }}
              >
                {inCart ? "In Cart 🛒" : "Add to Cart"}
              </Button>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<FaHeart />}
                disabled={inWishlist || loading}
                onClick={onAddToWishlist}
                sx={{ py: 1.5 }}
              >
                {inWishlist ? "In Wishlist ❤️" : "Wishlist"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
