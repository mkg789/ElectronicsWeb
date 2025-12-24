import Grid from "../../shared/components/Grid2";
import ProductCard from "./ProductCard";
import { Container, Box } from "@mui/material";

export default function ProductGrid({ products, spacing = 3 }) {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Grid container spacing={spacing}>
        {products.map((product) => (
          <Grid
            key={product._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{
              display: "flex",
            }}
          >
            <ProductCard
              product={product}
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
