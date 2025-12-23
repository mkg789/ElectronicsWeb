import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleNavigate = () => navigate(`/product/${product._id}`);

  return (
    <Card
      sx={{
        boxShadow: 3,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ cursor: "pointer" }} onClick={handleNavigate}>
        <CardMedia
          component="img"
          image={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder.svg";
          }}
          sx={{
            width: "100%",
            height: { xs: 180, sm: 200 },
            objectFit: "contain",
            bgcolor: "#f9f9f9",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ cursor: "pointer" }}
          onClick={handleNavigate}
          gutterBottom
        >
          {product.name}
        </Typography>

        <Typography color="primary" fontWeight={600} mb={2}>
          ${product.price}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={handleNavigate}
          sx={{ mt: "auto" }}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
}
