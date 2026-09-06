import { createClient } from "@supabase/supabase-js";
import type { Category, Product } from "./data";

const PLACEHOLDER_IMAGE = "/placeholder.svg?height=600&width=600";

const PRODUCT_SELECT =
    "id, name, slug, description, price, compare_at_price, stock_quantity, is_featured, category:categories(slug), product_images(image_url, sort_order), reviews(rating)";

// Public catalog reads. RLS exposes only active categories/products (and their
// images/variants/approved reviews) to the anon key, so this client is safe for
// server components rendering the storefront.
function getReadClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

type CategoryRow = {
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
};

type ProductRow = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number | string;
    compare_at_price: number | string | null;
    stock_quantity: number | null;
    is_featured: boolean | null;
    category: { slug: string } | null;
    product_images: { image_url: string; sort_order: number }[] | null;
    reviews: { rating: number }[] | null;
};

function mapCategory(row: CategoryRow): Category {
    return {
        name: row.name,
        slug: row.slug,
        description: row.description ?? "",
        image: row.image_url ?? PLACEHOLDER_IMAGE,
    };
}

function mapProduct(row: ProductRow): Product {
    const images = [...(row.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    const reviews = row.reviews ?? [];
    const reviewCount = reviews.length;
    const rating = reviewCount
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10
        : 0;
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        category: row.category?.slug ?? "",
        price: Number(row.price),
        compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
        rating,
        reviews: reviewCount,
        image: images[0]?.image_url ?? PLACEHOLDER_IMAGE,
        description: row.description ?? "",
        stock: row.stock_quantity ?? 0,
        badge: row.is_featured ? "Featured" : undefined,
    };
}

export async function getCategories(): Promise<Category[]> {
    const supabase = getReadClient();
    if (!supabase) return [];
    const { data, error } = await supabase
        .from("categories")
        .select("name, slug, description, image_url")
        .eq("is_active", true)
        .order("name", { ascending: true });
    if (error || !data) return [];
    return (data as CategoryRow[]).map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const supabase = getReadClient();
    if (!supabase) return null;
    const { data, error } = await supabase
        .from("categories")
        .select("name, slug, description, image_url")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
    if (error || !data) return null;
    return mapCategory(data as CategoryRow);
}

export async function getProducts(): Promise<Product[]> {
    const supabase = getReadClient();
    if (!supabase) return [];
    const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const supabase = getReadClient();
    if (!supabase) return null;
    const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
    if (error || !data) return null;
    return mapProduct(data as unknown as ProductRow);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
    const supabase = getReadClient();
    if (!supabase) return [];
    const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
    if (!category) return [];
    const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("is_active", true)
        .eq("category_id", (category as { id: string }).id)
        .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
    const supabase = getReadClient();
    if (!supabase) return [];
    const term = query.trim();
    if (!term) return [];
    const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("is_active", true)
        .ilike("name", `%${term}%`)
        .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as unknown as ProductRow[]).map(mapProduct);
}
