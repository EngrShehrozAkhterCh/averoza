"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/data";

type CartItem = Product & { quantity: number };
type CartContextValue = { items: CartItem[]; count: number; add: (product: Product) => void; remove: (id: string) => void; update: (id: string, quantity: number) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => { if (typeof window === "undefined") return []; const saved = localStorage.getItem("averoza-cart"); return saved ? JSON.parse(saved) : []; });
    useEffect(() => { localStorage.setItem("averoza-cart", JSON.stringify(items)); }, [items]);
    const add = (product: Product) => setItems((current) => { const found = current.find((item) => item.id === product.id); return found ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }]; });
    const remove = (id: string) => setItems((current) => current.filter((item) => item.id !== id));
    const update = (id: string, quantity: number) => quantity < 1 ? remove(id) : setItems((current) => current.map((item) => item.id === id ? { ...item, quantity } : item));
    const clear = () => setItems([]);
    return <CartContext.Provider value={{ items, count: items.reduce((sum, item) => sum + item.quantity, 0), add, remove, update, clear }}>{children}</CartContext.Provider>;
}
export const useCart = () => { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used within CartProvider"); return context; };
