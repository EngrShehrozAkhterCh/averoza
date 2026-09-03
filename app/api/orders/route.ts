import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type OrderInput = {
    customerName?: unknown;
    customerEmail?: unknown;
    customerPhone?: unknown;
    shippingAddress?: unknown;
    city?: unknown;
    province?: unknown;
    postalCode?: unknown;
    notes?: unknown;
    items?: unknown;
};

type CartInput = { slug: unknown; quantity: unknown };
const text = (value: unknown, max = 300) => typeof value === "string" && value.trim().length > 0 && value.length <= max ? value.trim() : null;

export async function POST(request: Request) {
    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: "Store backend is not configured." }, { status: 503 });

    let body: OrderInput;
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
    const customerName = text(body.customerName, 120);
    const customerEmail = text(body.customerEmail, 160);
    const customerPhone = text(body.customerPhone, 40);
    const shippingAddress = text(body.shippingAddress, 500);
    const city = text(body.city, 100);
    const province = text(body.province, 100);
    const postalCode = text(body.postalCode, 20) ?? "";
    const notes = text(body.notes, 500) ?? "";
    const items = Array.isArray(body.items) ? body.items as CartInput[] : [];
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !city || !province || !/^\S+@\S+\.\S+$/.test(customerEmail) || items.length === 0 || items.length > 50) return NextResponse.json({ error: "Please provide valid delivery details and cart items." }, { status: 400 });

    const requested = new Map<string, number>();
    for (const item of items) { const slug = text(item.slug, 120); const quantity = typeof item.quantity === "number" && Number.isInteger(item.quantity) ? item.quantity : 0; if (!slug || quantity < 1 || quantity > 20) return NextResponse.json({ error: "Invalid cart item." }, { status: 400 }); requested.set(slug, (requested.get(slug) ?? 0) + quantity); }
    const slugs = [...requested.keys()];
    const { data: products, error: productError } = await supabase.from("products").select("id,name,slug,price,stock_quantity,is_active").in("slug", slugs).eq("is_active", true);
    if (productError || !products || products.length !== slugs.length) return NextResponse.json({ error: "One or more products are unavailable." }, { status: 409 });

    const orderItems = products.map((product) => { const quantity = requested.get(product.slug) ?? 0; return { product_id: product.id, product_name: product.name, quantity, unit_price: Number(product.price), total_price: Number(product.price) * quantity }; });
    const subtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0);
    const shippingFee = 200;
    const orderNumber = `AV-${Date.now().toString(36).toUpperCase()}`;
    const { data: order, error: orderError } = await supabase.from("orders").insert({ order_number: orderNumber, customer_name: customerName, customer_email: customerEmail, customer_phone: customerPhone, shipping_address: shippingAddress, city, province, postal_code: postalCode, notes, subtotal, shipping_fee: shippingFee, total: subtotal + shippingFee, payment_method: "cod" }).select("id,order_number,total").single();
    if (orderError || !order) return NextResponse.json({ error: "We could not create your order." }, { status: 500 });
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems.map((item) => ({ ...item, order_id: order.id })));
    if (itemsError) { await supabase.from("orders").delete().eq("id", order.id); return NextResponse.json({ error: "We could not save your order items." }, { status: 500 }); }
    for (const item of products) { const quantity = requested.get(item.slug) ?? 0; const { error } = await supabase.rpc("decrement_product_stock", { product_id: item.id, amount: quantity }); if (error) return NextResponse.json({ error: "Order received, but inventory confirmation is pending." }, { status: 202 }); }
    return NextResponse.json({ orderNumber: order.order_number, total: order.total }, { status: 201 });
}
