import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  Menu,
  MenuItem,
  InputBase,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { CgProfile } from "react-icons/cg";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

import { useAuth } from "../../features/auth/AuthContext";
import { useCartContext } from "../../features/cart/CartContext";

/* ---------------- Styled Search ---------------- */

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.action.active, 0.06),
  "&:hover": {
    backgroundColor: alpha(theme.palette.action.active, 0.12),
  },
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  left: theme.spacing(1),
  height: "100%",
  display: "flex",
  alignItems: "center",
  pointerEvents: "none",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: "100%",
  paddingLeft: theme.spacing(4),
}));

/* ---------------- Component ---------------- */

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCartContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const cartCount = useMemo(
    () => (cart || []).reduce((sum, i) => sum + (i.quantity || 0), 0),
    [cart]
  );

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "?";

  const closeMenu = () => setAnchorEl(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    // If already on /search, reload to fetch new results
    if (location.pathname === "/search") {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`, { replace: true });
      window.location.reload();
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }

    setMobileSearchOpen(false);
  };

  /* ---------------- Render ---------------- */

  return (
    <AppBar position="sticky" elevation={1} color="inherit">
      <Toolbar sx={{ gap: 1 }}>
        {/* Logo */}
        {!mobileSearchOpen && (
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ cursor: "pointer", flexShrink: 0 }}
            onClick={() => navigate("/")}
          >
            Zyntrica
          </Typography>
        )}

        {/* Search */}
        {(mobileSearchOpen || !isMobile) && (
          <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, mx: 2 }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                autoFocus={isMobile}
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Search>
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          {/* Mobile Search Toggle */}
          {isMobile && !mobileSearchOpen && (
            <IconButton onClick={() => setMobileSearchOpen(true)}>
              <SearchIcon />
            </IconButton>
          )}

          {isMobile && mobileSearchOpen && (
            <IconButton onClick={() => setMobileSearchOpen(false)}>
              <CloseIcon />
            </IconButton>
          )}

          {/* Cart */}
          <IconButton onClick={() => navigate("/cart")}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton onClick={(e) => setAnchorEl((prev) => (prev ? null : e.currentTarget))}>
            {isAuthenticated ? (
              <Avatar sx={{ width: 32, height: 32 }}>{userInitial}</Avatar>
            ) : (
              <CgProfile size={24} />
            )}
          </IconButton>
        </Box>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {!isAuthenticated ? (
            <MenuItem onClick={() => { closeMenu(); navigate("/login"); }}>Login</MenuItem>
          ) : (
            <>
              <MenuItem onClick={() => { closeMenu(); navigate("/orders"); }}>Orders</MenuItem>
              <MenuItem onClick={() => { closeMenu(); navigate("/wishlist"); }}>Wishlist</MenuItem>
              <MenuItem onClick={() => { closeMenu(); logout(); }}>Logout</MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
