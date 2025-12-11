// src/components/CartItem.jsx
import {
  TableCell,
  TableRow,
  Stack,
  Typography,
  CircularProgress,
  IconButton,
  Avatar
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import { useCartContext } from "../context/CartContext";

export default function CartItem({ item }) {
  const { increaseQty, decreaseQty, removeItem, isUpdating } = useCartContext();

  const product = item.productId;
  const productId = product._id;

  const price = product.price.toFixed(2);
  const subtotal = (product.price * item.quantity).toFixed(2);

  const loading = isUpdating[productId] === true;

  return (
    <TableRow hover>
      {/* Image */}
      <TableCell>
        <Avatar
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          variant="rounded"
          sx={{ width: 60, height: 60 }}
        />
      </TableCell>

      {/* Name */}
      <TableCell>
        <Typography fontWeight={600}>{product.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          SKU: {product.sku || "N/A"}
        </Typography>
      </TableCell>

      {/* Price */}
      <TableCell align="right">
        <Typography fontWeight={500}>${price}</Typography>
      </TableCell>

      {/* Quantity */}
      <TableCell align="center">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            px: 1
          }}
        >
          <IconButton
            size="small"
            disabled={loading || item.quantity <= 1}
            onClick={() => decreaseQty(productId)}
          >
            {loading && item.quantity <= 1 ? (
              <CircularProgress size={16} />
            ) : (
              <RemoveIcon fontSize="small" />
            )}
          </IconButton>

          <Typography sx={{ mx: 1, width: 24, textAlign: "center" }}>
            {item.quantity}
          </Typography>

          <IconButton
            size="small"
            disabled={loading}
            onClick={() => increaseQty(productId)}
          >
            {loading && item.quantity > 1 ? (
              <CircularProgress size={16} />
            ) : (
              <AddIcon fontSize="small" />
            )}
          </IconButton>
        </Stack>
      </TableCell>

      {/* Subtotal */}
      <TableCell align="right">
        <Typography fontWeight={700}>${subtotal}</Typography>
      </TableCell>

      {/* Remove */}
      <TableCell>
        <IconButton color="error" disabled={loading} onClick={() => removeItem(productId)}>
          {loading ? <CircularProgress size={22} /> : <DeleteIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
