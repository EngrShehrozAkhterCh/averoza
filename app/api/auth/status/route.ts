import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server-auth";

export async function GET() {
    const supabase = await getSupabaseServer();
    if (!supabase) return NextResponse.json({ authenticated: false }, { status: 503 });
    const { data: { user } } = await supabase.auth.getUser();
    return NextResponse.json({ authenticated: Boolean(user), email: user?.email ?? null });
}
