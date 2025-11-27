import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

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
  Paper,
  Stack,
  Card,
  Divider,
} from "@mui/material";

export default function CartPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (!saved) return navigate("/login");
      setUser(JSON.parse(saved));
    } catch (err) {
      console.error("User parse error:", err);
      navigate("/login");
    }
  }, [navigate]);

  // Load cart
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await API.get("/cart");
        setCart(res.data);
      } catch (err) {
        console.error("Failed to load cart:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [navigate]);

  const increaseQty = async (productId) => {
    try {
      await API.post("/cart/add", { productId });
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Increase qty error:", err);
    }
  };

  const decreaseQty = async (productId) => {
    try {
      await API.post("/cart/remove-one", { productId });
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Decrease qty error:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.post("/cart/remove", { productId });
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress size={50} />
      </Box>
    );

  return (
    <Box p={4} sx={{ minHeight: "100vh", backgroundColor: "#F5F7FA" }}>
      
      {/* Centered container with full width */}
      <Box sx={{ maxWidth: "100%", margin: "0 auto", width: "100%" }}>
        
        <Typography variant="h4" fontWeight={700} mb={4}>
          {user ? `${user.name}'s Cart` : "Your Cart"}
        </Typography>

        {cart.length === 0 ? (
          <Box textAlign="center" mt={8}>
            <Typography variant="h6" fontWeight={600} color="text.secondary">
              Your cart is empty 🛒
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, borderRadius: 3 }}
              onClick={() => navigate("/")}
            >
              Shop Now
            </Button>
          </Box>
        ) : (
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ width: "100%" }}
          >
            {/* LEFT — main cart area (4/5 width) */}
            <Card
              sx={{
                flex: 4,
                p: 2,
                borderRadius: 3,
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {cart.map((item) => (
                      <TableRow hover key={item._id}>
                        <TableCell>{item.productId.name}</TableCell>
                        <TableCell>${item.productId.price}</TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ minWidth: 30, borderRadius: 2 }}
                              onClick={() => decreaseQty(item.productId._id)}
                            >
                              -
                            </Button>

                            <Typography>{item.quantity}</Typography>

                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ minWidth: 30, borderRadius: 2 }}
                              onClick={() => increaseQty(item.productId._id)}
                            >
                              +
                            </Button>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          ${(item.productId.price * item.quantity).toFixed(2)}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            sx={{ borderRadius: 2 }}
                            onClick={() => removeItem(item.productId._id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* RIGHT — order summary (1/5 width) */}
            <Card
              sx={{
                flex: 1,
                height: "fit-content",
                p: 3,
                position: { md: "sticky" },
                top: 20,
                borderRadius: 3,
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Order Summary
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1.5} mb={2}>
                {cart.map((item) => (
                  <Stack
                    key={item._id}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography>{item.productId.name}</Typography>
                    <Typography>
                      ${(item.productId.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight={700}>
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Stack>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ borderRadius: 3, py: 1.3, fontSize: "1rem" }}
                onClick={() => alert("Proceeding to checkout!")}
              >
                Checkout
              </Button>
            </Card>
          </Stack>
        )}

        <Button variant="text" sx={{ mt: 3 }} onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
      </Box>
    </Box>
  );
}
