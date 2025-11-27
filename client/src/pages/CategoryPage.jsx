import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/products/category/${name}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load category products:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [name]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        {name} Products
      </Typography>

      {products.length === 0 ? (
        <Alert severity="info">No products available in this category.</Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={p.imageUrl || "/placeholder.png"}
                  alt={p.name}
                />

                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ cursor: "pointer", mb: 1 }}
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    {p.name}
                  </Typography>

                  <Typography variant="body1" color="primary" mb={2}>
                    ${p.price}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
