"use client";

// Client Component: reads and mutates cart state via useCart(). The cart
// itself is viewable by anyone; only "Proceed to Checkout" leads to a
// protected route (see app/checkout/page.tsx), which is where login is
// actually enforced.

import Link from "next/link";
import Image from "next/image";
import {
  Container,
  Typography,
  Grid,
  Box,
  IconButton,
  Button,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 79;

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  const originalTotal = items.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );
  const discount = originalTotal - subtotal;
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Your cart is empty
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven&apos;t added anything yet.
        </Typography>
        <Button component={Link} href="/products" variant="contained">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Your Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {items.map((item) => (
              <Paper key={item.product.id} variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3} sm={2}>
                    <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: 1, overflow: "hidden" }}>
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={9} sm={4}>
                    <Typography
                      component={Link}
                      href={`/products/${item.product.id}`}
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatPrice(item.product.price)} each
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, width: "fit-content" }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ px: 1.5 }}>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Grid>
                  <Grid item xs={5} sm={2}>
                    <Typography fontWeight={700}>
                      {formatPrice(item.product.price * item.quantity)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sm={1} sx={{ textAlign: "right" }}>
                    <IconButton
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label="Remove item"
                      color="error"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, position: "sticky", top: 88 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Summary
            </Typography>
            <Stack spacing={1.2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2">{formatPrice(subtotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Discount
                </Typography>
                <Typography variant="body2" color="success.main">
                  − {formatPrice(discount)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Shipping
                </Typography>
                <Typography variant="body2">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  {formatPrice(total)}
                </Typography>
              </Stack>
            </Stack>
            <Button
              component={Link}
              href="/checkout"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
