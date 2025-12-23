import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Card, Button, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const [redirecting, setRedirecting] = useState(!order);

  // Automatically redirect if order is missing
  useEffect(() => {
    if (!order) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [order, navigate]);

  if (!order) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h6">No order found. Redirecting to home...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: 10 }}>
      <Card sx={{ p: 4, textAlign: "center" }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: "green", mb: 2 }} />
        <Typography variant="h4" fontWeight={700} mb={2}>
          Order Confirmed!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Your order has been successfully placed.
        </Typography>

        <Stack
          spacing={1}
          sx={{
            mb: 4,
            textAlign: "left",
            bgcolor: "#f5f5f5",
            p: 2,
            borderRadius: 2,
          }}
        >
          <Typography>
            <strong>Order ID:</strong> {order._id || "N/A"}
          </Typography>
          <Typography>
            <strong>Amount:</strong> ${Number(order.totalAmount || order.total || 0).toFixed(2)}
          </Typography>
          <Typography>
            <strong>Payment Status:</strong>{" "}
            {order.paymentStatus?.toUpperCase() || "UNKNOWN"}
          </Typography>
          <Typography>
            <strong>Payment Method:</strong>{" "}
            {order.paymentMethod?.toUpperCase() || "UNKNOWN"}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
          <Button variant="outlined" onClick={() => navigate("/orders")}>
            View Orders
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
