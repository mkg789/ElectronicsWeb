import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await API.get("/orders/history");
        // Each order in history contains orderId pointing to the actual Order document
        setOrders(res.data.orderHistory || []);
        setError(null);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Failed to load order history. Please try again.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ px: 3, py: 5, maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );

  if (!orders.length)
    return (
      <Box sx={{ px: 3, py: 5, maxWidth: 1200, mx: "auto", textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" mb={2}>
          No orders found.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Start Shopping
        </Button>
      </Box>
    );

  return (
    <Box sx={{ px: 3, py: 5, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((history) => {
          const order = history.orderId; // Use the actual Order document
          if (!order) return null; // Skip if order is missing
          return (
            <Grid item xs={12} key={order._id}>
              <Card sx={{ boxShadow: 2 }}>
                <CardContent>
                  {/* Order Header */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    mb={3}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Order #{order._id?.slice(-8).toUpperCase() || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </Typography>
                    </Box>

                    <Chip
                      label={order.paymentStatus?.toUpperCase() || "UNKNOWN"}
                      color={
                        order.paymentStatus === "paid"
                          ? "success"
                          : order.paymentStatus === "pending"
                          ? "warning"
                          : "error"
                      }
                      variant="outlined"
                    />
                  </Stack>

                  {/* Order Items Table */}
                  {order.cart && order.cart.length > 0 ? (
                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Qty</TableCell>
                            <TableCell align="right">Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.cart.map((item, idx) => (
                            <TableRow key={item.productId || idx}>
                              <TableCell>{item.name || "Product"}</TableCell>
                              <TableCell align="right">{item.quantity || 1}</TableCell>
                              <TableCell align="right">
                                ${item.price?.toFixed(2) || "0.00"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      No items in this order.
                    </Typography>
                  )}

                  {/* Summary & Action */}
                  <Stack spacing={1} sx={{ mb: 2, py: 2, borderTop: "1px solid #eee" }}>
                    <Typography>
                      <strong>Shipping:</strong> {order.shippingInfo?.address1 || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase() || "N/A"}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
                      Total: ${order.totalAmount?.toFixed(2) || "0.00"}
                    </Typography>
                  </Stack>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    View Full Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
