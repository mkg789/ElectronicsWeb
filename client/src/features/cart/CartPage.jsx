import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Card,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

import { useCartContext } from "./CartContext";
import CartItem from "./CartItem";
import OrderSummary from "../orders/OrderSummary";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, isLoading, isUpdating, loadCart } = useCartContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Box sx={{ minHeight: "100vh", bgcolor: "#F0F2F5", pb: { xs: 12, md: 6 } }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 4, md: 6 } }}>
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
          <>
            {/* Desktop Layout */}
            {!isMobile && (
              <Stack direction="row" spacing={4} alignItems="flex-start">
                <Card sx={{ flex: 4, p: 3, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", width: "100%" }}>
                  {cart.map((item) => (
                    <CartItem key={item._id} item={item} isUpdating={isUpdating} />
                  ))}
                </Card>
                <Box flex={1}>
                  <OrderSummary />
                </Box>
              </Stack>
            )}

            {/* Mobile Layout */}
            {isMobile && (
              <Stack spacing={2}>
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} isUpdating={isUpdating} />
                ))}

                {/* Sticky Checkout */}
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    boxSizing: "border-box",
                    bgcolor: "white",
                    px: 2,
                    py: 1.5,
                    boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    fontWeight={600}
                    sx={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total: ${cart.reduce((acc, i) => acc + i.productId.price * i.quantity, 0).toFixed(2)}
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() => navigate("/checkout")}
                    sx={{
                      ml: 1,
                      minWidth: 110,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Checkout
                  </Button>
                </Box>
              </Stack>
            )}
          </>
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
