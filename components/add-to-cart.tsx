"use client";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "./cart-provider";
export function AddToCart({ product }: { product: Product }) { const { add } = useCart(); return <button className="button" onClick={() => add(product)}><ShoppingBag size={17} /> Add to cart</button>; }
