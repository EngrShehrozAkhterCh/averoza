"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, ClipboardList, LayoutDashboard, LogOut, Settings, ShoppingBag, Tags, Users } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

const links = [
    ["/admin/dashboard", "Dashboard", LayoutDashboard],
    ["/admin/products", "Products", ShoppingBag],
    ["/admin/orders", "Orders", ClipboardList],
    ["/admin/customers", "Customers", Users],
    ["/admin/inventory", "Inventory", Boxes],
    ["/admin/categories", "Categories", Tags],
    ["/admin/settings", "Settings", Settings],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); const router = useRouter();
    async function logout() { const supabase = getSupabaseBrowser(); await supabase?.auth.signOut(); router.replace("/admin/login"); router.refresh(); }
    return <div className="admin-app"><aside className="admin-sidebar"><Link href="/admin/dashboard" className="admin-brand"><span className="brand-mark">A</span><span>AVEROZA<br /><small>ADMIN</small></span></Link><nav>{links.map(([href, label, Icon]) => <Link className={pathname === href ? "active" : ""} href={href} key={href}><Icon size={17} />{label}</Link>)}</nav><button className="admin-logout" onClick={logout}><LogOut size={17} />Logout</button></aside><div className="admin-main"><header className="admin-header"><div><span className="eyebrow">Operations</span><h2>{links.find(([href]) => href === pathname)?.[1] ?? "Dashboard"}</h2></div><button className="admin-user" onClick={() => router.push("/account")} aria-label="Open account"><span>SA</span> Account</button></header><main className="admin-content">{children}</main></div></div>;
}
