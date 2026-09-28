import { Grid, Typography, Box } from "@mui/material";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

// Pure presentational grid — no state of its own, so it stays a Server
// Component. It renders ProductCard (a Client Component) for each product;
// Next.js allows Server Components to render Client Components like this.
export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No products found.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try a different search term or filter.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item key={product.id} xs={6} sm={4} md={3}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
