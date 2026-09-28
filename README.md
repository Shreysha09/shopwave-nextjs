# ShopWave — Next.js E-Commerce Learning Project

A beginner-friendly, fully working e-commerce POC built with **Next.js (App Router)**,
**TypeScript**, and **Material UI**, using a local JSON file as mock data —
no backend, no database.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. (Verified: `npm install` and `npm run build` both
succeed against this exact file set.)

## Project structure

```
app/               Every route (App Router: folder = URL segment)
  layout.tsx       Root layout — fonts, theme, Header/Footer, global providers
  page.tsx         Home page
  login/           /login
  signup/          /signup
  products/        /products (list) and /products/[id] (dynamic detail page)
  cart/            /cart
  checkout/        /checkout (protected)
  order-success/   /order-success
  profile/         /profile (protected)
components/        Reusable UI: Header, Footer, ProductCard, ProductGrid, ProtectedRoute
context/           AuthContext (mock auth) and CartContext (cart state)
data/products.json 18 mock products
theme/theme.ts     One MUI theme: palette, typography, component overrides
lib/utils.ts       formatPrice, generateOrderId, isValidEmail
types/index.ts     Shared TypeScript interfaces
```

## Key Next.js concepts, explained

**Server vs. Client Components.** Every file is a Server Component unless it
starts with `"use client"`. Server Components run only on the server and
send plain HTML — no JS bundle cost. Use them by default (`app/page.tsx`,
`Footer.tsx`, `ProductGrid.tsx`). A file needs `"use client"` the moment it
uses `useState`, `useEffect`, `onClick`, or a hook like `useAuth()`/`useCart()`
— e.g. `Header.tsx` (menus), `ProductCard.tsx` (Add to Cart button), every
form page. Notice how `ProductGrid` (server) renders `ProductCard` (client)
— Server Components can render Client Components as "islands" of
interactivity inside otherwise-static HTML.

**App Router.** The folder structure *is* the routing: `app/products/page.tsx`
→ `/products`. A folder named `[id]` (`app/products/[id]/page.tsx`) is a
**dynamic route** — Next.js gives the page a `params.id` matching whatever's
in the URL, e.g. `/products/7` → `params.id === "7"`. `layout.tsx` wraps
every page below it (here, the whole site); `not-found.tsx` renders when
`notFound()` is called; `loading.tsx` renders automatically while a Server
Component is fetching; `error.tsx` catches runtime errors.

**Context for global state.** `AuthContext` and `CartContext` each wrap
`children` in a Provider and expose a `useX()` hook. Any component anywhere
in the tree can call `useCart()` and get live cart data — no passing props
down five levels. Both persist to `localStorage` so a refresh doesn't lose
your session or cart (see the `useEffect` calls in each context file).

**Authentication flow (mock).** Signup writes a new user into a
`shopwave_users` array in `localStorage`; login checks email+password
against that array. On success, the logged-in user (without the password)
is stored under `shopwave_session` and put into React state via
`AuthProvider`. This is **not secure** and is explicitly a stand-in — swap
`login`/`signup`/`logout` in `AuthContext.tsx` for real API calls
(`fetch("/api/login", …)`) and everything else in the app keeps working
unchanged, because every component only ever talks to `useAuth()`.

**Protected routes.** `components/ProtectedRoute.tsx` is a Client Component
that checks `useAuth()`; if there's no user once loading finishes, it
`router.replace("/login")`s. `checkout/page.tsx` and `profile/page.tsx` wrap
their content in `<ProtectedRoute>`. The cart page itself is open to anyone;
it's the "Proceed to Checkout" click that lands on a protected page.

**Cart state & localStorage.** `CartContext` keeps `items` in React state
(fast, reactive) and mirrors every change into `localStorage` (durable across
refreshes) via a `useEffect`. On mount, a separate `useEffect` reads
`localStorage` back into state — this two-way sync is the whole trick.

**Data loading (today vs. later).** Right now, `data/products.json` is
imported directly (`import productsData from "@/data/products.json"`) and
read synchronously in Server Components — no loading state needed. To wire
up a real backend: replace that import with `await fetch("https://your-api/products")`
inside the same Server Components (Next.js lets Server Components be
`async` and fetch data directly), or move to Next.js **Route Handlers**
(`app/api/products/route.ts`) if you want your own API layer first. The
component code below the fetch barely changes.

## What's intentionally left out

No Redux, no real payment gateway, no backend/database, no production-grade
auth (passwords are stored in plaintext in localStorage — fine for a local
learning POC, never for anything real). These are called out in code
comments wherever they matter.
