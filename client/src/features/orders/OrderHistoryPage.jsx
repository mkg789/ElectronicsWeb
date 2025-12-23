import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import Grid from "../../shared/components/Grid2";
import {
  Box,
  Typography,
  Card,
  CardContent,
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
      <Box sx={{ px: 3, py: 5, maxWidth: 1200, mx: "auto", textAlign: "center" }}>
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

  const formatAddress = (addr) =>
    addr
      ? [addr.fullName, addr.address1, addr.address2, addr.city, addr.state, addr.zip, addr.country]
          .filter(Boolean)
          .join(", ")
      : "N/A";

  return (
    <Box sx={{ px: 3, py: 5, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((history, index) => {
          const orderId =
            (history.orderId && (history.orderId._id || history.orderId)) ||
            history._id ||
            `unknown-${index}`;
          const orderObj = history.orderId && typeof history.orderId === "object" ? history.orderId : null;
          const display = orderObj || history;

          return (
            <Grid xs={12} key={orderId}>
              <Card sx={{ boxShadow: 2 }}>
                <CardContent>
                  {/* Header */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    mb={3}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Order #{(orderId || "N/A").toString().slice(-8).toUpperCase()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {display.createdAt || history.createdAt
                          ? new Date(display.createdAt || history.createdAt).toLocaleString()
                          : "N/A"}
                      </Typography>
                    </Box>

                    <Chip
                      label={(display.paymentStatus || history.paymentStatus || "UNKNOWN").toString().toUpperCase()}
                      color={
                        (display.paymentStatus || history.paymentStatus) === "paid"
                          ? "success"
                          : (display.paymentStatus || history.paymentStatus) === "pending"
                          ? "warning"
                          : "error"
                      }
                      variant="outlined"
                    />
                  </Stack>

                  {/* Items Table */}
                  {(display.cart && display.cart.length > 0) || (history.cart && history.cart.length > 0) ? (
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
                          {(display.cart || history.cart || []).map((item, idx) => {
                            const productId = (item.productId && (item.productId._id || item.productId)) || idx;
                            const name = item.productId?.name || item.name || "Product";
                            const qty = item.quantity || 1;
                            const price = Number(item.price ?? item.productId?.price ?? 0);

                            return (
                              <TableRow key={productId}>
                                <TableCell>{name}</TableCell>
                                <TableCell align="right">{qty}</TableCell>
                                <TableCell align="right">${price.toFixed(2)}</TableCell>
                              </TableRow>
                            );
                          })}
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
                      <strong>Shipping:</strong> {formatAddress(display.shippingInfo || history.shippingInfo)}
                    </Typography>
                    <Typography>
                      <strong>Billing:</strong> {formatAddress(display.billingInfo || history.billingInfo)}
                    </Typography>
                    <Typography>
                      <strong>Payment Method:</strong> {(display.paymentMethod || history.paymentMethod || "N/A").toString().toUpperCase()}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
                      Total: ${(Number(display.totalAmount || history.totalAmount || display.total || history.total || 0)).toFixed(2)}
                    </Typography>
                  </Stack>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      if (!orderId || orderId.toString().startsWith("unknown-")) {
                        alert("Order id unavailable");
                        return;
                      }
                      navigate(`/orders/${orderId}`);
                    }}
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
