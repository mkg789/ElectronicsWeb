import { QueryClientProvider } from "@tanstack/react-query";
// Optional but highly recommended for dev
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

import { queryClient } from "./queryClient";
import AppRouter from "./router";

// Context Providers
import { AuthProvider } from "../features/auth/AuthContext";
import { CartProvider } from "../features/cart/CartContext";

// Shared Layout Components
import Navbar from "../shared/components/Navbar";
import Footer from "../shared/components/Footer";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#D6B56D", contrastText: "#111111" },
    secondary: { main: "#A8894A" },
    background: { default: "#080808", paper: "#171717" },
    text: { primary: "#F5F2EA", secondary: "#A5A5A5" },
    divider: "rgba(214, 181, 109, 0.18)",
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontFamily: "Manrope, sans-serif" },
    h2: { fontFamily: "Manrope, sans-serif" },
    h3: { fontFamily: "Manrope, sans-serif" },
    h4: { fontFamily: "Manrope, sans-serif" },
    h5: { fontFamily: "Manrope, sans-serif" },
    h6: { fontFamily: "Manrope, sans-serif" },
    button: { fontWeight: 700, textTransform: "none" },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 3 },
        containedPrimary: {
          color: "#111111",
          background: "linear-gradient(110deg, #D6B56D, #C2A15B)",
        },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <AppRouter />
            <Footer />
          </CartProvider>
        </AuthProvider>

        {/* React Query Devtools (dev only) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
