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

export const formatPKR = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;
