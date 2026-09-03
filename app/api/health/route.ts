import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ ok: false, configured: false, database: false }, { status: 503 });
    const { error } = await supabase.from("products").select("id", { count: "exact", head: true });
    if (error) {
        if (process.env.NODE_ENV !== "production") console.error("Health check failed:", error);
        return NextResponse.json({ ok: false, configured: true, database: false, error: error.code ?? "SUPABASE_QUERY_FAILED", message: error.message }, { status: 503 });
    }
    return NextResponse.json({ ok: true, configured: true, database: true });
}
