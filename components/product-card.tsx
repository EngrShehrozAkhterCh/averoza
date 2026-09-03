"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/data";
import { formatPKR } from "@/lib/data";
import { useCart } from "./cart-provider";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  return <article className="product-card">
    <div className="product-image-wrap"><Link href={`/product/${product.slug}`}><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 50vw, 25vw" className="product-image" /></Link>{product.badge && <span className="product-badge">{product.badge}</span>}<button className="wishlist-btn" aria-label={`Save ${product.name}`}><Heart size={17} /></button><button className="quick-add" onClick={() => add(product)} aria-label={`Add ${product.name} to cart`}><Plus size={18} /></button></div>
    <div className="product-info"><div className="product-meta"><span>{product.category.replace("-", " ")}</span><span className="rating"><Star size={13} fill="currentColor" /> {product.rating}</span></div><Link href={`/product/${product.slug}`} className="product-name">{product.name}</Link><div className="price-row"><strong>{formatPKR(product.price)}</strong>{product.compareAtPrice && <><del>{formatPKR(product.compareAtPrice)}</del><em>{discount}% off</em></>}</div></div>
  </article>;
}
