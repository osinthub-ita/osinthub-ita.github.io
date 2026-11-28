-- Schema Supabase / PostgreSQL per sincronizzare utenti tra PC e Smartphone
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  display_name text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Lettura profili" on public.profiles for select using (true);
create policy "Inserimento profilo" on public.profiles for insert with check (true);