-- Run this once in existing projects after the original schema.sql.
create or replace function public.decrement_product_stock(product_id uuid, amount integer) returns void language plpgsql security definer set search_path = public as $$ begin update public.products set stock_quantity = stock_quantity - amount, updated_at = now() where id = product_id and is_active = true and stock_quantity >= amount; if not found then raise exception 'insufficient stock'; end if; end; $$;
revoke execute on function public.decrement_product_stock(uuid, integer) from public, anon, authenticated; grant execute on function public.decrement_product_stock(uuid, integer) to service_role;
drop policy if exists "users create own orders" on public.orders;
create policy "users create own orders" on public.orders for insert with check (user_id = auth.uid());
drop policy if exists "users create own items" on public.order_items;
create policy "users create own items" on public.order_items for insert with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));