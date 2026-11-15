import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Box, Container, Snackbar, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "./hooks";
import { fetchProducts } from "./api";
import ProductGrid from "./ProductGrid";
import ProductDetails from "./ProductDetails";
import Loader from "../../shared/components/Loader";
import { useCartContext } from "../cart/CartContext";
import { addToCart as addProductToCart } from "../cart/api";
import { addWishlistItem, fetchWishlist } from "../wishlist/api";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProduct(id);
  const { cart, loadCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const inCart = useMemo(
    () => cart?.some((item) => item.productId?._id === id),
    [cart, id]
  );
  const inWishlist = wishlistIds.includes(id);

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    if (!product) return undefined;
    let active = true;
    fetchProducts()
      .then((products) => {
        if (active) {
          setRelatedProducts(
            (products || [])
              .filter((item) => item._id !== product._id && item.category === product.category)
              .slice(0, 4)
          );
        }
      })
      .catch((error) => console.error("Failed to load related products:", error));
    return () => { active = false; };
  }, [product]);

  useEffect(() => {
    if (!product || !localStorage.getItem("token")) return undefined;
    let active = true;
    fetchWishlist()
      .then((result) => {
        const items = Array.isArray(result) ? result : result?.data || [];
        if (active) setWishlistIds(items.map((item) => item.productId?._id).filter(Boolean));
      })
      .catch((error) => console.error("Failed to load wishlist:", error));
    return () => { active = false; };
  }, [product]);

  const requireAuthentication = useCallback(() => {
    if (localStorage.getItem("token")) return true;
    navigate("/login");
    return false;
  }, [navigate]);

  const handleAddToCart = useCallback(async () => {
    if (!requireAuthentication()) return;
    setActionLoading(true);
    try {
      for (let item = 0; item < quantity; item += 1) {
        await addProductToCart(product._id);
      }
      await loadCart();
      setSnackbar({ open: true, message: "Added to your shopping bag.", severity: "success" });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      setSnackbar({ open: true, message: "Could not add this product to your bag.", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  }, [loadCart, product, quantity, requireAuthentication]);

  const handleAddToWishlist = useCallback(async () => {
    if (!requireAuthentication()) return;
    setActionLoading(true);
    try {
      await addWishlistItem(product._id);
      setWishlistIds((current) => [...new Set([...current, product._id])]);
      setSnackbar({ open: true, message: "Added to your wishlist.", severity: "success" });
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      setSnackbar({ open: true, message: "Could not update your wishlist.", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  }, [product, requireAuthentication]);

  if (loading) return <Loader fullPage message="Loading product..." />;

  if (!product) {
    return (
      <Container className="lux-page product-not-found" maxWidth="sm">
        <Typography variant="h5">Product not found</Typography>
      </Container>
    );
  }

  return (
    <Box className="lux-page product-page">
      <Container maxWidth="lg" className="product-page-container">
        <ProductDetails
          product={product}
          inCart={inCart}
          inWishlist={inWishlist}
          loading={actionLoading}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <div className="lux-section-heading">
              <div>
                <span className="lux-eyebrow">Continue exploring</span>
                <Typography component="h2" className="lux-heading">Related products</Typography>
              </div>
            </div>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
