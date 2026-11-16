import { Box, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  return (
    <Box component="footer" className="lux-footer" id="about">
      <div className="lux-container">
        <div className="footer-main">
          <div className="footer-brand">
            <RouterLink className="brand-mark footer-logo" to="/">
              <span className="brand-mark-symbol">Z</span>
              <span>Zyntrica</span>
            </RouterLink>
            <Typography variant="body2" color="text.secondary">
              Thoughtfully selected technology for the way you live, work, and create.
            </Typography>
          </div>
          <div className="footer-column">
            <span className="lux-eyebrow">Explore</span>
            <Link component={RouterLink} to="/products">All products</Link>
            <Link component={RouterLink} to="/#categories">Categories</Link>
            <Link component={RouterLink} to="/#brands">Brands</Link>
          </div>
          <div className="footer-column">
            <span className="lux-eyebrow">Your account</span>
            <Link component={RouterLink} to="/orders">Order history</Link>
            <Link component={RouterLink} to="/wishlist">Wishlist</Link>
            <Link component={RouterLink} to="/cart">Shopping bag</Link>
          </div>
        </div>
        <Stack className="footer-bottom" direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Zyntrica. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="/privacy" underline="hover" color="text.secondary">Privacy</Link>
            <Link href="/terms" underline="hover" color="text.secondary">Terms</Link>
          </Stack>
        </Stack>
      </div>
    </Box>
  );
}
