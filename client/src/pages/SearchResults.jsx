import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query && query.trim() !== "") {
      loadResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Search Results for "{query}"
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : results.length === 0 ? (
        <Typography variant="h6" color="text.secondary" mt={3}>
          No products found for "{query}"
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {results.map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
              <Card sx={{ boxShadow: 3, cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={p.imageUrl || "/placeholder.png"}
                  alt={p.name}
                  onClick={() => navigate(`/product/${p._id}`)}
                />

                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    {p.name}
                  </Typography>

                  <Typography variant="body1" fontWeight={500} color="primary">
                    ${p.price}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
