import { useEffect, useState, useCallback, useMemo } from "react";
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
  Skeleton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// Debounce helper
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Restore logged user
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Load categories
  useEffect(() => {
    API.get("/products/categories/all")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // Fetch products — memoized for performance
  const fetchProducts = useCallback(
    async (category, search) => {
      setLoading(true);
      try {
        let url = "/products";
        if (category) url = `/products/category/${category}`;
        else if (search) url = `/products/search?q=${encodeURIComponent(search)}`;

        const res = await API.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced search
  const debouncedFetch = useMemo(() => debounce(fetchProducts, 350), [fetchProducts]);

  // Trigger product fetch on filter or search changes
  useEffect(() => {
    if (searchQuery) debouncedFetch(selectedCategory, searchQuery);
    else fetchProducts(selectedCategory, "");
  }, [selectedCategory, searchQuery, location, debouncedFetch, fetchProducts]);

  // Snackbar helper
  const showSnackbar = useCallback((msg, severity = "success") => {
    setSnackbar({ open: true, message: msg, severity });
  }, []);

  const handleProductAction = async (type, item) => {
    if (!user) {
      showSnackbar(`Please log in to use your ${type}.`, "warning");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    try {
      const endpoint = type === "cart" ? "/cart/add" : "/wishlist/add";
      await API.post(endpoint, { productId: item._id });

      showSnackbar(
        type === "cart"
          ? `${item.name} added to your cart!`
          : `${item.name} added to your wishlist ❤️`
      );
    } catch (err) {
      console.error(err);
      showSnackbar("Something went wrong.", "error");
    }
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason !== "clickaway") setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", px: 3, py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Products
      </Typography>

      {/* Categories */}
      <Stack direction="row" spacing={2} overflow="auto" pb={2} mb={3}>
        {["All", ...categories].map((cat) => {
          const isActive = cat === "All" ? selectedCategory === "" : selectedCategory === cat;

          return (
            <Paper
              key={cat}
              elevation={2}
              onClick={() => setSelectedCategory(cat === "All" ? "" : cat)}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 3,
                cursor: "pointer",
                transition: "0.25s",
                background: isActive ? "#1976d2" : "white",
                color: isActive ? "white" : "black",
                "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
              }}
            >
              <Typography fontWeight={600}>{cat}</Typography>
            </Paper>
          );
        })}
      </Stack>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {loading
          ? [...Array(8)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          : products.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                <Card
                  sx={{
                    borderRadius: 3,
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
                    sx={{ objectFit: "cover" }}
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
                        fullWidth
                        size="small"
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
                        sx={{
                          borderRadius: 2,
                          border: "1px solid #f44336",
                        }}
                      >
                        <FavoriteBorderIcon />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
