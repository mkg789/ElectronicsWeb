import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Card,
  Stack,
} from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

import { useCartContext } from "./CartContext";
import CartItem from "./CartItem";
import OrderSummary from "../orders/OrderSummary";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, isLoading, isUpdating, loadCart } = useCartContext();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F0F2F5", py: { xs: 4, md: 6 } }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 } }}>
        <Typography
          variant="h3"
          fontWeight={700}
          mb={5}
          textAlign={{ xs: "center", md: "left" }}
        >
          Your Shopping Cart
        </Typography>

        {cart.length === 0 ? (
          <Box
            textAlign="center"
            py={10}
            sx={{
              bgcolor: "white",
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <ShoppingBasketIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" fontWeight={600} color="text.secondary" mb={2}>
              Your cart is empty. Start adding some products!
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, borderRadius: 3, px: 4, py: 1.5, textTransform: "none" }}
              onClick={() => navigate("/")}
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="flex-start">
            {/* Cart Items */}
            <Card sx={{ flex: 4, p: 3, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", width: "100%" }}>
              <Box sx={{ overflowX: "auto" }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#F8F9FA" }}>
                        <TableCell sx={{ fontWeight: 600, width: "80px" }} />
                        <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Quantity</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>Subtotal</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: "80px" }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map((item) => (
                        <CartItem key={item._id} item={item} isUpdating={isUpdating} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Card>

            {/* Order Summary */}
            <OrderSummary />
          </Stack>
        )}

        {/* Continue Shopping */}
        <Button
          variant="text"
          sx={{ mt: 4, textTransform: "none" }}
          onClick={() => navigate("/")}
        >
          ← Continue Shopping
        </Button>
      </Box>
    </Box>
  );
}
