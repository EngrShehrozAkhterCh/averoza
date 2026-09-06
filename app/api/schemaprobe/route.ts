import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const tables = ["categories", "products", "product_images", "product_variants"]
  const out: Record<string, unknown> = {}

  for (const t of tables) {
    const { data, error, count } = await supabase
      .from(t)
      .select("*", { count: "exact" })
      .limit(1)
    out[t] = {
      error: error?.message ?? null,
      count: count ?? null,
      columns: data && data[0] ? Object.keys(data[0]) : [],
      sample: data && data[0] ? data[0] : null,
    }
  }

  return NextResponse.json(out)
}
