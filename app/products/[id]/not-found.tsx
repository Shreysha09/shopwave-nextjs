// Next.js automatically renders this file when notFound() is called inside
// this route segment (or any nested one), or when the URL simply doesn't
// match anything. It replaces the default Next.js 404 for this section.

import Link from "next/link";
import { Container, Typography, Button, Box } from "@mui/material";

export default function ProductNotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
        Product not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The product you're looking for doesn't exist or may have been removed.
      </Typography>
      <Box>
        <Button component={Link} href="/products" variant="contained">
          Browse Products
        </Button>
      </Box>
    </Container>
  );
}
