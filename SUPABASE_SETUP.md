# Supabase setup

1. Create a Supabase project and copy the project URL and anon key into `.env.local` using `.env.example`.
2. Open SQL Editor and run the complete `supabase/schema.sql`, then run `supabase/seed.sql`. If the schema was already installed, run the new `decrement_product_stock` function statement from the schema again.
3. Enable Email auth in Authentication settings.
4. Register the first account through `/register`, then promote it from the Supabase SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'your-admin-email@example.com';
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code or browser variables. The schema enables RLS on every table. Public visitors can read active catalog records and approved reviews; signed-in customers can read only their own profile/orders/wishlist; admin operations depend on the `is_admin()` security-definer function.

The checkout now posts to `/api/orders`; the route validates delivery data, re-reads active prices and stock from Supabase, creates COD orders, and decrements stock through the server-only RPC. Login, registration, and password reset use the browser Supabase client with the public anon key. Supplier imports, tracking, messaging, and payment providers should be added as separate server-only services.
