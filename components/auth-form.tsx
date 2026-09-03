"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

type Mode = "login" | "register" | "forgot" | "admin";
export function AuthForm({ mode, nextPath = "/account" }: { mode: Mode; nextPath?: string }) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    async function submit(formData: FormData) {
        setLoading(true); setError(""); setMessage("");
        const supabase = getSupabaseBrowser();
        if (!supabase) { setError("Authentication is not configured yet."); setLoading(false); return; }
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");
        try {
            if (mode === "forgot") { const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` }); if (result.error) setError(result.error.message); else setMessage("Check your email for a secure reset link."); return; }
            const result = mode === "login" || mode === "admin" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { data: { full_name: String(formData.get("name") ?? "") }, emailRedirectTo: `${window.location.origin}/auth/callback?next=/account` } });
            if (result.error) { setError(result.error.message.toLowerCase().includes("confirm") ? "Please confirm your email before signing in." : result.error.message); return; }
            if (mode === "register" && !result.data.session) setMessage("Check your email to confirm your account."); else if (mode === "admin") { if (!result.data.user) { setError("We could not verify this account."); return; } const { data: profile } = await supabase.from("profiles").select("role").eq("id", result.data.user.id).single(); if (profile?.role !== "admin") { await supabase.auth.signOut(); setError("Access denied. This account does not have administrator privileges."); return; } router.push("/admin/dashboard"); } else router.push(nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/account");
        } catch (caught) {
            if (process.env.NODE_ENV !== "production") console.error("Supabase auth failed:", caught);
            setError("We could not connect to authentication. Please try again.");
        } finally { setLoading(false); }
    }
    return <form action={submit}>{mode === "register" && <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" required /></div>}<div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>{mode !== "forgot" && <div className="field"><label htmlFor="password">Password</label><div className="password-field"><input id="password" name="password" type={showPassword ? "text" : "password"} minLength={8} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></div></div>}<button className="button" type="submit" disabled={loading}>{loading ? "Please wait..." : mode === "login" || mode === "admin" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}</button>{error && <p role="alert" style={{ color: "#a33" }}>{error}</p>}{message && <p role="status">{message}</p>}</form>;
}
