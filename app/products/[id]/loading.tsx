// Next.js automatically shows this while the Server Component above is
// still fetching/rendering (via React Suspense under the hood). With a
// local JSON file it resolves almost instantly, but this is exactly where a
// real API call's loading state would appear — no extra wiring needed.

import { Container, Grid, Skeleton } from "@mui/material";

export default function ProductDetailsLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rounded" sx={{ width: "100%", aspectRatio: "1 / 1" }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton width="40%" height={32} sx={{ mb: 2 }} />
          <Skeleton width="80%" height={48} sx={{ mb: 2 }} />
          <Skeleton width="60%" height={28} sx={{ mb: 3 }} />
          <Skeleton width="100%" height={100} />
        </Grid>
      </Grid>
    </Container>
  );
}
