"use client";

import { Heart } from "lucide-react";
import type { Product } from "@/lib/data";
import { AddToCart } from "./add-to-cart";
import { useAdminStatus } from "./use-admin-status";
import Link from "next/link";

export function ProductActions({ product }: { product: Product }) {
    const { isAdmin, checked } = useAdminStatus();
    if (checked && isAdmin) return <Link className="button" href="/admin/dashboard">Open dashboard</Link>;
    return <><AddToCart product={product} /><button className="button secondary" aria-label="Add to wishlist"><Heart size={17} /> Save</button></>;
}
