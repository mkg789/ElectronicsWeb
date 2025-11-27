// CartPage.jsx (Complete and Visually Enhanced)

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Stack,
} from "@mui/material";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

import { useCartContext } from "../context/CartContext"; 
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";

export default function CartPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Get cart state and actions from the Context
  const { cart, isLoading, isUpdating } = useCartContext(); 

  // 🛑 RESTORED ESSENTIAL USER LOADING LOGIC 🛑
  // This logic is crucial for security and personalization.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (!saved) {
        // Redirect to login if no user data is found
        return navigate("/login");
      }
      setUser(JSON.parse(saved));
    } catch (err) {
      console.error("User parse error:", err);
      // Redirect on error (e.g., corrupted localStorage)
      navigate("/login");
    }
  }, [navigate]);
  // ----------------------------------------

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        backgroundColor: "#F0F2F5",
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: "1200px", margin: "0 auto", px: 3 }}>
        
        {/* Title uses user state if available */}
        <Typography 
          variant="h3" 
          fontWeight={700} 
          mb={5}
          color="text.primary"
        >
          {user ? `${user.name}'s Cart` : "Your Shopping Cart"}
        </Typography>

        {cart.length === 0 ? (
          // Empty Cart Design
          <Box 
            textAlign="center" 
            py={10}
            sx={{ 
              backgroundColor: "white", 
              borderRadius: 4, 
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <ShoppingBasketIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
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
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="flex-start" 
          >
            {/* Cart Items Table */}
            <Card
              sx={{
                flex: 4,
                p: 3,
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                width: "100%",
              }}
            >
              <TableContainer sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#F8F9FA" }}>
                      <TableCell sx={{ fontWeight: 600, width: "80px" }}></TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Quantity</TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>Subtotal</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: "80px" }}></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {cart.map((item) => (
                      <CartItem
                        key={item._id}
                        item={item}
                        isUpdating={isUpdating}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Order Summary Component */}
            <OrderSummary /> 
          </Stack>
        )}

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