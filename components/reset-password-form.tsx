"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export function ResetPasswordForm() {
    const router = useRouter(); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
    async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); setMessage(""); const password = new FormData(event.currentTarget).get("password"); const supabase = getSupabaseBrowser(); if (!supabase) { setError("Authentication is not configured yet."); setLoading(false); return; } try { const { error: updateError } = await supabase.auth.updateUser({ password: String(password) }); if (updateError) setError(updateError.message); else { setMessage("Your password has been updated."); setTimeout(() => router.push("/account"), 800); } } catch (caught) { if (process.env.NODE_ENV !== "production") console.error("Password update failed:", caught); setError("We could not update your password. Please request a new reset link."); } finally { setLoading(false); } }
    return <form onSubmit={submit}><div className="field"><label htmlFor="password">New password</label><input id="password" name="password" type="password" minLength={8} required /></div><button className="button" type="submit" disabled={loading}>{loading ? "Updating..." : "Update password"}</button>{error && <p role="alert" style={{ color: "#a33" }}>{error}</p>}{message && <p role="status">{message}</p>}</form>;
}
