"use client";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "./cart-provider";
import Link from "next/link";
import { useAdminStatus } from "./use-admin-status";
export function AddToCart({ product }: { product: Product }) { const { add } = useCart(); const { isAdmin, checked } = useAdminStatus(); if (checked && isAdmin) return <Link className="button" href="/admin/dashboard">Open dashboard</Link>; return <button className="button" onClick={() => add(product)}><ShoppingBag size={17} /> Add to cart</button>; }
