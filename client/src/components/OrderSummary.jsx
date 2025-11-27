// src/components/OrderSummary.jsx (Visual Design Update)
import { Card, Typography, Stack, Divider, Button } from "@mui/material";
import { useCartContext } from "../context/CartContext";

export default function OrderSummary() {
  const { cart, totalPrice } = useCartContext(); // Get cart data from context

  const handleCheckout = () => {
    alert("Proceeding to checkout!");
    // navigate("/checkout")
  };

  return (
    <Card
      sx={{
        flex: 1.2, // Slightly wider than default 1
        height: "fit-content",
        p: 3,
        position: { md: "sticky" },
        top: 80, 
        borderRadius: 4, // Consistent large rounding
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={3}> {/* Larger title */}
        Order Summary
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Itemized List */}
      <Stack spacing={1.5} mb={3}>
        {cart.map((item) => (
          <Stack
            key={item._id}
            direction="row"
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary">
              {item.productId.name} x {item.quantity}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              ${(item.productId.price * item.quantity).toFixed(2)}
            </Typography>
          </Stack>
        ))}
        
        {/* Simple Shipping/Tax Example */}
        <Stack direction="row" justifyContent="space-between" mt={1}>
            <Typography variant="body2" color="text.secondary">Shipping</Typography>
            <Typography variant="body2" fontWeight={500}>$5.00</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Estimated Tax</Typography>
            <Typography variant="body2" fontWeight={500}>$0.00</Typography>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Grand Total - Strong Visual Hierarchy */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        mb={3}
        sx={{ 
            p: 1, 
            backgroundColor: '#e3f2fd', // Light blue background for emphasis
            borderRadius: 1 
        }} 
      >
        <Typography variant="h5" fontWeight={700}>
          Grand Total:
        </Typography>
        <Typography variant="h5" fontWeight={700} color="primary.dark">
          ${(totalPrice + 5).toFixed(2)} {/* Example calculation */}
        </Typography>
      </Stack>

      {/* Checkout Button - Prominent CTA */}
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
          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)", // Subtle button shadow
        }}
        onClick={handleCheckout}
      >
        Secure Checkout
      </Button>
    </Card>
  );
}