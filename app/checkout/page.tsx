"use client";

// Client Component, and wrapped in <ProtectedRoute> below: this is where
// "Checkout should require login" is actually enforced. If there's no user,
// ProtectedRoute redirects to /login before this form is ever shown.

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Stack,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
} from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, generateOrderId } from "@/lib/utils";
import { Order, PaymentMethod, ShippingAddress } from "@/types";

const SHIPPING_FEE = 79;
const FREE_SHIPPING_THRESHOLD = 999;
const LAST_ORDER_KEY = "shopwave_last_order";

function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<ShippingAddress>({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);

  const originalTotal = items.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );
  const discount = originalTotal - subtotal;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  function updateField<K extends keyof ShippingAddress>(key: K, value: ShippingAddress[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePlaceOrder(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const order: Order = {
      id: generateOrderId(),
      items,
      shipping: form,
      paymentMethod,
      subtotal,
      discount,
      shippingFee,
      total,
      createdAt: new Date().toISOString(),
    };

    // For this POC we hand the order to the success page via localStorage.
    // A real app would POST this to a backend and get an order ID back.
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    clearCart();
    router.push("/order-success");
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5">Your cart is empty</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add a few products before checking out.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Checkout
      </Typography>

      <Box component="form" onSubmit={handlePlaceOrder}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Customer Information
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Full name"
                  required
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Email"
                    type="email"
                    required
                    fullWidth
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                  <TextField
                    label="Phone"
                    required
                    fullWidth
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </Stack>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Shipping Address
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Address"
                  required
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="City"
                    required
                    fullWidth
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                  <TextField
                    label="State"
                    required
                    fullWidth
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                  />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Country"
                    required
                    fullWidth
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                  />
                  <TextField
                    label="Pincode"
                    required
                    fullWidth
                    value={form.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                  />
                </Stack>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment Method
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label="Dummy Card Payment (no real charge — POC only)"
                />
              </RadioGroup>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 3, position: "sticky", top: 88 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Summary
              </Typography>
              <Stack spacing={1.2} sx={{ maxHeight: 260, overflowY: "auto", mb: 2 }}>
                {items.map((item) => (
                  <Stack direction="row" justifyContent="space-between" key={item.product.id}>
                    <Typography variant="body2" sx={{ maxWidth: "70%" }}>
                      {item.product.name} × {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      {formatPrice(item.product.price * item.quantity)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
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
                    {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
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
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                disabled={submitting}
              >
                Place Order
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutForm />
    </ProtectedRoute>
  );
}
