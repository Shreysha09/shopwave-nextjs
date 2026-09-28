"use client";

// Client Component: filtering/sorting happens live in the browser as the
// user types or changes a dropdown, driven by React state + the URL's
// search params (?search=&category=). useSearchParams() only works in a
// Client Component, and Next.js requires it to be wrapped in <Suspense> so
// the rest of the page can still be server-rendered around it.

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Button,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import productsData from "@/data/products.json";
import { Product } from "@/types";
import ProductGrid from "@/components/ProductGrid";

const allProducts = productsData as Product[];
const CATEGORIES = ["All", "Electronics", "Clothing", "Shoes", "Beauty", "Home", "Accessories"];
const PAGE_SIZE = 8;

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating-desc";

function ProductsPageContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let result = allProducts;

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating-desc") sorted.sort((a, b) => b.rating - a.rating);

    return sorted;
  }, [search, category, sort]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        All Products
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            placeholder="Search by name, category, or description…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} sm={3.5}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              label="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3.5}>
          <FormControl fullWidth>
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select
              labelId="sort-label"
              label="Sort by"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
            >
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="rating-desc">Rating</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
      </Typography>

      <ProductGrid products={visibleProducts} />

      {hasMore && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="outlined" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Load More
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}
