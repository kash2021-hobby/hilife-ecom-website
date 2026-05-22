import React, { createContext, useContext, useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";

interface CartContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  cartCount: number;
  cartId: string;
  setCartId: (id: string) => void;
}

const CartContext = createContext<CartContextType>({
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  cartCount: 0,
  cartId: "",
  setCartId: () => {},
});

function loadCartId(): string {
  try {
    return localStorage.getItem("kn_cart_id") || "";
  } catch {
    return "";
  }
}

function saveCartId(id: string) {
  try {
    localStorage.setItem("kn_cart_id", id);
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartId, setCartIdState] = useState(loadCartId);

  const setCartId = useCallback((id: string) => {
    setCartIdState(id);
    saveCartId(id);
  }, []);

  const { data: cartData } = trpc.cart.get.useQuery(
    { cartId: cartId || undefined },
    { enabled: !!cartId }
  );

  const lineCount =
    cartData?.lines?.reduce((sum: number, line: any) => sum + (line.quantity || 0), 0) || 0;

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen(prev => !prev),
        cartCount: lineCount,
        cartId,
        setCartId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
