import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderData } = state || {};

  const [method, setMethod] = useState("card");

  // Guard
  if (!orderData) {
    navigate("/checkout");
    return null;
  }

  const handlePay = () => {
    // ✅ Dummy payment → always success
    navigate("/payment-result", {
      state: {
        success: true,
        paymentMethod: method,
        orderData,
      },
    });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Card sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Choose Payment Method
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Amount: ${orderData.total.toFixed(2)}
        </Typography>

        <RadioGroup
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <FormControlLabel value="card" control={<Radio />} label="Card" />
          <FormControlLabel value="upi" control={<Radio />} label="UPI" />
          <FormControlLabel
            value="netbanking"
            control={<Radio />}
            label="Net Banking"
          />
          <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
        </RadioGroup>

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="outlined" fullWidth onClick={() => navigate("/checkout")}>
            Back
          </Button>
          <Button variant="contained" fullWidth onClick={handlePay}>
            {method === "cod" ? "Confirm Order" : "Pay Now"}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
