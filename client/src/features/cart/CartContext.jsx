import { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import useCart from "./useCart";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const cartData = useCart();

  // Memoize to prevent unnecessary re-renders
  const value = useMemo(() => cartData, [cartData]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return ctx;
};
