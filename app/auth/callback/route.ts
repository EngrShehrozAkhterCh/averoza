import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server-auth";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next");
    const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
    const supabase = await getSupabaseServer();
    if (!supabase || !code) return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("The confirmation link is invalid or expired.")}`, url));
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) { if (process.env.NODE_ENV !== "production") console.error("Auth callback failed:", error); return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("The confirmation link is invalid or expired.")}`, url)); }
    return NextResponse.redirect(new URL(destination, url));
}
