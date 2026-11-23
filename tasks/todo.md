# Supabase migration task list

- [x] Remove JSON Server dependency, scripts, and `db.json`.
- [x] Add the reviewed Supabase schema/RLS/Storage migration.
- [x] Add Supabase client configuration and environment example.
- [x] Replace project repository methods with Supabase Data API + Storage.
- [x] Replace demo localStorage login with Supabase Auth.
- [ ] Bootstrap the first admin Auth user and `admin_users` row outside SQL passwords.
- [ ] Verify anonymous, non-admin, and admin access paths.

## Checkpoint

Before applying anything remotely: review the SQL migration, confirm the admin email, configure environment variables, and run the full RLS/auth/image verification matrix.
