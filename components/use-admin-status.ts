"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export function useAdminStatus() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        const supabase = getSupabaseBrowser();
        if (!supabase) { Promise.resolve().then(() => setChecked(true)); return; }
        let active = true;
        supabase.auth.getUser().then(async ({ data }) => {
            if (!data.user) { if (active) setChecked(true); return; }
            const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
            if (active) { setIsAdmin(profile?.role === "admin"); setChecked(true); }
        }).catch((error) => { if (process.env.NODE_ENV !== "production") console.error("Role lookup failed:", error); if (active) setChecked(true); });
        return () => { active = false; };
    }, []);
    return { isAdmin, checked };
}
