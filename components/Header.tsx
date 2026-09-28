"use client";

// Header is a Client Component: it holds interactive state (menu open/closed,
// the search box's value) and reacts to clicks, so it can't be rendered on
// the server alone.

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/products" },
];

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState("");

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
      setDrawerOpen(false);
    }
  }

  return (
    <AppBar position="sticky" color="default" sx={{ bgcolor: "background.paper" }}>
      <Toolbar sx={{ gap: 2 }}>
        {isMobile && (
          <IconButton edge="start" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            textDecoration: "none",
            color: "primary.main",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            mr: 2,
          }}
        >
          ShopWave
        </Typography>

        {!isMobile && (
          <Box sx={{ display: "flex", gap: 1 }}>
            {NAV_LINKS.map((link) => (
              <Button key={link.label} component={Link} href={link.href} color="inherit">
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {!isMobile && (
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{ width: 280 }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        <IconButton component={Link} href="/cart" aria-label="Cart">
          <Badge badgeContent={itemCount} color="secondary">
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>

        {user ? (
          <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Account menu">
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14 }}>
                {user.firstName[0]}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
              <MenuItem
                component={Link}
                href="/profile"
                onClick={() => setAnchorEl(null)}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  logout();
                  setAnchorEl(null);
                  router.push("/");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          !isMobile && (
            <Button component={Link} href="/login" variant="contained">
              Login / Signup
            </Button>
          )
        )}
      </Toolbar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation">
          <Box sx={{ p: 2 }}>
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{ mb: 1 }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          </Box>
          <Divider />
          <List>
            {NAV_LINKS.map((link) => (
              <ListItem key={link.label} disablePadding>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider />
            {user ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/profile"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      logout();
                      setDrawerOpen(false);
                      router.push("/");
                    }}
                  >
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Login / Signup" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
