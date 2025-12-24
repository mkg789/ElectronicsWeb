import Grid from "../../shared/components/Grid2";
import ProductCard from "./ProductCard";
import { Container } from "@mui/material";

export default function ProductGrid({ products, spacing = 2 }) {
  return (
    <Container
      maxWidth="lg"
      disableGutters
      sx={{
        px: { xs: 1.5, sm: 2, md: 0 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Grid container spacing={spacing}>
        {products.map((product) => (
          <Grid
            key={product._id}
            xs={6}
            sm={6}
            md={4}
            lg={3}
            sx={{
              display: "flex",
            }}
          >
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
