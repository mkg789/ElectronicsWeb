# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

src/
├─ app/
│ ├─ App.jsx
│ ├─ router.jsx
│ └─ queryClient.js   ← (React Query setup)
│
├─ features/
│ ├─ auth/
│ │ ├─ api.js
│ │ ├─ AuthContext.jsx
│ │ ├─ Login.jsx
│ │ └─ Signup.jsx
│ │
│ ├─ products/
│ │ ├─ api.js
│ │ ├─ hooks.js
│ │ ├─ ProductCard.jsx
│ │ ├─ ProductGrid.jsx
│ │ ├─ ProductsPage.jsx
│ │ ├─ CategoryPage.jsx
│ │ └─ SearchResults.jsx
│ │
│ ├─ cart/
│ │ ├─ api.js
│ │ ├─ CartContext.jsx
│ │ ├─ useCart.js
│ │ ├─ CartItem.jsx
│ │ ├─ CartPage.jsx
│ │ └─ CheckoutPage.jsx
│ │
│ ├─ orders/
│ │ ├─ api.js
│ │ ├─ OrderSummary.jsx
│ │ ├─ OrderHistoryPage.jsx
│ │ ├─ OrderDetailsPage.jsx
│ │ └─ OrderSuccess.jsx
│ │
│ ├─ wishlist/
│ │ ├─ api.js
│ │ ├─ WishlistPage.jsx
│ │ └─ useWishlist.js
│ │
│ └─ home/
│   ├─ HomePage.jsx
│   ├─ HeroBanner.jsx
│   ├─ CategoryStrip.jsx
│   └─ FeaturedProducts.jsx
│
├─ shared/
│ ├─ components/
│ │ ├─ Navbar.jsx
│ │ ├─ Footer.jsx
│ │ └─ Loader.jsx
│ │
│ ├─ ui/
│ │ ├─ ConfirmDialog.jsx
│ │ └─ EmptyState.jsx
│ │
│ └─ utils/
│   └─ formatCurrency.js
│
├─ api/
│ └─ axios.js
│
└─ index.jsx
