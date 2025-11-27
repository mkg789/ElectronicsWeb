// src/context/CartContext.jsx
import React, { createContext, useContext } from 'react';
import useCart from '../hooks/useCart'; // Import your custom hook

// 1. Define the Context - Note: createContext() without an argument defaults to undefined.
const CartContext = createContext(undefined); // Explicitly set default to undefined

// 2. Create the Provider component
export function CartProvider({ children }) {
    // All cart logic is handled by the hook
    const cartData = useCart(); 

    // The context value exposes the data and actions
    return (
        <CartContext.Provider value={cartData}>
            {children}
        </CartContext.Provider>
    );
}

// 3. Custom hook to consume the context (The recommended change is here)
export const useCartContext = () => {
    const context = useContext(CartContext);

    // 🛑 SAFETY CHECK: If the context value is undefined, it means the hook 
    // was called outside of the provider. Throw a clear error.
    if (context === undefined) {
        throw new Error('useCartContext must be used within a CartProvider.');
    }

    return context;
};