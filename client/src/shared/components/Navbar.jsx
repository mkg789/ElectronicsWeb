import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  Chip,
  Menu,
  MenuItem,
  InputBase,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { FiSearch } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../../features/auth/AuthContext";
import { useCartContext } from "../../features/cart/CartContext";

// Styled Search Bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.action.active, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.action.active, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  paddingLeft: `calc(1em + ${theme.spacing(3)})`,
  width: "100%",
}));

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCartContext();
  const cartCount = (cart || []).reduce((s, i) => s + (i.quantity || 0), 0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery}`);
  };

  return (
    <AppBar position="sticky" elevation={1} color="inherit">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Zyntrica
        </Typography>

        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, mx: 2 }}>
          <Search>
            <SearchIconWrapper>
              <FiSearch />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Search>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => navigate("/cart")}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            {isAuthenticated ? <Chip label={user.name[0]} /> : <CgProfile size={24} />}
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {!isAuthenticated && <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>}
          {isAuthenticated && [
            <MenuItem key="orders" onClick={() => navigate("/orders")}>
              Orders
            </MenuItem>,
            <MenuItem key="wishlist" onClick={() => navigate("/wishlist")}>
              Wishlist
            </MenuItem>,
            <MenuItem key="logout" onClick={logout}>
              Logout
            </MenuItem>,
          ]}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
