"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server-auth";

async function adminClient() {
    const supabase = await getSupabaseServer();
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") redirect("/");
    return supabase;
}

export async function createProduct(formData: FormData) {
    const supabase = await adminClient(); const name = String(formData.get("name") ?? "").trim(); const price = Number(formData.get("price")); const stock = Number(formData.get("stock")); const sku = String(formData.get("sku") ?? "").trim(); const description = String(formData.get("description") ?? "").trim(); const categoryId = String(formData.get("category_id") ?? "") || null;
    if (!name || !sku || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) throw new Error("Enter a valid product name, SKU, price, and stock quantity.");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); const { error } = await supabase.from("products").insert({ name, slug, sku, description, price, stock_quantity: stock, category_id: categoryId }); if (error) throw new Error(error.message); revalidatePath("/shop"); revalidatePath("/admin/products"); redirect("/admin/products");
}

export async function updateProduct(formData: FormData) { const supabase = await adminClient(); const id = String(formData.get("id")); const { error } = await supabase.from("products").update({ name: String(formData.get("name") ?? "").trim(), sku: String(formData.get("sku") ?? "").trim(), description: String(formData.get("description") ?? "").trim(), price: Number(formData.get("price")), stock_quantity: Number(formData.get("stock")), is_active: formData.get("is_active") === "on", updated_at: new Date().toISOString() }).eq("id", id); if (error) throw new Error(error.message); revalidatePath("/shop"); revalidatePath("/admin/products"); redirect("/admin/products"); }
export async function updateOrderStatus(formData: FormData) { const supabase = await adminClient(); const id = String(formData.get("id")); const status = String(formData.get("status")); const allowed = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"]; if (!allowed.includes(status)) throw new Error("Invalid order status."); const { error } = await supabase.from("orders").update({ order_status: status, updated_at: new Date().toISOString() }).eq("id", id); if (error) throw new Error(error.message); revalidatePath("/admin/orders"); revalidatePath(`/admin/orders/${id}`); }
export async function createCategory(formData: FormData) { const supabase = await adminClient(); const name = String(formData.get("name") ?? "").trim(); const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); if (!name || !slug) throw new Error("Enter a category name."); const { error } = await supabase.from("categories").insert({ name, slug, description: String(formData.get("description") ?? "").trim() }); if (error) throw new Error(error.message); revalidatePath("/categories"); revalidatePath("/admin/categories"); }
