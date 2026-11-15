import { Box, Button, CardMedia, IconButton, Typography } from "@mui/material";
import { FaHeart } from "react-icons/fa";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export default function ProductDetails({
  product,
  inCart,
  inWishlist,
  loading,
  quantity,
  onQuantityChange,
  onAddToCart,
  onAddToWishlist,
}) {
  const price = Number(product.price);

  return (
    <div className="product-detail-layout">
      <div className="product-gallery">
        <div className="product-gallery-main">
          <CardMedia
            component="img"
            image={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            onError={(event) => { event.currentTarget.src = "/placeholder.svg"; }}
          />
        </div>
      </div>

      <Box className="product-detail-info">
        <span className="lux-eyebrow">{product.category || "Electronics"}</span>
        <Typography component="h1" className="product-detail-title">{product.name}</Typography>
        <Typography className="product-detail-price">
          {Number.isFinite(price) ? `$${price.toFixed(2)}` : "Price unavailable"}
        </Typography>
        <div className="detail-rule" />
        <Typography className="detail-label">Product details</Typography>
        <Typography className="product-description">
          {product.description || "Product details have not been provided."}
        </Typography>

        <div className="product-specifications">
          <Typography className="detail-label">Specifications</Typography>
          <div className="product-spec-row">
            <span>Category</span>
            <strong>{product.category || "Not specified"}</strong>
          </div>
        </div>

        <div className="detail-quantity-row">
          <span className="detail-label">Quantity</span>
          <div className="detail-quantity-control">
            <IconButton
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <span aria-live="polite">{quantity}</span>
            <IconButton onClick={() => onQuantityChange(quantity + 1)} aria-label="Increase quantity">
              <AddIcon fontSize="small" />
            </IconButton>
          </div>
        </div>

        <div className="product-detail-actions">
          <Button
            variant="contained"
            startIcon={<ShoppingBagOutlinedIcon />}
            disabled={loading}
            onClick={onAddToCart}
          >
            {inCart ? "Add more to bag" : "Add to bag"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<FaHeart />}
            disabled={loading || inWishlist}
            onClick={onAddToWishlist}
          >
            {inWishlist ? "Saved to wishlist" : "Add to wishlist"}
          </Button>
        </div>
      </Box>
    </div>
  );
}
