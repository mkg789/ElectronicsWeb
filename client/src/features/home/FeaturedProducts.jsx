import Grid from "../../shared/components/Grid2";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Button,
  Box,
  Stack,
  Skeleton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function FeaturedProducts({
  products,
  cart,
  wishlist,
  loading,
  onAddToCart,
  onUpdateQty,
  onToggleWishlist,
  onOpenProduct,
}) {
  const renderCartControls = (item) => {
    const cartItem = cart.find((c) => c.productId._id === item._id);

    if (!cartItem) {
      return (
        <Button
          size="small"
          fullWidth
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={() => onAddToCart(item._id)}
          sx={{ borderRadius: 2, mb: 1 }}
        >
          Add to Cart
        </Button>
      );
    }

    return (
      <Stack direction="row" spacing={1} justifyContent="center" mb={1}>
        <IconButton onClick={() => onUpdateQty(item._id, "remove")}>
          <RemoveIcon />
        </IconButton>
        <Typography fontWeight={700}>{cartItem.quantity}</Typography>
        <IconButton onClick={() => onUpdateQty(item._id, "add")}>
          <AddIcon />
        </IconButton>
      </Stack>
    );
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, maxWidth: 1200, mx: "auto", mt: 6, pb: 8 }}>
      <Typography variant="h5" fontWeight={700} mb={3} textAlign={{ xs: "center", md: "left" }}>
        Featured Products
      </Typography>

      <Grid container spacing={3}>
        {(loading ? Array.from({ length: 8 }) : products).map((item, i) => {
          if (loading) {
            return (
              <Grid xs={6} sm={4} md={3} key={i}>
                <Skeleton
                  variant="rectangular"
                  sx={{ borderRadius: 4, height: { xs: 200, sm: 250, md: 300 } }}
                />
              </Grid>
            );
          }

          const isWished = wishlist.some((w) => w.productId._id === item._id);

          const handleOpen = () => onOpenProduct(item._id);

          return (
            <Grid xs={6} sm={4} md={3} key={item._id}>
              <Card
                sx={{
                  borderRadius: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardMedia
                  component="img"
                  height={180}
                  image={item.imageUrl || "/placeholder.svg"}
                  onClick={handleOpen}
                  sx={{ cursor: "pointer" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.svg";
                  }}
                />

                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Box>
                    <Typography fontWeight={600} noWrap mb={0.5}>
                      {item.name}
                    </Typography>
                    <Typography fontWeight={700} color="primary" mb={1}>
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Box>

                  {renderCartControls(item)}

                  <IconButton
                    color="error"
                    onClick={() => onToggleWishlist(item)}
                    sx={{
                      width: "100%",
                      border: "1px solid #ccc",
                      justifyContent: "center",
                      py: 1,
                    }}
                  >
                    {isWished ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
