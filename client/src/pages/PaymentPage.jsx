// src/pages/DummyPaymentPage.jsx
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function DummyPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};

  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Guard: no orderData means user navigated directly
  if (!orderData) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
        <Card sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error" mb={2}>
            No order data found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Please complete checkout first.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/checkout")}
          >
            Go to Checkout
          </Button>
        </Card>
      </Box>
    );
  }

  const handleOrder = async () => {
    setLoading(true);

    try {
      let paymentStatus =
        method === "cod" ? "pending" : "paid";

      let transactionId =
        method === "cod" ? "COD-" + Date.now() : "DUMMY-" + Date.now();

      // Save order in DB
      const res = await API.post("/orders/create-dummy", {
        cart: orderData.cart,
        shipping: orderData.shipping,
        billing: orderData.billing,
        total: orderData.total,
        paymentMethod: method,
        paymentStatus,
        transactionId,
      });

      // Clear cart after placing order
      await API.post("/cart/clear");

      navigate("/order-success", { state: { order: res.data.order } });
    } catch (err) {
      console.error("Order error:", err);
      alert(err.response?.data?.msg || "Order failed! Please try again.");
    }

    setLoading(false);
  };

  const isCOD = method === "cod";

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" mb={2} fontWeight={600}>
          Choose Payment Method
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Amount: ${orderData.total?.toFixed(2) || "0.00"}
        </Typography>

        <RadioGroup
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <FormControlLabel
            value="card"
            control={<Radio />}
            label="Credit / Debit Card"
          />
          <FormControlLabel
            value="upi"
            control={<Radio />}
            label="UPI (GPay / PhonePe / Paytm)"
          />
          <FormControlLabel
            value="netbanking"
            control={<Radio />}
            label="Net Banking"
          />
          <FormControlLabel
            value="cod"
            control={<Radio />}
            label="Cash on Delivery (COD)"
          />
        </RadioGroup>

        <Stack direction="row" spacing={2} mt={3}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/checkout")}
          >
            Back
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleOrder}
            disabled={loading}
          >
            {loading
              ? isCOD
                ? "Confirming Order..."
                : "Processing..."
              : isCOD
              ? "Confirm Order"
              : "Pay Now"}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
// Note: This is a dummy payment page for testing purposes only.