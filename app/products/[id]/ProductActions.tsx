"use client";

// Split out from the (Server Component) product page because a quantity
// selector needs local state, and "Add to Cart" / "Buy Now" need useCart()
// and the router. Keeping this as its own small Client Component means the
// rest of the product page — description, images, related products list —
// can stay server-rendered.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, IconButton, Stack, Typography, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

export default function ProductActions({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const outOfStock = product.stock === 0;

  function handleAddToCart() {
    addToCart(product, quantity);
    setSnackbarOpen(true);
  }

  function handleBuyNow() {
    addToCart(product, quantity);
    router.push("/cart");
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="subtitle2">Quantity</Typography>
        <Stack direction="row" alignItems="center" sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <IconButton
            size="small"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ px: 2 }}>{quantity}</Typography>
          <IconButton
            size="small"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          Add to Cart
        </Button>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleBuyNow}
          disabled={outOfStock}
        >
          Buy Now
        </Button>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Added to cart
        </Alert>
      </Snackbar>
    </Box>
  );
}
