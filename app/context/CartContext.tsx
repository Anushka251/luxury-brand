"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  size?: string; // ✅ added size support
};

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQuantity: (
    id: string,
    size: string | undefined,
    quantity: number
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ ADD TO CART (handles size properly)
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exists = prev.find(
        (i) => i.id === item.id && i.size === item.size
      );

      if (exists) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, item];
    });
  };

  // ✅ REMOVE ITEM (with size)
  const removeFromCart = (id: string, size?: string) =>
    setCart((prev) =>
      prev.filter((i) => !(i.id === id && i.size === size))
    );

  // ✅ UPDATE QUANTITY (with size)
  const updateQuantity = (
    id: string,
    size: string | undefined,
    quantity: number
  ) =>
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size
          ? { ...i, quantity: Math.max(quantity, 1) }
          : i
      )
    );

  // ✅ CLEAR CART
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ HOOK
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};