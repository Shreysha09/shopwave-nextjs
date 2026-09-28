"use client";

import { useRouter } from "next/navigation";
import { Container, Paper, Typography, Avatar, Stack, Button, Divider, Box } from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

function ProfileContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null; // ProtectedRoute guarantees this won't render while logged out

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main", fontSize: 22 }}>
            {user.firstName[0]}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body1">{user.phone || "Not provided"}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Address
            </Typography>
            <Typography variant="body1">{user.address || "Not provided"}</Typography>
          </Box>
        </Stack>

        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
