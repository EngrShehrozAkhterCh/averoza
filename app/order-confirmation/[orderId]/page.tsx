import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server-auth";

export default async function OrderConfirmation({ params }: { params: Promise<{ orderId: string }> }) {
    const supabase = await getSupabaseServer();
    const orderId = (await params).orderId;
    if (!supabase) return <div className="shell form-page"><div className="form-panel"><h1>Order placed.</h1><p>Order confirmation is temporarily unavailable.</p></div></div>;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) notFound();
    const { data: order, error } = await supabase.from("orders").select("order_number,payment_method,order_status,total").eq("id", orderId).eq("user_id", user.id).single();
    if (error || !order) { if (process.env.NODE_ENV !== "production") console.error("Order confirmation lookup failed:", error); notFound(); }
    return <div className="shell form-page"><div className="form-panel" style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}><p className="eyebrow">Order placed successfully</p><h1>Thank you.</h1><p>Order Number: <strong>{order.order_number}</strong></p><p>Thank you for shopping with Averoza.</p><p>Payment Method: {order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method}</p><p>Order Status: {order.order_status}</p><Link className="button" href="/shop">Continue shopping</Link></div></div>;
}