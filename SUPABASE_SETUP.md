# Supabase setup

1. Create a Supabase project and copy the project URL and anon key into `.env.local` using `.env.example`.
2. For a new project, run the complete `supabase/schema.sql`, then run `supabase/seed.sql`. For the existing project, run `supabase/migration_backend.sql`; it does not drop tables or data.
3. Enable Email auth in Authentication settings.
4. In Authentication -> URL Configuration, set Site URL to `https://averoza.vercel.app` and add `https://averoza.vercel.app/auth/callback` to Redirect URLs.
5. Register the first account through `/register`, then promote it from the Supabase SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'your-admin-email@example.com';
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code or browser variables. Set it only in Vercel Production/Preview environment variables. The schema enables RLS on every table. Public visitors can read active catalog records and approved reviews; signed-in customers can read only their own profile/orders/wishlist; admin operations depend on the `is_admin()` security-definer function. `proxy.ts` refreshes Supabase auth cookies on requests so browser sessions remain available to server routes.

The checkout now requires a signed-in user and posts to `/api/orders`; the route validates delivery data, re-reads active prices and stock from Supabase, creates COD orders tied to the authenticated user, and decrements stock through the server-only RPC. Login, registration, and password reset use the browser Supabase client with the public anon key. Supplier imports, tracking, messaging, and payment providers should be added as separate server-only services.
