import Link from "next/link";
import { Box, Container, Grid, Typography, IconButton, Stack, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

// No state, no event handlers beyond plain links -> stays a Server Component.
// It's rendered once on the server and shipped as HTML, so it adds nothing
// to the client-side JavaScript bundle.
const COLUMNS = [
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/" },
      { label: "Careers", href: "/" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Contact Us", href: "/" },
      { label: "FAQs", href: "/" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms & Conditions", href: "/" },
      { label: "Shipping Information", href: "/" },
      { label: "Return Policy", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "primary.dark", color: "white", mt: 8, pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              ShopWave
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Everyday essentials, delivered with care. A learning project built with Next.js.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton size="small" sx={{ color: "white" }} aria-label="Facebook">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: "white" }} aria-label="Instagram">
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: "white" }} aria-label="Twitter">
                <TwitterIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {COLUMNS.map((col) => (
            <Grid item xs={6} sm={3} key={col.title}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                {col.title}
              </Typography>
              <Stack spacing={1}>
                {col.links.map((link) => (
                  <Typography
                    key={link.label}
                    component={Link}
                    href={link.href}
                    variant="body2"
                    sx={{ color: "white", opacity: 0.8, textDecoration: "none", "&:hover": { opacity: 1 } }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", my: 3 }} />

        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} ShopWave. Built for learning purposes — not a real store.
        </Typography>
      </Container>
    </Box>
  );
}
