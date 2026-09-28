"use client";

// A single product tile used on the home page, products grid, and related
// products. Client Component because the "Add to Cart" button calls
// useCart(), which reads/writes React state.

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Stack,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.12)" },
      }}
    >
      <Link
        href={`/products/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
          <CardMedia sx={{ height: "100%", width: "100%", position: "relative" }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 600px) 50vw, 25vw"
            />
          </CardMedia>
          {product.discount > 0 && (
            <Chip
              label={`${product.discount}% OFF`}
              color="secondary"
              size="small"
              sx={{ position: "absolute", top: 8, left: 8, fontWeight: 600 }}
            />
          )}
        </Box>
      </Link>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {product.category}
        </Typography>
        <Link
          href={`/products/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              mt: 0.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </Typography>
        </Link>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            {product.rating}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {formatPrice(product.price)}
          </Typography>
          {product.originalPrice > product.price && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              {formatPrice(product.originalPrice)}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCartOutlinedIcon />}
          onClick={() => addToCart(product, 1)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of stock" : "Add to Cart"}
        </Button>
      </CardActions>
    </Card>
  );
}
