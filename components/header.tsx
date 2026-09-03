"use client";

import Link from "next/link";
import { Search, ShoppingBag, UserRound, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "./cart-provider";

export function Header() {
    const [open, setOpen] = useState(false);
    const { count } = useCart();
    return <header className="site-header">
        <div className="shell header-inner">
            <Link href="/" className="brand" onClick={() => setOpen(false)}><span className="brand-mark">A</span> AVEROZA</Link>
            <nav className={open ? "main-nav mobile-open" : "main-nav"}>
                <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link><Link href="/categories" onClick={() => setOpen(false)}>Categories</Link><Link href="/about" onClick={() => setOpen(false)}>Our story</Link>
            </nav>
            <div className="header-actions">
                <Link href="/search" aria-label="Search" className="icon-btn"><Search size={19} /></Link>
                <Link href="/account" aria-label="Account" className="icon-btn desktop-only"><UserRound size={19} /></Link>
                <Link href="/cart" aria-label="Cart" className="icon-btn cart-btn"><ShoppingBag size={19} />{count > 0 && <span>{count}</span>}</Link>
                <button className="icon-btn mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={21} /> : <Menu size={21} />}</button>
            </div>
        </div>
    </header>;
}
