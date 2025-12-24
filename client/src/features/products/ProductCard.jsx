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
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 2,
        boxShadow: { xs: 2, md: 3 },
        transition: "transform 0.2s ease, box-shadow 0.2s ease",

        // Disable hover lift on touch devices
        "@media (hover: hover)": {
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        },
      }}
    >
      {/* Image */}
      <Box
        onClick={handleNavigate}
        sx={{
          cursor: "pointer",
          p: 1,
        }}
      >
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
            height: { xs: 160, sm: 180, md: 200 },
            objectFit: "contain",
            borderRadius: 1,
            bgcolor: "#f9f9f9",
          }}
        />
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          px: { xs: 1.5, sm: 2 },
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          onClick={handleNavigate}
          sx={{
            cursor: "pointer",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </Typography>

        <Typography
          color="primary"
          fontWeight={700}
          mb={2}
        >
          ${product.price}
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleNavigate}
          sx={{
            mt: "auto",
            borderRadius: 1.5,
          }}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
}
