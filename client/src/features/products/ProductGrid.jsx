import Grid from "../../shared/components/Grid2";
import ProductCard from "./ProductCard";
import { Container, Box } from "@mui/material";

export default function ProductGrid({ products, spacing = 3 }) {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Grid container spacing={spacing}>
        {products.map((p) => (
          <Grid
            key={p._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{
              display: "flex",       // make the Grid item flex
            }}
          >
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <ProductCard product={p} sx={{ flexGrow: 1 }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
