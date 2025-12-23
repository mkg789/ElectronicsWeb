import { Card, Typography, Stack, Divider, Button } from "@mui/material";
import { useCartContext } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";

export default function OrderSummary() {
  const { cart, totalPrice } = useCartContext();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) return; // Prevent checkout if cart is empty
    navigate("/checkout");
  };

  const SHIPPING_COST = 5.0;
  const TAX_ESTIMATE = 0.0;
  const grandTotal = totalPrice + SHIPPING_COST + TAX_ESTIMATE;

  return (
    <Card
      sx={{
        flex: 1.2,
        height: "fit-content",
        p: 3,
        position: { md: "sticky" },
        top: 80,
        borderRadius: 4,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={3}>
        Order Summary
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Itemized List */}
      <Stack spacing={1.5} mb={3}>
        {cart.map((item) => (
          <Stack key={item.productId._id} direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {item.productId.name} x {item.quantity}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              ${(item.productId.price * item.quantity).toFixed(2)}
            </Typography>
          </Stack>
        ))}

        {/* Shipping & Tax */}
        <Stack direction="row" justifyContent="space-between" mt={1}>
          <Typography variant="body2" color="text.secondary">
            Shipping
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            ${SHIPPING_COST.toFixed(2)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Estimated Tax
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            ${TAX_ESTIMATE.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Grand Total */}
      <Stack
        direction="row"
        justifyContent="space-between"
        mb={3}
        sx={{
          p: 1,
          backgroundColor: "#e3f2fd",
          borderRadius: 1,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Grand Total:
        </Typography>
        <Typography variant="h5" fontWeight={700} color="primary.dark">
          ${grandTotal.toFixed(2)}
        </Typography>
      </Stack>

      {/* Checkout Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          borderRadius: 3,
          py: 1.5,
          fontSize: "1.1rem",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
        }}
        onClick={handleCheckout}
        disabled={cart.length === 0}
      >
        Secure Checkout
      </Button>
    </Card>
  );
}
