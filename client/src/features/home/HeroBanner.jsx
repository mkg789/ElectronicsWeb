import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #004d99, #1976d2)",
        color: "white",
        py: { xs: 6, sm: 10 },
        px: { xs: 3, sm: 6 },
        textAlign: "center",
        borderRadius: "0 0 40px 40px",
        boxShadow: 6,
        mb: 4,
      }}
    >
      <Typography variant="h3" fontWeight={700} mb={2}>
        Find Your Next Tech Obsession
      </Typography>
      <Typography
        variant="h6"
        sx={{
          opacity: 0.9,
          maxWidth: 600,
          mx: "auto",
          mb: 4,
        }}
      >
        Shop premium, verified electronics with free express shipping.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/products")}
        sx={{
          px: 5,
          py: 1.5,
          borderRadius: 3,
          fontSize: "1.1rem",
          bgcolor: "white",
          color: "primary.main",
          "&:hover": {
            bgcolor: "grey.100",
          },
          transition: "all 0.3s ease",
        }}
      >
        Explore All Products
      </Button>
    </Box>
  );
}
