import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base = "https://averoza.me"; return ["", "/shop", "/categories", "/search", "/about", "/contact", "/shipping", "/returns", "/privacy", "/terms"].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })); }
