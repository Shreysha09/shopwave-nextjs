// All shared TypeScript interfaces live here so every file agrees on shape.
// In a bigger app you'd split these by domain (product.ts, user.ts, order.ts).

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  rating: number;
  stock: number;
  image: string;
  discount: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export type PaymentMethod = "cod" | "card";

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  createdAt: string;
}
