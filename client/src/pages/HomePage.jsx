import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
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
} from "@mui/material";
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

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse user:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    handleCloseMenu();
  };

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box
      p={3}
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fa",
      }}
    >
      {/* ---------------- NAVBAR ---------------- */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        sx={{
          px: 3,
          py: 2,
          borderRadius: 2,
          boxShadow: 2,
          background: "linear-gradient(90deg, #1976d2, #42a5f5)",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight={700} sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Zyntrica
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              width: 250,
            }}
          />
          <IconButton onClick={handleSearch} sx={{ color: "white" }}>
            <FiSearch />
          </IconButton>

          <IconButton onClick={handleOpenMenu} sx={{ color: "white" }}>
            {user ? (
              <Typography variant="subtitle1">{user.name[0]}</Typography> // initial as avatar
            ) : (
              <CgProfile />
            )}
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <Typography variant="subtitle1" sx={{ px: 2, py: 1 }}>
              {user ? `Welcome ${user.name}` : "Guest"}
            </Typography>

            {!user && (
              <MenuItem onClick={() => { navigate("/login"); handleCloseMenu(); }}>
                Login
              </MenuItem>
            )}

            {user && (
              <>
                <MenuItem onClick={() => { navigate("/cart"); handleCloseMenu(); }}>Cart</MenuItem>
                <MenuItem onClick={() => { navigate("/wishlist"); handleCloseMenu(); }}>Wishlist</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Box>

      {/* ---------------- HERO ---------------- */}
      <Box
        mb={5}
        p={5}
        sx={{
          backgroundImage: 'url("/hero-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          color: "white",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" fontWeight={700} mb={2}>
            Latest Electronics, Best Prices
          </Typography>
          <Typography variant="h6" mb={3}>
            Get premium gadgets delivered to your door
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate("/products")}>
            Shop Now
          </Button>
        </Box>
      </Box>

      {/* ---------------- CATEGORIES ---------------- */}
      <Stack direction="row" spacing={2} overflow="auto" mb={5}>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant="outlined"
            onClick={() => navigate(`/category/${cat}`)}
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "capitalize",
              boxShadow: 1,
              "&:hover": { bgcolor: "#e3f2fd" },
            }}
          >
            {cat}
          </Button>
        ))}
      </Stack>

      {/* ---------------- PRODUCT GRID ---------------- */}
      <Typography variant="h5" fontWeight={600} mb={3}>
        Trending Products
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl || "/placeholder.png"}
                  alt={item.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ cursor: "pointer", mb: 1 }}
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="body1" color="primary" mb={1}>
                    ${item.price}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        if (user) navigate("/cart");
                        else { alert("Please login to add to cart!"); navigate("/login"); }
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        if (user) navigate("/wishlist");
                        else { alert("Please login to add to wishlist!"); navigate("/login"); }
                      }}
                    >
                      ❤️
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>

  );
}
