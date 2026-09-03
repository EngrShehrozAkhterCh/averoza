import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server-auth";
import { AdminShell } from "@/components/admin-shell";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await getSupabaseServer();
    if (!supabase) redirect("/admin/login");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") redirect("/");
    return <AdminShell>{children}</AdminShell>;
}
