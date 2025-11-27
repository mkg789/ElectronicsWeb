// src/components/CartItem.jsx (Fixed)
import { TableCell, TableRow, Stack, Button, Typography, CircularProgress, IconButton, Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { useCartContext } from "../context/CartContext"; 

export default function CartItem({ item, isUpdating }) {
  const { increaseQty, decreaseQty, removeItem } = useCartContext(); 
  const productId = item.productId._id;
  const price = item.productId.price.toFixed(2);
  const itemTotal = (item.productId.price * item.quantity).toFixed(2);

  // ✅ Correct loading flag
  const isItemLoading = isUpdating[productId];

  return (
    <TableRow 
      sx={{ 
        '&:hover': { backgroundColor: '#f9f9f9' },
        '&:last-child td, &:last-child th': { border: 0 } 
      }}
    >
      {/* 1. Image Column */}
      <TableCell>
        <Avatar
          src={item.productId.imageUrl || "https://via.placeholder.com/60"} 
          alt={item.productId.name}
          variant="rounded"
          sx={{ width: 60, height: 60 }}
        />
      </TableCell>
      
      {/* 2. Product Name */}
      <TableCell>
        <Typography variant="body1" fontWeight={500}>{item.productId.name}</Typography>
        <Typography variant="caption" color="text.secondary">SKU: {item.productId.sku || 'N/A'}</Typography>
      </TableCell>
      
      {/* 3. Price */}
      <TableCell align="right">
        <Typography variant="body1" fontWeight={500}>${price}</Typography>
      </TableCell>

      {/* 4. Quantity Controls */}
      <TableCell align="center"> 
        <Stack
          direction="row"
          spacing={0}
          alignItems="center"
          justifyContent="center"
          sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}
        >
          <IconButton
            size="small"
            disabled={isItemLoading || item.quantity <= 1}
            onClick={() => decreaseQty(productId)}
          >
            {isItemLoading && item.quantity <= 1 
              ? <CircularProgress size={16} /> 
              : <RemoveIcon fontSize="small" />}
          </IconButton>

          <Typography
            variant="body1"
            sx={{ minWidth: 24, textAlign: "center", fontWeight: 500, px: 1 }}
          >
            {item.quantity}
          </Typography>

          <IconButton
            size="small"
            disabled={isItemLoading}
            onClick={() => increaseQty(productId)}
          >
            {isItemLoading && item.quantity > 1 
              ? <CircularProgress size={16} /> 
              : <AddIcon fontSize="small" />}
          </IconButton>
        </Stack>
      </TableCell>

      {/* 5. Subtotal */}
      <TableCell align="right"> 
        <Typography variant="body1" fontWeight={600} color="text.primary">
          ${itemTotal}
        </Typography>
      </TableCell>

      {/* 6. Remove */}
      <TableCell>
        <IconButton
          color="error"
          aria-label="remove item"
          onClick={() => removeItem(productId)}
          disabled={isItemLoading}
        >
          {isItemLoading 
            ? <CircularProgress size={20} color="error" /> 
            : <DeleteIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
