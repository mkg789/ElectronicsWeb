import { useMemo } from "react";
import { Box, Button, Card, CardContent, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../cart/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { cart, increaseQty, decreaseQty, isUpdating } = useCartContext();
  const cartItem = useMemo(
    () => cart?.find((item) => item.productId?._id === product._id),
    [cart, product._id]
  );
  const price = Number(product.price);

  const addToCart = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    increaseQty(product._id);
  };

  return (
    <Card className="lux-product-card">
      <Box
        className="product-image-wrap"
        role="link"
        tabIndex={0}
        aria-label={`View ${product.name}`}
        onClick={() => navigate(`/product/${product._id}`)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") navigate(`/product/${product._id}`);
        }}
      >
        <CardMedia
          component="img"
          image={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          loading="lazy"
          onError={(event) => { event.currentTarget.src = "/placeholder.svg"; }}
        />
      </Box>
      <CardContent className="lux-product-content">
        <Typography className="product-category" variant="caption">
          {product.category || "Electronics"}
        </Typography>
        <Typography className="product-name" component="h3" title={product.name}>
          {product.name}
        </Typography>
        <Typography className="product-price">
          {Number.isFinite(price) ? `$${price.toFixed(2)}` : "—"}
        </Typography>
        {cartItem ? (
          <Stack className="cart-quantity-control" direction="row" alignItems="center" justifyContent="space-between">
            <IconButton
              aria-label={`Remove one ${product.name}`}
              disabled={Boolean(isUpdating?.[product._id])}
              onClick={() => decreaseQty(product._id)}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography aria-live="polite">{cartItem.quantity}</Typography>
            <IconButton
              aria-label={`Add one ${product.name}`}
              disabled={Boolean(isUpdating?.[product._id])}
              onClick={addToCart}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        ) : (
          <Button
            className="product-add-button"
            fullWidth
            variant="outlined"
            startIcon={<ShoppingCartOutlinedIcon />}
            onClick={addToCart}
          >
            Add to bag
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
