"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
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
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(
  undefined
);

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: session, status } = useSession();

  const [cart, setCart] = useState<CartItem[]>([]);

  // Prevent saving before loading finishes
  const hasLoadedCart = useRef(false);

  // ==========================
  // Guest Cart Load
  // ==========================
  useEffect(() => {
    if (status === "loading") return;

    if (session) return;

    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("cart");
      }
    }

    hasLoadedCart.current = true;
  }, [session, status]);

  // ==========================
  // Guest Cart Save
  // ==========================
  useEffect(() => {
    if (status === "loading") return;

    if (session) return;

    if (!hasLoadedCart.current) return;

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, session, status]);

  // ==========================
  // Merge Carts
  // ==========================
  const mergeCarts = (
    localCart: CartItem[],
    dbCart: CartItem[]
  ) => {
    const merged = [...dbCart];

    localCart.forEach((localItem) => {
      const existingItem = merged.find(
        (item) =>
          item.id === localItem.id &&
          item.size === localItem.size
      );

      if (existingItem) {
        existingItem.quantity += localItem.quantity;
      } else {
        merged.push(localItem);
      }
    });

    return merged;
  };

  // ==========================
  // Load User Cart
  // ==========================
  useEffect(() => {
    if (status === "loading") return;

    const email = session?.user?.email;

    if (!email) return;

    const loadCart = async () => {
      try {
        const response = await fetch(
          `/api/cart?email=${encodeURIComponent(email)}`
        );

        const data = await response.json();

        const dbCart: CartItem[] = data.items || [];

        const localCart: CartItem[] = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        const finalCart = mergeCarts(
          localCart,
          dbCart
        );

        setCart(finalCart);

        // Save merged cart back to DB
        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            cart: finalCart,
          }),
        });

        localStorage.removeItem("cart");

        hasLoadedCart.current = true;
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error
        );

        hasLoadedCart.current = true;
      }
    };

    loadCart();
  }, [session, status]);

  // ==========================
  // Save User Cart
  // ==========================
  useEffect(() => {
    if (status === "loading") return;

    const email = session?.user?.email;

    if (!email) return;

    if (!hasLoadedCart.current) return;

    const saveCart = async () => {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            cart,
          }),
        });
      } catch (error) {
        console.error(
          "Failed to save cart:",
          error
        );
      }
    };

    saveCart();
  }, [cart, session, status]);

  // ==========================
  // Add To Cart
  // ==========================
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (i) =>
          i.id === item.id &&
          i.size === item.size
      );

      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id &&
          i.size === item.size
            ? {
                ...i,
                quantity:
                  i.quantity + item.quantity,
              }
            : i
        );
      }

      return [...prev, item];
    });
  };

  // ==========================
  // Remove From Cart
  // ==========================
  const removeFromCart = (
    id: string,
    size?: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size
          )
      )
    );
  };

  // ==========================
  // Update Quantity
  // ==========================
  const updateQuantity = (
    id: string,
    size: string | undefined,
    quantity: number
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id &&
        item.size === size
          ? {
              ...item,
              quantity: Math.max(
                quantity,
                1
              ),
            }
          : item
      )
    );
  };

  // ==========================
  // Clear Cart
  // ==========================
  const clearCart = async () => {
    setCart([]);

    localStorage.removeItem("cart");

    const email = session?.user?.email;

    if (email) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            cart: [],
          }),
        });
      } catch (error) {
        console.error(
          "Failed to clear cart:",
          error
        );
      }
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

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;
};
