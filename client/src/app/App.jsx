import { QueryClientProvider } from "@tanstack/react-query";
// Optional but highly recommended for dev
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "./queryClient";
import AppRouter from "./router";

// Context Providers
import { AuthProvider } from "../features/auth/AuthContext";
import { CartProvider } from "../features/cart/CartContext";

// Shared Layout Components
import Navbar from "../shared/components/Navbar";
import Footer from "../shared/components/Footer";

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            {/* Persistent Layout */}
            <Navbar />
            <AppRouter />
            <Footer />
          </CartProvider>
        </AuthProvider>

        {/* React Query Devtools (dev only) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  );
}
