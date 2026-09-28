"use client";

// Groups every global Context Provider in one place so layout.tsx stays
// readable. Add new global state (e.g. a WishlistProvider) here later.

import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
