import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getSupabaseServer } from "@/lib/supabase/server-auth";

type ImportRow = Record<string, unknown>;
const text = (value: unknown) => typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
const number = (value: unknown) => { const parsed = Number(String(value).replace(/[^0-9.-]/g, "")); return Number.isFinite(parsed) ? parsed : 0; };

export async function POST(request: Request) {
    const supabase = await getSupabaseServer();
    if (!supabase) return NextResponse.json({ error: "Backend is not configured." }, { status: 503 });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    const form = await request.formData(); const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Upload a CSV or Excel file." }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Files must be smaller than 5 MB." }, { status: 413 });
    const extension = file.name.toLowerCase().split(".").pop();
    if (!extension || !["csv", "xlsx", "xls"].includes(extension)) return NextResponse.json({ error: "Only .csv, .xlsx, and .xls files are supported." }, { status: 415 });
    let mapping: Record<string, string>; let pricing: Record<string, unknown>;
    try { mapping = JSON.parse(text(form.get("mapping")) || "{}"); pricing = JSON.parse(text(form.get("pricing")) || "{}"); } catch { return NextResponse.json({ error: "Invalid import configuration." }, { status: 400 }); }
    let rows: ImportRow[];
    try { const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: false }); const sheet = workbook.Sheets[workbook.SheetNames[0]]; rows = XLSX.utils.sheet_to_json<ImportRow>(sheet, { defval: "" }); } catch { return NextResponse.json({ error: "The spreadsheet could not be read." }, { status: 400 }); }
    if (rows.length > 1000) return NextResponse.json({ error: "Import up to 1,000 rows at a time." }, { status: 400 });
    if (!mapping.name || !mapping.sku) return NextResponse.json({ error: "Map both Product Name and SKU before importing." }, { status: 400 });
    const { data: categoryRows } = await supabase.from("categories").select("id,name,slug"); const categoryMap = new Map((categoryRows ?? []).map((category) => [category.slug.toLowerCase(), category.id]));
    const errors: string[] = []; let imported = 0; let failed = 0; const duplicateMode = text(form.get("duplicateMode")) || "skip";
    for (let index = 0; index < rows.length; index++) { const row = rows[index]; const name = text(row[mapping.name]); const sku = text(row[mapping.sku]); if (!name || !sku) { failed++; errors.push(`Row ${index + 2}: missing name or SKU`); continue; } const cost = number(row[mapping.costPrice]); let price = pricing.useImported ? number(row[mapping.price]) : cost + number(pricing.shipping) + number(pricing.other) + (pricing.profitType === "fixed" ? number(pricing.profit) : cost * number(pricing.profit) / 100); const rounding = Number(pricing.rounding); if (rounding > 1) price = Math.round(price / rounding) * rounding; if (price <= 0) { failed++; errors.push(`${sku}: selling price is required or must calculate above zero`); continue; } const categorySlug = text(row[mapping.category]).toLowerCase().replace(/\s+/g, "-"); const payload = { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), description: text(row[mapping.description]), sku, cost_price: cost, price, stock_quantity: Math.max(0, Math.floor(number(row[mapping.stock]))), category_id: categoryMap.get(categorySlug) ?? null, source_type: text(form.get("sourceType")) || "other_supplier", supplier_name: text(form.get("supplierName")) || null, supplier_product_id: text(row[mapping.supplierId]) || null, supplier_product_url: text(row[mapping.supplierUrl]) || null, is_active: true }; const existing = await supabase.from("products").select("id").eq("sku", sku).maybeSingle(); if (existing.data && duplicateMode === "skip") continue; const result = existing.data && duplicateMode === "update" ? await supabase.from("products").update(payload).eq("id", existing.data.id) : await supabase.from("products").insert(payload); if (result.error) { failed++; errors.push(`${sku}: ${result.error.message}`); } else imported++; }
    const status = failed ? imported ? "completed_with_errors" : "failed" : "completed"; await supabase.from("product_imports").insert({ file_name: file.name, products_imported: imported, products_failed: failed, imported_by: user.id, status, errors }); return NextResponse.json({ imported, failed, errors, status });
}
