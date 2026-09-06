import { ProductCard } from "@/components/product-card";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) { const routeParams = await params; const [category, matches] = await Promise.all([getCategoryBySlug(routeParams.slug), getProductsByCategory(routeParams.slug)]); if (!category) return <div className="shell page-intro"><h1>Category not found.</h1></div>; return <div className="shell"><div className="page-intro"><p className="eyebrow">Category</p><h1>{category.name}.</h1><p>{category.description}</p></div><div className="product-grid" style={{ paddingBottom: 100 }}>{matches.map((product) => <ProductCard product={product} key={product.id} />)}</div></div>; }
