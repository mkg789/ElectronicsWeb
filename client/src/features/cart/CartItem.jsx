import {
  TableCell,
  TableRow,
  Stack,
  Typography,
  CircularProgress,
  IconButton,
  Avatar,
  Box,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import { useCartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

export default function CartItem({ item }) {
  const { increaseQty, decreaseQty, removeItem, isUpdating } = useCartContext();
  const product = item.productId;
  const productId = product._id;
  const loading = isUpdating[productId];
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNavigate = () => navigate(`/product/${productId}`);

  if (isMobile) {
    return (
      <Card sx={{ mb: 2, borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={product.imageUrl || "/placeholder.svg"}
              variant="rounded"
              sx={{ width: 80, height: 80, cursor: "pointer" }}
              onClick={handleNavigate}
              imgProps={{
                onError: (e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.svg";
                },
              }}
            />

            <Box flex={1}>
              <Typography
                fontWeight={600}
                sx={{ cursor: "pointer" }}
                onClick={handleNavigate}
              >
                {product.name}
              </Typography>
              <Typography color="primary" fontWeight={600}>
                ${product.price.toFixed(2)}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                <IconButton
                  size="small"
                  disabled={loading || item.quantity <= 1}
                  onClick={() => decreaseQty(productId)}
                >
                  {loading ? <CircularProgress size={16} /> : <RemoveIcon />}
                </IconButton>

                <Typography>{item.quantity}</Typography>

                <IconButton size="small" disabled={loading} onClick={() => increaseQty(productId)}>
                  {loading ? <CircularProgress size={16} /> : <AddIcon />}
                </IconButton>

                <IconButton
                  color="error"
                  size="small"
                  onClick={() => removeItem(productId)}
                >
                  {loading ? <CircularProgress size={18} /> : <DeleteIcon />}
                </IconButton>
              </Stack>

              <Typography mt={1} fontWeight={600}>
                Subtotal: ${(product.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Desktop/table layout
  return (
    <TableRow hover>
      <TableCell>
        <Avatar
          src={product.imageUrl || "/placeholder.svg"}
          variant="rounded"
          sx={{ width: 60, height: 60, cursor: "pointer" }}
          onClick={handleNavigate}
          imgProps={{
            onError: (e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.svg";
            },
          }}
        />
      </TableCell>

      <TableCell>
        <Typography
          fontWeight={600}
          sx={{ cursor: "pointer" }}
          onClick={handleNavigate}
        >
          {product.name}
        </Typography>
      </TableCell>

      <TableCell align="right">${product.price.toFixed(2)}</TableCell>

      <TableCell align="center">
        <Stack direction="row" alignItems="center">
          <IconButton disabled={loading || item.quantity <= 1} onClick={() => decreaseQty(productId)}>
            {loading ? <CircularProgress size={16} /> : <RemoveIcon />}
          </IconButton>

          <Typography mx={1}>{item.quantity}</Typography>

          <IconButton disabled={loading} onClick={() => increaseQty(productId)}>
            {loading ? <CircularProgress size={16} /> : <AddIcon />}
          </IconButton>
        </Stack>
      </TableCell>

      <TableCell align="right">
        ${(product.price * item.quantity).toFixed(2)}
      </TableCell>

      <TableCell>
        <IconButton color="error" onClick={() => removeItem(productId)}>
          {loading ? <CircularProgress size={18} /> : <DeleteIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
