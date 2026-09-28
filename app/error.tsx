"use client";

// error.tsx must be a Client Component — Next.js renders it in place of the
// segment that threw, and gives it a reset() function to retry rendering.
// This catches unexpected runtime errors anywhere under the root layout.

import { useEffect } from "react";
import { Container, Typography, Button, Box } from "@mui/material";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Something went wrong
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        An unexpected error occurred while loading this page.
      </Typography>
      <Box>
        <Button variant="contained" onClick={() => reset()}>
          Try Again
        </Button>
      </Box>
    </Container>
  );
}
