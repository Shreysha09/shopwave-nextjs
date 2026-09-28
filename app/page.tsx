// This page has no "use client" directive, so it's a Server Component.
// It reads products.json directly at build/request time on the server —
// no useEffect + fetch dance needed, and none of this code ships to the
// browser as JavaScript. ProductCard (used inside ProductGrid) is a Client
// Component "island" for the interactive "Add to Cart" button; everything
// else on this page stays server-rendered HTML.

import Link from "next/link";
import Image from "next/image";
import { Box, Container, Typography, Button, Grid, Paper, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import productsData from "@/data/products.json";
import { Product } from "@/types";
import ProductGrid from "@/components/ProductGrid";

const products = productsData as Product[];

const CATEGORIES = ["Electronics", "Clothing", "Shoes", "Beauty", "Home", "Accessories"];

export default function HomePage() {
  const featured = products.slice(0, 4);
  const newArrivals = [...products].reverse().slice(0, 4);

  return (
    <>
      {/* Hero */}
      <Box sx={{ bgcolor: "primary.main", color: "white" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" sx={{ py: { xs: 6, md: 10 } }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: "2.2rem", md: "3rem" }, mb: 2, lineHeight: 1.15 }}
              >
                Everyday essentials, delivered with care.
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.85, maxWidth: 480 }}>
                Discover electronics, fashion, beauty, and home goods — all in one
                place, at prices that make sense.
              </Typography>
              <Button
                component={Link}
                href="/products"
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                Shop Now
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="https://picsum.photos/seed/hero-shopwave/900/675"
                  alt="Featured products flat-lay"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Categories */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          Shop by Category
        </Typography>
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {CATEGORIES.map((cat) => (
            <Grid item xs={6} sm={4} md={2} key={cat}>
              <Paper
                component={Link}
                href={`/products?category=${encodeURIComponent(cat)}`}
                elevation={0}
                sx={{
                  display: "block",
                  textDecoration: "none",
                  color: "text.primary",
                  textAlign: "center",
                  py: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "border-color 0.15s ease",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {cat}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Featured products */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5">Featured Products</Typography>
          <Button component={Link} href="/products" endIcon={<ArrowForwardIcon />}>
            View all
          </Button>
        </Stack>
        <ProductGrid products={featured} />

        {/* Promo banner */}
        <Paper
          elevation={0}
          sx={{
            my: 6,
            p: { xs: 3, md: 5 },
            bgcolor: "secondary.main",
            color: "white",
            borderRadius: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { sm: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Season sale — up to 40% off
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Limited-time discounts across every category.
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            sx={{ bgcolor: "white", color: "secondary.dark", "&:hover": { bgcolor: "#f5f5f5" } }}
          >
            Explore Deals
          </Button>
        </Paper>

        {/* New arrivals */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          New Arrivals
        </Typography>
        <ProductGrid products={newArrivals} />
      </Container>
    </>
  );
}
