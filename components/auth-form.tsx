"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

type Mode = "login" | "register" | "forgot";
export function AuthForm({ mode }: { mode: Mode }) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    async function submit(formData: FormData) {
        setLoading(true); setError(""); setMessage("");
        const supabase = getSupabaseBrowser();
        if (!supabase) { setError("Authentication is not configured yet."); setLoading(false); return; }
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");
        if (mode === "forgot") { const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/account` }); setLoading(false); if (result.error) setError(result.error.message); else setMessage("Check your email for a secure reset link."); return; }
        const result = mode === "login" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { data: { full_name: String(formData.get("name") ?? "") } } });
        setLoading(false);
        if (result.error) { setError(result.error.message); return; }
        if (mode === "register" && !result.data.session) setMessage("Check your email to confirm your account."); else router.push("/account");
    }
    return <form action={submit}>{mode === "register" && <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" required /></div>}<div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>{mode !== "forgot" && <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" minLength={8} required /></div>}<button className="button" type="submit" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}</button>{error && <p role="alert" style={{ color: "#a33" }}>{error}</p>}{message && <p role="status">{message}</p>}</form>;
}
