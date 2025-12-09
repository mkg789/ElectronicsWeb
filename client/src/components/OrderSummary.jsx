import { Card, Typography, Stack, Divider, Button } from "@mui/material";
import { useCartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // ✅ import navigate

export default function OrderSummary() {
  const { cart, totalPrice } = useCartContext(); // Get cart data from context
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleCheckout = () => {
    if (cart.length === 0) return; // Prevent checkout if cart is empty
    navigate("/checkout"); // ✅ navigate to CheckoutPage
  };

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
          <Stack key={item._id} direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {item.productId.name} x {item.quantity}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              ${(item.productId.price * item.quantity).toFixed(2)}
            </Typography>
          </Stack>
        ))}

        {/* Shipping / Tax */}
        <Stack direction="row" justifyContent="space-between" mt={1}>
          <Typography variant="body2" color="text.secondary">
            Shipping
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            $5.00
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Estimated Tax
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            $0.00
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
          ${(totalPrice + 5).toFixed(2)}
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
        onClick={handleCheckout} // ✅ navigate to /checkout
        disabled={cart.length === 0} // Disable if cart is empty
      >
        Secure Checkout
      </Button>
    </Card>
  );
}
