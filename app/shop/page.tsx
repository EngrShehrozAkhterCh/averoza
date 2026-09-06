import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Shop({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
    const params = await searchParams;
    const [allProducts, categories] = await Promise.all([getProducts(), getCategories()]);
    const filtered = allProducts.filter((product) => (!params.category || product.category === params.category) && (!params.q || product.name.toLowerCase().includes(params.q.toLowerCase())));
    return <div className="shell"><div className="page-intro"><p className="eyebrow">The Averoza shop</p><h1>Things with a purpose.</h1><p>A small, useful edit of tech, home, and lifestyle pieces chosen to earn their place in your day.</p></div><div className="shop-layout"><aside className="filters"><h3>Browse</h3><Link className="filter-link" href="/shop">All products</Link>{categories.map((category) => <Link className="filter-link" href={`/shop?category=${category.slug}`} key={category.slug}>{category.name}</Link>)}</aside><section><div className="toolbar"><span className="eyebrow">{filtered.length} products</span><select className="select" aria-label="Sort products"><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select></div>{filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <p>No products found for this search.</p>}</section></div></div>;
}
