import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
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

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Invalid order id.");
        setLoading(false);
        return;
      }

      try {
        const res = await API.get(`/orders/${orderId}`);
        const fetched = res?.data?.order || res?.data || null;

        if (!fetched) {
          setError("Order not found.");
          setOrder(null);
        } else {
          setOrder(fetched);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        const msg =
          err?.response?.data?.msg ||
          err?.response?.data?.message ||
          err.message ||
          "Failed to load order details.";
        setError(msg);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ px: 3, py: 5, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h6" color="error" mb={2}>
          {error}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => navigate("/orders")}>
            Back to Orders
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Stack>
      </Box>
    );

  if (!order)
    return (
      <Box sx={{ px: 3, py: 5, maxWidth: 800, mx: "auto", textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Order not found.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/orders")}>
          Back to Orders
        </Button>
      </Box>
    );

  // Normalize addresses
  const shipping = order.shippingInfo || order.shipping || {};
  const billing = order.billingInfo || order.billing || {};

  const formatAddress = (addr) =>
    addr
      ? [addr.fullName, addr.address1, addr.address2, addr.city, addr.state, addr.zip, addr.country]
          .filter(Boolean)
          .join(", ")
      : "N/A";

  const getProductName = (item) =>
    item.productId?.name || item.name || item.product?.name || "Product";

  const getProductPrice = (item) =>
    Number(item.productId?.price ?? item.price ?? item.product?.price ?? 0);

  return (
    <Box sx={{ px: 3, py: 5, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Order Details
      </Typography>

      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Order #{(order._id || "").toString().slice(-8).toUpperCase() || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
              </Typography>
            </Box>

            <Chip
              label={(order.paymentStatus || "UNKNOWN").toString().toUpperCase()}
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

          {/* Items Table */}
          {order.cart && order.cart.length > 0 ? (
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.cart.map((item, idx) => {
                    const name = getProductName(item);
                    const price = getProductPrice(item);
                    const qty = Number(item.quantity || 1);
                    return (
                      <TableRow key={item.productId || idx}>
                        <TableCell>{name}</TableCell>
                        <TableCell align="right">{qty}</TableCell>
                        <TableCell align="right">${price.toFixed(2)}</TableCell>
                        <TableCell align="right">${(price * qty).toFixed(2)}</TableCell>
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

          {/* Shipping & Payment Info */}
          <Stack spacing={1} sx={{ mb: 2, py: 2, borderTop: "1px solid #eee" }}>
            <Typography>
              <strong>Shipping Address:</strong> {formatAddress(shipping)}
            </Typography>
            <Typography>
              <strong>Billing Address:</strong> {formatAddress(billing)}
            </Typography>
            <Typography>
              <strong>Payment Method:</strong> {(order.paymentMethod || "N/A").toUpperCase()}
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
              Total: ${Number(order.totalAmount ?? order.total ?? 0).toFixed(2)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => navigate("/orders")}>
              Back to Orders
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
