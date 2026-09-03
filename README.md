This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
# Averoza

A modern Pakistan-focused e-commerce storefront for useful tech, home, and lifestyle essentials.

## Stack

Next.js App Router, TypeScript, React, Tailwind CSS v4, Supabase PostgreSQL/Auth, Lucide React, and npm.

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Use `npm run lint`, `npm run build`, and `npm start` for production checks.

## Supabase

Run `supabase/schema.sql`, then `supabase/seed.sql` in the Supabase SQL editor. See `SUPABASE_SETUP.md` for RLS behavior and the secure first-admin procedure. Keep the service-role key server-only.

## Deployment

Import the repository into Vercel, add the environment variables from `.env.example`, and deploy. Add `averoza.me` and `averoza.tech` under Vercel Domains, then configure the Supabase Auth site URL and redirect URLs.

The database model supports SKU, supplier SKU, internal cost price, variants, inventory, images, active status, and compare-at pricing. Cost price is intentionally absent from customer-facing types. Future supplier, fulfillment, tracking, notification, and payment integrations belong in server-only service modules.
