import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Categories() { const categories = await getCategories(); return <div className="shell"><div className="page-intro"><p className="eyebrow">Browse the edit</p><h1>Start somewhere good.</h1><p>Explore the collection by the way you live, work, and move through the world.</p></div><div className="category-grid" style={{ paddingBottom: 100 }}>{categories.map((category) => <Link className="category-card" href={`/shop?category=${category.slug}`} key={category.slug}><Image src={category.image} alt={category.name} fill sizes="(max-width: 800px) 50vw, 33vw" /><div><h3>{category.name}</h3><p>{category.description}</p></div></Link>)}</div></div>; }
