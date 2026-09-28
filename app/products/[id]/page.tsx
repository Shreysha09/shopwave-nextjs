// Server Component (no "use client"). Next.js gives every page a `params`
// object built from the dynamic route segment — the folder name "[id]"
// becomes params.id. Because this runs on the server, we can read the JSON
// file and call notFound() directly, with zero client-side loading spinner.

import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Grid, Box, Typography, Chip, Rating, Stack, Divider } from "@mui/material";
import productsData from "@/data/products.json";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import ProductActions from "./ProductActions";
import ProductGrid from "@/components/ProductGrid";

const products = productsData as Product[];

function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === Number(id));
}

// generateMetadata runs on the server per-request and sets the page's
// <title>/description — good for SEO and browser tabs, and it can use the
// same data-fetching logic as the page itself.
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = getProduct(params.id);
  if (!product) return { title: "Product not found — ShopWave" };
  return {
    title: `${product.name} — ShopWave`,
    description: product.description,
  };
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);

  // notFound() renders the nearest not-found.tsx (see the sibling file in
  // this folder) instead of crashing — the standard way to handle an
  // invalid dynamic route segment.
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: 2, overflow: "hidden" }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Chip label={product.category} size="small" sx={{ mb: 1.5 }} />
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            {product.name}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              {product.rating} rating
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="baseline" sx={{ mb: 2 }}>
            <Typography variant="h4" fontWeight={700}>
              {formatPrice(product.price)}
            </Typography>
            {product.originalPrice > product.price && (
              <>
                <Typography variant="h6" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                  {formatPrice(product.originalPrice)}
                </Typography>
                <Chip label={`${product.discount}% OFF`} color="secondary" size="small" />
              </>
            )}
          </Stack>

          <Typography
            variant="body2"
            sx={{ color: product.stock > 0 ? "success.main" : "error.main", mb: 2, fontWeight: 600 }}
          >
            {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <ProductActions product={product} />
        </Grid>
      </Grid>

      {related.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Related Products
          </Typography>
          <ProductGrid products={related} />
        </Box>
      )}
    </Container>
  );
}
