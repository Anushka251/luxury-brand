"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useSession } from "next-auth/react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  size?: string;
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
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ LOAD LOCAL CART (guest)
  useEffect(() => {
    if (session) return;

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [session]);

  // ✅ SAVE LOCAL CART (guest)
  useEffect(() => {
    if (session) return;

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, session]);

  // 🔥 MERGE FUNCTION
  const mergeCarts = (localCart: CartItem[], dbCart: CartItem[]) => {
    const merged = [...dbCart];

    localCart.forEach((localItem) => {
      const exists = merged.find(
        (i) =>
          i.id === localItem.id &&
          i.size === localItem.size
      );

      if (exists) {
        exists.quantity += localItem.quantity;
      } else {
        merged.push(localItem);
      }
    });

    return merged;
  };

  // ✅ LOAD USER CART (with merge)
  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    const loadCart = async () => {
      try {
        const res = await fetch("/api/cart?email=" + email);
        const data = await res.json();

        const dbCart = data.items || [];

        const localCart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        const finalCart = mergeCarts(localCart, dbCart);

        setCart(finalCart);

        // save merged cart to DB
        await fetch("/api/cart", {
          method: "POST",
          body: JSON.stringify({
            email,
            cart: finalCart,
          }),
        });

        localStorage.removeItem("cart");
      } catch (err) {
        console.error("Load cart error:", err);
      }
    };

    loadCart();
  }, [session]);

  // ✅ SAVE USER CART (to DB)
  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    const saveCart = async () => {
      try {
        await fetch("/api/cart", {
          method: "POST",
          body: JSON.stringify({
            email,
            cart,
          }),
        });
      } catch (err) {
        console.error("Save cart error:", err);
      }
    };

    saveCart();
  }, [cart, session]);

  // ✅ ADD TO CART
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

  // ✅ REMOVE ITEM
  const removeFromCart = (id: string, size?: string) =>
    setCart((prev) =>
      prev.filter((i) => !(i.id === id && i.size === size))
    );

  // ✅ UPDATE QUANTITY
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
  const clearCart = () => {
    setCart([]);

    if (!session) {
      localStorage.removeItem("cart");
    }
  };

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
  if (!context)
    throw new Error("useCart must be used within CartProvider");
  return context;
};