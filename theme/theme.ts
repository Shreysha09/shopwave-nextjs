"use client";

import { createTheme } from "@mui/material/styles";

// One place for all visual tokens: colors, type, shape.
// Palette: deep pine primary + warm amber accent, on a soft ivory background.
const theme = createTheme({
  palette: {
    primary: {
      main: "#1B4B43",
      light: "#3D6D63",
      dark: "#0F332D",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E08E45",
      light: "#EAA968",
      dark: "#B96F2E",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F6F5F1",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A18",
      secondary: "#5C5B56",
    },
    success: { main: "#2E7D32" },
    error: { main: "#C62828" },
  },
  typography: {
    fontFamily: "var(--font-inter), Arial, sans-serif",
    h1: { fontFamily: "var(--font-manrope), Arial, sans-serif", fontWeight: 700 },
    h2: { fontFamily: "var(--font-manrope), Arial, sans-serif", fontWeight: 700 },
    h3: { fontFamily: "var(--font-manrope), Arial, sans-serif", fontWeight: 700 },
    h4: { fontFamily: "var(--font-manrope), Arial, sans-serif", fontWeight: 700 },
    h5: { fontFamily: "var(--font-manrope), Arial, sans-serif", fontWeight: 600 },
    h6: { fontFamily: "var(--font-manrope), Arial, sans-serif", fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingLeft: 20,
          paddingRight: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        },
      },
    },
  },
});

export default theme;
