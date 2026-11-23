# Session handoff

Status: active

## Goal

Replace the JSON Server mock with a Supabase-ready project/auth architecture: migration with RLS and Storage policies, Supabase client boundary, and Auth-safe admin password handling.

## Acceptance checks

- `/admin` presents an accessible Supabase Auth email/password login.
- Authenticated admin can create, edit, publish/unpublish, and delete projects.
- Project data persists through Supabase Postgres and Storage when configured.
- Public `/` and `/projets` consume published projects from the API with a safe fallback.
- Targeted typecheck/lint, tests, build, API smoke test, and Chromium render checks pass.

## Decisions

- Supabase Auth owns password hashing and verification; no custom password encryption or password column.
- `public.admin_users` stores only Auth user UUIDs for authorization; RLS protects project and Storage writes.
- Supabase Storage bucket `project-images` stores uploaded project images.
- Keep the existing dark Morocco Media system and use a denser operational admin layout.

## Current files and working tree

- Removed `db.json`, JSON Server scripts, and JSON Server/concurrently dependencies.
- Added the Supabase migration, `src/lib/supabase.ts`, `.env.example`, and full-stack plan files.
- Updated project rendering in `src/routes/index.tsx` and `src/routes/projets.tsx`.
- Updated shared fallback project data in `src/components/site.tsx`.
- Added `@supabase/supabase-js`.
- Pre-existing `package-lock.json` change was present before this task; preserve it.

## Verification

- `npm test`: passed (1 test).
- `npm run build`: passed.
- Targeted `npx tsc --noEmit`: passed.
- Targeted ESLint: passed with 2 existing Fast Refresh warnings in `src/components/site.tsx`.
- Supabase migration is local-only; no remote project was changed.
- Isolated headless Chrome 152 render checks for `/admin` and `/projets`: passed; screenshots in `output/playwright/`.

## Risks and approvals

- Supabase environment variables and a real admin Auth user are still required.
- The first admin must be created in Supabase Auth, then their UUID inserted into `admin_users`; never seed a password in SQL.

## Latest verification

- Blob/data URL CRUD smoke test: passed.
- Chromium render check after upload UI change: passed.
- Add/edit form moved into the existing accessible Dialog primitive.
- Final modal implementation: tests, strict typecheck, build, and diff check passed.
- Project ordering is represented by `sort_order` in the Supabase migration.
- Final Supabase-ready checks: tests, typecheck, build, diff check, and no JSON Server/localhost:3001 references in application code passed.
- Fixed project creation overflow: `sort_order` now uses a safe sequential integer instead of `Date.now()`; read-only remote check returned `project_count: 0`, `max_sort_order: 0`.
- After the ordering fix: `npm test`, `npx tsc --noEmit`, `npm run build`, and `git diff --check` passed.
- Added `project_categories` migration, admin category creation modal, and a category dropdown in the project form. Supabase dry-run reports `20261123192100_project_categories.sql` pending; Chromium admin login surface and Impeccable detector passed.
- Applied `20261123192100_project_categories.sql` to linked production project `pgsmntkiczvwwyfjngzc`; read-only verification confirms `public.project_categories` exists.

## Next action

Apply the migration to a reviewed Supabase project, create the first Auth user, and insert only that user UUID into `admin_users`.
