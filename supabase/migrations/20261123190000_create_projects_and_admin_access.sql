-- Morocco Media: project catalog, admin authorization, and public image storage.
-- Passwords are managed by Supabase Auth and are intentionally not stored here.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "admins can read their own admin record"
  on public.admin_users
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  category text not null check (char_length(category) between 1 and 120),
  description text not null check (char_length(description) between 1 and 2000),
  image_path text not null,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_order_idx
  on public.projects (published, sort_order, created_at);

alter table public.projects enable row level security;

create policy "anyone can read published projects"
  on public.projects
  for select
  to anon, authenticated
  using (published = true);

create policy "admins can read all projects"
  on public.projects
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

create policy "admins can create projects"
  on public.projects
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

create policy "admins can update projects"
  on public.projects
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

create policy "admins can delete projects"
  on public.projects
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant select on public.admin_users to authenticated;

-- Public reads keep the existing landing-page image behavior. Writes remain admin-only.
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = excluded.public;

create policy "anyone can read project images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'project-images');

create policy "admins can upload project images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'project-images'
    and exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

create policy "admins can replace project images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'project-images'
    and exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'project-images'
    and exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

create policy "admins can delete project images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'project-images'
    and exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );
