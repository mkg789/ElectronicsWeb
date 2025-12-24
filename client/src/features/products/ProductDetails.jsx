import Grid from "../../shared/components/Grid2";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
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
  return (
    <Grid container spacing={4}>
      {/* Product Image */}
      <Grid xs={12} md={5}>
        <Card sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              {product.name}
            </Typography>

            <Typography variant="h6" mb={1}>
              <strong>Price:</strong> ${product.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" mb={2}>
              <strong>Category:</strong> {product.category || "N/A"}
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Description:
            </Typography>
            <Box
              sx={{
                color: "text.secondary",
                mb: 3,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {product.description || "No description available."}
            </Box>

            {/* Action Buttons */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              mt="auto"
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
