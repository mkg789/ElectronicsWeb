import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Container, MenuItem, TextField, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import { fetchProducts } from "./api";
import { getProductBrand } from "./productUtils";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState(searchParams.get("brand") || "all");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchProducts();
      setProducts(Array.isArray(result) ? result : []);
    } catch (loadError) {
      console.error("Failed to load products:", loadError);
      setError("Products could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setBrand(searchParams.get("brand") || "all");
  }, [searchParams]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products]
  );
  const brands = useMemo(
    () => [...new Set(products.map(getProductBrand).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    const min = minimumPrice === "" ? null : Number(minimumPrice);
    const max = maximumPrice === "" ? null : Number(maximumPrice);
    const filtered = products.filter((product) => {
      const price = Number(product.price);
      const matchesQuery = !term || `${product.name || ""} ${product.description || ""} ${product.category || ""} ${getProductBrand(product)}`.toLowerCase().includes(term);
      return matchesQuery
        && (category === "all" || product.category === category)
        && (brand === "all" || getProductBrand(product) === brand)
        && (min === null || (Number.isFinite(price) && price >= min))
        && (max === null || (Number.isFinite(price) && price <= max));
    });

    if (sort === "price-low") filtered.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-high") filtered.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "name") filtered.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    if (sort === "newest") filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return filtered;
  }, [products, query, category, brand, minimumPrice, maximumPrice, sort]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, category, brand, minimumPrice, maximumPrice, sort]);

  const updateBrand = (value) => {
    setBrand(value);
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete("brand");
    else next.set("brand", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <Box className="lux-page listing-page">
      <Container maxWidth="lg" className="listing-container">
        <div className="listing-heading">
          <div>
            <span className="lux-eyebrow">The complete collection</span>
            <Typography component="h1" className="lux-heading">All products</Typography>
          </div>
          <Typography className="listing-count">
            {loading ? "Loading the collection…" : `${filteredProducts.length} pieces`}
          </Typography>
        </div>

        <Box component="section" className="listing-filters" aria-label="Filter products">
          <TextField
            className="listing-search"
            size="small"
            label="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or description"
          />
          <TextField select size="small" label="Category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <MenuItem value="all">All categories</MenuItem>
            {categories.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
          </TextField>
          {brands.length > 0 && (
            <TextField select size="small" label="Brand" value={brand} onChange={(event) => updateBrand(event.target.value)}>
              <MenuItem value="all">All brands</MenuItem>
              {brands.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
            </TextField>
          )}
          <div className="price-filter">
            <TextField
              size="small"
              type="number"
              label="Min price"
              value={minimumPrice}
              onChange={(event) => setMinimumPrice(event.target.value)}
              inputProps={{ min: 0, "aria-label": "Minimum price" }}
            />
            <span aria-hidden="true">—</span>
            <TextField
              size="small"
              type="number"
              label="Max price"
              value={maximumPrice}
              onChange={(event) => setMaximumPrice(event.target.value)}
              inputProps={{ min: 0, "aria-label": "Maximum price" }}
            />
          </div>
          <TextField select size="small" label="Sort by" value={sort} onChange={(event) => setSort(event.target.value)}>
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="price-low">Price: low to high</MenuItem>
            <MenuItem value="price-high">Price: high to low</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </TextField>
        </Box>

        {error ? (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadProducts}>Retry</Button>}>{error}</Alert>
        ) : loading ? (
          <div className="listing-loading" role="status">Loading products…</div>
        ) : filteredProducts.length ? (
          <>
            <ProductGrid products={filteredProducts.slice(0, visibleCount)} />
            {visibleCount < filteredProducts.length && (
              <Box className="load-more-wrap">
                <Button className="load-more-button" variant="outlined" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                  Load more products
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box className="listing-empty">
            <Typography variant="h6">No products match these filters.</Typography>
            <Typography color="text.secondary">Try adjusting your search or price range.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
