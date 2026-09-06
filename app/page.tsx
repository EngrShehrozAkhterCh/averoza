import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { getCategories, getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return <>
    <section className="hero"><div className="shell hero-grid"><div><p className="eyebrow">A considered online store</p><h1>Make room for better things.</h1><p className="hero-copy">Useful, beautiful essentials for your everyday rhythm. Curated with a little more intention and delivered across Pakistan.</p><div className="button-row"><Link className="button" href="/shop">Shop the edit <ArrowUpRight size={17} /></Link><Link className="button secondary" href="/categories">Browse categories</Link></div></div><div className="hero-art"><Image src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1200&q=85" alt="A calm workspace with considered everyday objects" fill priority sizes="(max-width: 800px) 78vw, 42vw" /></div></div></section>
    <section className="section"><div className="shell"><div className="section-head"><div><p className="eyebrow">The current edit</p><h2>Good things, well chosen.</h2></div><Link className="section-link" href="/shop">View all products <ArrowUpRight size={14} /></Link></div>{products.length ? <div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard product={product} key={product.id} />)}</div> : <p>New products are on the way.</p>}</div></section>
    <section className="section" style={{ paddingTop: 0 }}><div className="shell"><div className="section-head"><div><p className="eyebrow">Find your next</p><h2>Shop by feeling.</h2></div></div><div className="category-grid">{categories.map((category) => <Link className="category-card" href={`/shop?category=${category.slug}`} key={category.slug}><Image src={category.image} alt={category.name} fill sizes="(max-width: 800px) 50vw, 33vw" /><div><h3>{category.name}</h3><p>{category.description}</p></div></Link>)}</div></div></section>
    <section className="section promise"><div className="shell promise-grid"><div className="promise-item"><ShieldCheck size={25} /><h3>Considered quality</h3><p>Every product earns its place through usefulness, finish, and staying power.</p></div><div className="promise-item"><Truck size={25} /><h3>Delivered simply</h3><p>Reliable cash on delivery and clear shipping updates, wherever you are in Pakistan.</p></div><div className="promise-item"><Sparkles size={25} /><h3>A calmer cart</h3><p>Less noise, better choices. A small edit of things that make daily life feel lighter.</p></div></div></section>
    <section className="section newsletter"><div className="shell newsletter-inner"><h2>Good finds, occasionally.</h2><form><input type="email" placeholder="Your email address" aria-label="Your email address" /><button type="submit" aria-label="Subscribe">Join <ArrowUpRight size={15} /></button></form></div></section>
  </>;
}
