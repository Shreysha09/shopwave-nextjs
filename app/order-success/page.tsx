"use client";

// Client Component because it reads the order out of localStorage (the
// simple hand-off from checkout — see the comment in app/checkout/page.tsx).
// A real app would instead read an order ID from the URL and fetch it from
// a backend.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";

const LAST_ORDER_KEY = "shopwave_last_order";

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    setOrder(raw ? JSON.parse(raw) : null);
  }, []);

  if (order === undefined) return null;

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          No recent order found
        </Typography>
        <Button component={Link} href="/products" variant="contained">
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 56, mb: 1 }} />
        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
          Order placed successfully!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Order ID: <strong>{order.id}</strong>
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1} sx={{ textAlign: "left", mb: 2 }}>
          {order.items.map((item) => (
            <Stack direction="row" justifyContent="space-between" key={item.product.id}>
              <Typography variant="body2">
                {item.product.name} × {item.quantity}
              </Typography>
              <Typography variant="body2">
                {formatPrice(item.product.price * item.quantity)}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Total Paid
          </Typography>
          <Typography variant="subtitle1" fontWeight={700}>
            {formatPrice(order.total)}
          </Typography>
        </Stack>

        <Box>
          <Button component={Link} href="/products" variant="contained" size="large">
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
