-- Schema Supabase / PostgreSQL per OSINTHUB-ITA
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  display_name text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Utenti vedono il proprio profilo" on public.profiles for select using (auth.uid() = id);