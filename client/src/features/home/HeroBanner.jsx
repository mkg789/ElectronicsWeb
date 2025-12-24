import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #004d99, #1976d2)",
        color: "white",

        // Mobile-first spacing
        py: { xs: 5, sm: 8, md: 10 },
        px: { xs: 2, sm: 4, md: 6 },

        textAlign: "center",
        borderRadius: { xs: "0 0 24px 24px", sm: "0 0 40px 40px" },
        boxShadow: { xs: 3, sm: 6 },
        mb: { xs: 3, md: 4 },

        // Prevent overflow on small screens
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        mb={2}
        sx={{
          lineHeight: 1.2,
        }}
      >
        Find Your Next Tech Obsession
      </Typography>

      <Typography
        variant="body1"
        sx={{
          opacity: 0.9,
          maxWidth: 520,
          mx: "auto",
          mb: { xs: 3, sm: 4 },
          fontSize: { xs: "0.95rem", sm: "1rem" },
        }}
      >
        Shop premium, verified electronics with free express shipping.
      </Typography>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={() => navigate("/products")}
        sx={{
          maxWidth: 320,
          mx: "auto",
          py: 1.4,
          borderRadius: 3,
          fontSize: { xs: "1rem", sm: "1.1rem" },
          fontWeight: 600,
          bgcolor: "white",
          color: "primary.main",

          "&:hover": {
            bgcolor: "grey.100",
          },
        }}
      >
        Explore All Products
      </Button>
    </Box>
  );
}
