import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  TextField,
  Menu,
  MenuItem,
  CircularProgress,
  Stack,
  Snackbar,
  Alert,
  Chip,
  Paper,
  Badge,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { FiSearch } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

export default function HomePage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // NEW: local cart + wishlist
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  /* ---------------------------------------------
      LOAD USER
  --------------------------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  /* ---------------------------------------------
      LOAD CART & WISHLIST WHEN LOGGED IN
  --------------------------------------------- */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const [cartRes, wishRes] = await Promise.all([
          API.get("/cart"),
          API.get("/wishlist"),
        ]);
        setCart(cartRes.data);
        setWishlist(wishRes.data);
      } catch {}
    };

    load();
  }, [user]);

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  /* ---------------------------------------------
      LOGOUT
  --------------------------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    setAnchorEl(null);
  };

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  /* ---------------------------------------------
      FETCH PRODUCTS + CATEGORIES
  --------------------------------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/products/categories/all");
        setCategories(res.data);
      } catch {}
    };
    load();
  }, []);

  /* ---------------------------------------------
      SEARCH
  --------------------------------------------- */
  const handleSearch = () => {
    if (searchQuery.trim() !== "")
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSearch();

  /* ---------------------------------------------
      CART: ADD / REMOVE
  --------------------------------------------- */
  const addToCart = async (productId) => {
    if (!user) return navigate("/login");

    try {
      const res = await API.post("/cart/add", { productId });
      setCart(res.data.cart);

      setSnackbarMessage("Added to cart!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch {}
  };

  const removeOne = async (productId) => {
    try {
      const res = await API.post("/cart/remove-one", { productId });
      setCart(res.data.cart);
    } catch {}
  };

  const increaseOne = async (productId) => {
    try {
      const res = await API.post("/cart/add", { productId });
      setCart(res.data.cart);
    } catch {}
  };

  /* ---------------------------------------------
      WISHLIST TOGGLE
  --------------------------------------------- */
  const toggleWishlist = async (item) => {
    if (!user) return navigate("/login");

    const exists = wishlist.some((w) => w.productId._id === item._id);

    try {
      if (exists) {
        const res = await API.post("/wishlist/remove", {
          productId: item._id,
        });
        setWishlist(res.data.wishlist);

        setSnackbarMessage("Removed from wishlist");
        setSnackbarSeverity("info");
      } else {
        const res = await API.post("/wishlist/add", {
          productId: item._id,
        });
        setWishlist(res.data.wishlist);

        setSnackbarMessage("Added to wishlist ❤️");
        setSnackbarSeverity("success");
      }

      setSnackbarOpen(true);
    } catch {}
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  /* ---------------------------------------------
      UI
  --------------------------------------------- */
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* NAVBAR */}
      <Paper
        elevation={4}
        sx={{
          borderRadius: 0,
          px: { xs: 2, sm: 5 },
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backdropFilter: "blur(14px)",
          background: "rgba(255, 255, 255, 0.65)",
          borderBottom: "1px solid #e0e0e0",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Brand */}
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            cursor: "pointer",
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
          onClick={() => navigate("/")}
        >
          Zyntrica
        </Typography>

        {/* Search */}
        <Box
          sx={{
            flex: 1,
            mx: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            placeholder="Search for electronics..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            InputProps={{
              startAdornment: (
                <IconButton onClick={handleSearch}>
                  <FiSearch />
                </IconButton>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: "60%", md: "50%" },
              bgcolor: "white",
              borderRadius: 3,
              "& fieldset": { border: "none" },
              boxShadow: 2,
            }}
          />
        </Box>

        {/* User */}
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => navigate("/cart")}>
            <Badge badgeContent={cartCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={handleOpenMenu}>
            {user ? (
              <Chip
                label={user.name[0].toUpperCase()}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 700,
                }}
              />
            ) : (
              <CgProfile size={24} />
            )}
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <Typography sx={{ px: 2, py: 1 }}>
              {user ? `Welcome, ${user.name}` : "Guest"}
            </Typography>

            {!user && <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>}

            {user && (
              <>
                <MenuItem onClick={() => navigate("/cart")}>Cart</MenuItem>
                <MenuItem onClick={() => navigate("/wishlist")}>Wishlist</MenuItem>
                <MenuItem onClick={() => navigate("/orders")}>My Orders</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            )}
          </Menu>
        </Stack>
      </Paper>

      {/* HERO BANNER (unchanged) */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          color: "white",
          py: { xs: 6, sm: 10 },
          px: 3,
          textAlign: "center",
          borderRadius: "0 0 25px 25px",
          boxShadow: 4,
          mb: 4,
        }}
      >
        <Typography variant="h3" fontWeight={700} mb={2}>
          Premium Electronics Delivered Fast.
        </Typography>

        <Typography variant="h6" sx={{ opacity: 0.9 }} mb={4}>
          Shop the newest gadgets with unbeatable prices.
        </Typography>

        <Button
          variant="contained"
          sx={{
            px: 5,
            py: 1.5,
            borderRadius: 3,
            fontSize: "1.1rem",
            fontWeight: 700,
            bgcolor: "white",
            color: "primary.main",
            "&:hover": { bgcolor: "#e3e3e3" },
          }}
          onClick={() => navigate("/products")}
        >
          Browse Products
        </Button>
      </Box>

      {/* CATEGORIES (unchanged) */}
      <Box sx={{ px: 3, maxWidth: "1200px", mx: "auto" }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Shop by Category
        </Typography>

        <Stack direction="row" spacing={2} overflow="auto" pb={2}>
          {categories.map((cat) => (
            <Paper
              key={cat}
              elevation={2}
              onClick={() => navigate(`/category/${cat}`)}
              sx={{
                px: 3,
                py: 2,
                borderRadius: 3,
                minWidth: 140,
                textAlign: "center",
                cursor: "pointer",
                background: "white",
                "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
                transition: "0.25s",
              }}
            >
              <Typography fontWeight={600}>{cat}</Typography>
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* PRODUCTS (with upgraded buttons) */}
      <Box sx={{ px: 3, maxWidth: "1200px", mx: "auto", mt: 5 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Trending Products
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.map((item) => {
              const cartItem = cart.find((c) => c.productId._id === item._id);
              const wish = wishlist.some((w) => w.productId._id === item._id);

              return (
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

                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight={700}
                        my={1}
                      >
                        ${item.price.toFixed(2)}
                      </Typography>

                      {/* CART BUTTONS */}
                      {!cartItem ? (
                        <Button
                          size="small"
                          fullWidth
                          variant="contained"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => addToCart(item._id)}
                          sx={{ borderRadius: 2, mb: 1 }}
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                          <IconButton
                            color="primary"
                            onClick={() => removeOne(item._id)}
                            sx={{ border: "1px solid #1976d2" }}
                          >
                            <RemoveIcon />
                          </IconButton>

                          <Typography fontWeight={700}>
                            {cartItem.quantity}
                          </Typography>

                          <IconButton
                            color="primary"
                            onClick={() => increaseOne(item._id)}
                            sx={{ border: "1px solid #1976d2" }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Stack>
                      )}

                      {/* WISHLIST BUTTON */}
                      <IconButton
                        color="error"
                        onClick={() => toggleWishlist(item)}
                        sx={{
                          borderRadius: 2,
                          border: "1px solid #f44336",
                        }}
                      >
                        {wish ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
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
    