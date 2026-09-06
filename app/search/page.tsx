import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) { const query = (await searchParams).q ?? ""; const matches = await searchProducts(query); return <div className="shell"><div className="page-intro"><p className="eyebrow">Search Averoza</p><h1>Find your next thing.</h1><form className="newsletter" style={{ padding: 15, maxWidth: 560 }}><input className="search-input" name="q" defaultValue={query} placeholder="Try earbuds, lamp, wallet..." /><button type="submit">Search</button></form></div>{query && <p className="eyebrow" style={{ marginBottom: 25 }}>{matches.length} results for “{query}”</p>}{matches.length ? <div className="product-grid" style={{ paddingBottom: 100 }}>{matches.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <p style={{ paddingBottom: 100 }}>{query ? "No results yet. Try a broader search." : "Start typing to search the collection."}</p>}</div>; }
