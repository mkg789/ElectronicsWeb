import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Stack,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Load logged in user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await API.get("/products/categories/all");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let url = "/products";
        if (selectedCategory) url = `/products/category/${selectedCategory}`;
        else if (searchQuery) url = `/products/search?q=${encodeURIComponent(searchQuery)}`;
        const res = await API.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory, searchQuery, location]);

  const handleProductAction = async (action, item) => {
    if (!user) {
      setSnackbarMessage(`Please log in to add items to your ${action}.`);
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    try {
      if (action === "cart") await API.post("/cart/add", { productId: item._id });
      if (action === "wishlist") await API.post("/wishlist/add", { productId: item._id });

      setSnackbarMessage(
        action === "cart"
          ? `${item.name} added to your cart!`
          : `${item.name} added to your wishlist ❤️`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Something went wrong.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason !== "clickaway") setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", px: 3, py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Products
      </Typography>

      {/* Categories */}
      <Stack direction="row" spacing={2} overflow="auto" pb={2} mb={3}>
        <Paper
          elevation={2}
          onClick={() => setSelectedCategory("")}
          sx={{
            px: 3,
            py: 2,
            borderRadius: 3,
            cursor: "pointer",
            background: selectedCategory === "" ? "#1976d2" : "white",
            color: selectedCategory === "" ? "white" : "black",
            "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
            transition: "0.25s",
          }}
        >
          <Typography fontWeight={600}>All</Typography>
        </Paper>

        {categories.map((cat) => (
          <Paper
            key={cat}
            elevation={2}
            onClick={() => setSelectedCategory(cat)}
            sx={{
              px: 3,
              py: 2,
              borderRadius: 3,
              cursor: "pointer",
              background: selectedCategory === cat ? "#1976d2" : "white",
              color: selectedCategory === cat ? "white" : "black",
              "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
              transition: "0.25s",
            }}
          >
            <Typography fontWeight={600}>{cat}</Typography>
          </Paper>
        ))}
      </Stack>

      {/* Products Grid */}
      {loading ? (
        <Typography>Loading products...</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 3,
                  overflow: "hidden",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: 8 },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={item.imageUrl || `https://placehold.co/400x200?text=${item.name}`}
                />
                <CardContent>
                  <Typography
                    fontWeight={600}
                    noWrap
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight={700} my={1}>
                    ${item.price.toFixed(2)}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleProductAction("cart", item)}
                      sx={{ borderRadius: 2 }}
                    >
                      Cart
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleProductAction("wishlist", item)}
                      sx={{ borderRadius: 2, border: "1px solid #f44336" }}
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} onClose={handleSnackbarClose}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
