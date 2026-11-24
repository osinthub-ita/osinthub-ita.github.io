-- Schema preliminare, NON collegato al frontend. Eseguire in progetto di prova.
create table public.notes (id uuid primary key default gen_random_uuid(), owner uuid not null references auth.users(id) on delete cascade, body text not null default '', created_at timestamptz not null default now());
alter table public.notes enable row level security;
create policy own_notes on public.notes for all to authenticated using (owner=auth.uid()) with check (owner=auth.uid());
create table public.favorites (owner uuid not null references auth.users(id) on delete cascade, resource_id bigint not null, primary key(owner,resource_id));
alter table public.favorites enable row level security;
create policy own_favorites on public.favorites for all to authenticated using (owner=auth.uid()) with check (owner=auth.uid());
-- Catalogo, moderazione, ruoli admin, rate limiting e logging richiedono ulteriore configurazione e verifica.
