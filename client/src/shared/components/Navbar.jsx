import { useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { useCartContext } from "../../features/cart/CartContext";

const links = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Brands", to: "/#brands" },
  { label: "Categories", to: "/#categories" },
  { label: "About Us", to: "/#about" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCartContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState(null);

  const cartCount = useMemo(
    () => (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart]
  );
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navigateTo = (to) => {
    setMobileMenuOpen(false);
    if (to.startsWith("/#") && location.pathname === "/") {
      document.querySelector(to.slice(1))?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate(to);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="site-header"
      sx={{
        bgcolor: "rgba(8, 8, 8, 0.94)",
        borderBottom: "1px solid rgba(214, 181, 109, 0.14)",
        backdropFilter: "blur(18px)",
      }}
    >
      <Toolbar className="site-toolbar" disableGutters>
        <Box className="site-header-inner">
          <Link className="brand-mark" to="/" aria-label="Zyntrica home">
            <span className="brand-mark-symbol">Z</span>
            <span>Zyntrica</span>
          </Link>

          <Box component="nav" className={`primary-nav${mobileMenuOpen ? " is-open" : ""}`} aria-label="Main navigation">
            {links.map(({ label, to }) => (
              <button
                type="button"
                key={label}
                className={`nav-link${location.pathname === to ? " active" : ""}`}
                onClick={() => navigateTo(to)}
              >
                {label}
              </button>
            ))}
          </Box>

          <Box className="header-actions">
            {searchOpen ? (
              <Box component="form" className="header-search" onSubmit={handleSearch}>
                <SearchIcon fontSize="small" />
                <InputBase
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search the collection"
                  inputProps={{ "aria-label": "Search products" }}
                />
                <IconButton size="small" onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <IconButton className="header-icon" onClick={() => setSearchOpen(true)} aria-label="Search">
                <SearchIcon />
              </IconButton>
            )}
            <IconButton className="header-icon" onClick={() => navigate("/cart")} aria-label={`Shopping bag, ${cartCount} items`}>
              <Badge badgeContent={cartCount} color="primary" max={99}>
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>
            <IconButton
              className="header-icon account-trigger"
              onClick={(event) => setAccountAnchor(event.currentTarget)}
              aria-label="Account menu"
            >
              {isAuthenticated ? <Avatar className="account-avatar">{userInitial}</Avatar> : <CgProfile size={22} />}
            </IconButton>
            <IconButton
              className="header-icon mobile-menu-toggle"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={accountAnchor}
        open={Boolean(accountAnchor)}
        onClose={() => setAccountAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {!isAuthenticated ? (
          <>
            <MenuItem onClick={() => { setAccountAnchor(null); navigate("/login"); }}>Sign in</MenuItem>
            <MenuItem onClick={() => { setAccountAnchor(null); navigate("/signup"); }}>Create account</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => { setAccountAnchor(null); navigate("/orders"); }}>Orders</MenuItem>
            <MenuItem onClick={() => { setAccountAnchor(null); navigate("/wishlist"); }}>Wishlist</MenuItem>
            <MenuItem onClick={() => { setAccountAnchor(null); logout(); }}>Sign out</MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
}
