// Small, framework-free helper functions used across the app.

/** Format a number as Indian Rupees, e.g. 2999 -> "₹2,999" */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Generate a simple mock order ID like "ORD-7F3A2C" */
export function generateOrderId(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${random}`;
}

/** Basic email format check for client-side validation */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
