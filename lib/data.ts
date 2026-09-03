export type Category = {
    name: string;
    slug: string;
    description: string;
    image: string;
};

export type Product = {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    compareAtPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    stock: number;
    badge?: string;
};

export const categories: Category[] = [
    { name: "Tech essentials", slug: "electronics", description: "Thoughtful upgrades for your everyday setup.", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=900&q=85" },
    { name: "Daily carry", slug: "accessories", description: "Quietly useful pieces that go everywhere.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=85" },
    { name: "Home rituals", slug: "home-living", description: "Small details that make space feel yours.", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85" },
    { name: "Move well", slug: "lifestyle", description: "Better tools for a more considered routine.", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85" },
];

export const products: Product[] = [
    { id: "p1", name: "Aero Buds Pro", slug: "aero-buds-pro", category: "electronics", price: 4499, compareAtPrice: 5999, rating: 4.8, reviews: 124, image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&q=85", description: "Immersive sound, adaptive comfort, and a pocket-sized charging case made for full days.", stock: 24, badge: "Bestseller" },
    { id: "p2", name: "Form Watch S2", slug: "form-watch-s2", category: "electronics", price: 8999, compareAtPrice: 10999, rating: 4.7, reviews: 86, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&q=85", description: "A focused smart watch with clear health insights and a calm, minimal face.", stock: 12, badge: "New" },
    { id: "p3", name: "Arc Desk Light", slug: "arc-desk-light", category: "home-living", price: 3299, rating: 4.6, reviews: 58, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=85", description: "Warm, adjustable light for late ideas, quiet mornings, and everything between.", stock: 18 },
    { id: "p4", name: "Fold Laptop Stand", slug: "fold-laptop-stand", category: "electronics", price: 2899, compareAtPrice: 3499, rating: 4.9, reviews: 203, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&q=85", description: "Bring your screen up and your shoulders down with this portable aluminum stand.", stock: 31 },
    { id: "p5", name: "Cloud Travel Pouch", slug: "cloud-travel-pouch", category: "accessories", price: 1999, rating: 4.5, reviews: 42, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=85", description: "A softly structured organizer for cables, cards, and the little things.", stock: 41 },
    { id: "p6", name: "Pulse Speaker Mini", slug: "pulse-speaker-mini", category: "electronics", price: 5499, compareAtPrice: 6499, rating: 4.7, reviews: 77, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&q=85", description: "Room-filling sound in a compact silhouette with an all-day battery.", stock: 16, badge: "Popular" },
    { id: "p7", name: "Halo Wireless Charger", slug: "halo-wireless-charger", category: "electronics", price: 2299, rating: 4.4, reviews: 39, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=900&q=85", description: "A precise charging dock with a soft-touch finish for your bedside or desk.", stock: 27 },
    { id: "p8", name: "Essential Card Wallet", slug: "essential-card-wallet", category: "accessories", price: 1699, rating: 4.6, reviews: 91, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&q=85", description: "Slim, durable, and just the right size for the cards you actually use.", stock: 33 },
    { id: "p9", name: "Glow Night Light", slug: "glow-night-light", category: "home-living", price: 1499, rating: 4.5, reviews: 67, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=85", description: "A gentle pool of light with a warm glow for winding down.", stock: 46 },
    { id: "p10", name: "Move Resistance Set", slug: "move-resistance-set", category: "lifestyle", price: 2499, rating: 4.8, reviews: 74, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=900&q=85", description: "A versatile set for strength, mobility, and training wherever you are.", stock: 22 },
    { id: "p11", name: "Stand Phone Dock", slug: "stand-phone-dock", category: "accessories", price: 1299, compareAtPrice: 1599, rating: 4.3, reviews: 31, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=900&q=85", description: "A stable home for your phone during calls, recipes, and charging.", stock: 52 },
    { id: "p12", name: "Pour Over Set", slug: "pour-over-set", category: "home-living", price: 2999, rating: 4.7, reviews: 48, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=85", description: "A considered coffee ritual, designed for slow mornings and good conversations.", stock: 14 },
];

export const formatPKR = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;
export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
