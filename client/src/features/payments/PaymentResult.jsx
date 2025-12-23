import { useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { useCartContext } from "../cart/CartContext";

export default function PaymentResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { success, orderData, paymentMethod } = state || {};

  const { loadCart } = useCartContext();

  useEffect(() => {
    if (!state) {
      navigate("/");
      return;
    }

    if (!success) return;

    const finalizeOrder = async () => {
      try {
        const paymentStatus =
          paymentMethod === "cod" ? "pending" : "paid";

        const transactionId =
          paymentMethod === "cod"
            ? `COD-${Date.now()}`
            : `DUMMY-${Date.now()}`;

        // 1️⃣ CREATE ORDER
        const res = await API.post("/orders/create-dummy", {
          cart: orderData.cart,
          shipping: orderData.shipping,
          billing: orderData.billing,
          total: orderData.total,
          paymentMethod,
          paymentStatus,
          transactionId,
        });

        // 2️⃣ CLEAR CART (BACKEND)
        await API.post("/cart/clear");

        // 3️⃣ SYNC FRONTEND CART
        await loadCart();

        // 4️⃣ REDIRECT
        navigate("/order-success", {
          replace: true,
          state: { order: res.data.order },
        });
      } catch (err) {
        console.error(err);
        alert("Order creation failed");
      }
    };

    finalizeOrder();
  }, [state, success, paymentMethod, orderData, navigate, loadCart]);

  if (!success) {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" color="error" mb={2}>
            Payment Failed
          </Typography>
          <Button variant="contained" onClick={() => navigate("/payment")}>
            Retry
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
      <Card sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={3}>
          Finalizing your order...
        </Typography>
      </Card>
    </Box>
  );
}
