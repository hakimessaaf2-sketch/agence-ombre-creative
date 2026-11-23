create table if not exists public.project_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 120),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.project_categories enable row level security;

create policy "anyone can read project categories"
  on public.project_categories
  for select
  to anon, authenticated
  using (true);

create policy "admins can create project categories"
  on public.project_categories
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

create policy "admins can update project categories"
  on public.project_categories
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

grant select on public.project_categories to anon, authenticated;
grant insert, update on public.project_categories to authenticated;
