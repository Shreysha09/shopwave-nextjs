// The Root Layout is a Server Component by default (no "use client" here).
// It renders once on the server and wraps every page. It's the right place
// for <html>/<body>, global fonts, and metadata — things that don't change
// per-page-interaction.

import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Box } from "@mui/material";
import ThemeRegistry from "./ThemeRegistry";
import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "ShopWave — Everyday essentials, delivered with care",
  description:
    "A learning e-commerce project built with Next.js, TypeScript, and Material UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <ThemeRegistry>
          <Providers>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <Header />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
