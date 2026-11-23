# Full-stack Supabase plan

## Outcome

Replace the local JSON Server project catalog and demo `admin / admin` login with a Supabase-backed full-stack flow: Supabase Auth for admin sign-in/password management, Postgres for projects/order/publish state, and Supabase Storage for project images.

## Security decisions

- Do not create a custom password column or encrypt passwords in application code.
- Supabase Auth stores password hashes and verifies passwords; the frontend only sends credentials over HTTPS.
- Store admin authorization separately from Auth credentials in `public.admin_users`, keyed by `auth.users.id`.
- Protect all project writes with RLS policies that require an authenticated user present in `admin_users`.
- Keep the public project read policy limited to `published = true`.
- Use a publishable Supabase key in the browser; never expose a service-role/secret key.
- Store images in a private-by-default `project-images` bucket with admin upload/update/delete policies and public read access only if the product chooses public URLs.

## Dependency graph

```text
Supabase migration (tables, RLS, storage policies)
  → Supabase client + typed project repository
    → Auth/session guard for /admin
      → admin CRUD, ordering, and image upload
        → public landing/projects queries
```

## Implementation slices

1. Remove JSON Server mock and scripts; preserve the current UI fallback while the Supabase environment is not configured.
2. Add and review the SQL migration for `projects`, `admin_users`, RLS, indexes, and Storage policies.
3. Install/pin `@supabase/supabase-js`, add a browser client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, and add an environment example.
4. Replace the project repository methods with Supabase queries and Storage upload/remove behavior.
5. Replace localStorage demo auth with `signInWithPassword`, session restore, sign-out, and an admin authorization check.
6. Add an admin-user bootstrap step through the Supabase Dashboard or a server-only admin script; never seed a password in SQL or frontend code.
7. Verify with local Supabase or a connected project: migration, RLS read/write cases, Auth login/logout, image upload, reorder, and public published-only rendering.

## Acceptance checks

- No JSON Server package, script, `db.json`, or `localhost:3001` dependency remains.
- Anonymous users can read published projects only.
- Authenticated non-admin users cannot create, edit, delete, reorder, or upload.
- Admin users can create/edit/delete/reorder/publish projects and upload images.
- Passwords never appear in project tables, migrations, logs, or browser storage.
- Admin sessions survive reload and sign out cleanly.
- The landing page and `/projets` show the same persisted ordering and published state.

## Risks / open decisions

- Supabase project URL and publishable key are not present in this repository yet.
- The admin email/account must be created in Supabase Auth; choose the real admin email before bootstrap.
- Decide whether project image URLs should be public or signed/private URLs before production launch.
- The current demo data will need a one-time import into Supabase; this plan does not apply remote data changes.

## Verification and rollback

- Keep the migration additive and review it before applying remotely.
- Run `supabase db lint` / RLS checks where the CLI is available, then test with an anonymous client, authenticated non-admin client, and admin client.
- Until Supabase env/config is supplied, public fallback data remains available and admin CRUD should show a clear configuration error rather than silently write elsewhere.
