import Grid from "../../shared/components/Grid2";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link } from "react-router-dom";
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
  return (
    <Box component="section" className="lux-section featured-section">
      <div className="lux-container">
        <div className="lux-section-heading">
          <div>
            <span className="lux-eyebrow">Selected for you</span>
            <Typography component="h2" className="lux-heading">Featured products</Typography>
          </div>
          <Link className="lux-link" to="/products">View the collection&nbsp; →</Link>
        </div>

        <Grid container spacing={2}>
          {(loading ? Array.from({ length: 8 }) : products).map((item, index) => {
            if (loading) {
              return (
                <Grid xs={6} sm={4} md={3} key={`loading-${index}`}>
                  <Skeleton variant="rounded" className="product-card-skeleton" />
                </Grid>
              );
            }

            const cartItem = cart.find((entry) => entry.productId?._id === item._id);
            const isWished = wishlist.some((entry) => entry.productId?._id === item._id);
            const price = Number(item.price);

            return (
              <Grid xs={6} sm={4} md={3} key={item._id}>
                <Card className="lux-product-card">
                  <div className="product-image-wrap" onClick={() => onOpenProduct(item._id)}>
                    <span className="product-badge">Featured</span>
                    <IconButton
                      className={`product-favorite${isWished ? " is-active" : ""}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleWishlist(item);
                      }}
                      aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isWished ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                    </IconButton>
                    <CardMedia
                      component="img"
                      image={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      loading="lazy"
                      onError={(event) => { event.currentTarget.src = "/placeholder.svg"; }}
                    />
                  </div>
                  <CardContent className="lux-product-content">
                    <Typography className="product-category" variant="caption">
                      {item.category || "Electronics"}
                    </Typography>
                    <Typography
                      className="product-name"
                      onClick={() => onOpenProduct(item._id)}
                      title={item.name}
                    >
                      {item.name}
                    </Typography>
                    <Typography className="product-price">
                      {Number.isFinite(price) ? `$${price.toFixed(2)}` : "—"}
                    </Typography>
                    {cartItem ? (
                      <Stack className="cart-quantity-control" direction="row" alignItems="center" justifyContent="space-between">
                        <IconButton aria-label="Remove one" onClick={() => onUpdateQty(item._id, "remove")}><RemoveIcon fontSize="small" /></IconButton>
                        <Typography>{cartItem.quantity}</Typography>
                        <IconButton aria-label="Add one" onClick={() => onUpdateQty(item._id, "add")}><AddIcon fontSize="small" /></IconButton>
                      </Stack>
                    ) : (
                      <Button
                        className="product-add-button"
                        fullWidth
                        variant="outlined"
                        startIcon={<ShoppingCartOutlinedIcon />}
                        onClick={() => onAddToCart(item._id)}
                      >
                        Add to bag
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </Box>
  );
}
