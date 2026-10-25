-- PAWSYNC Supabase SQL schema
-- Run this in Supabase SQL editor after creating the project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  species text not null,
  breed text,
  age text,
  weight text,
  sex text,
  location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pets enable row level security;

create policy "Users can view their own pets"
  on public.pets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own pets"
  on public.pets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pets"
  on public.pets for update
  using (auth.uid() = user_id);

create policy "Users can delete their own pets"
  on public.pets for delete
  using (auth.uid() = user_id);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  pet_id uuid references public.pets (id) on delete set null,
  title text not null,
  date date not null,
  time text,
  status text default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.appointments enable row level security;

create policy "Users can view their own appointments"
  on public.appointments for select
  using (auth.uid() = user_id);

create policy "Users can insert their own appointments"
  on public.appointments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own appointments"
  on public.appointments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own appointments"
  on public.appointments for delete
  using (auth.uid() = user_id);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  pet_id uuid references public.pets (id) on delete set null,
  category text not null,
  amount numeric(12,2) not null default 0,
  description text,
  date date not null,
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

create table if not exists public.shop_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  shop_name text not null,
  product_name text not null,
  price numeric(12,2),
  created_at timestamptz not null default now()
);

alter table public.shop_favorites enable row level security;

create policy "Users can view their own shop data"
  on public.shop_favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own shop data"
  on public.shop_favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own shop data"
  on public.shop_favorites for update
  using (auth.uid() = user_id);

create policy "Users can delete their own shop data"
  on public.shop_favorites for delete
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Pet Parent')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger update_pets_updated_at
  before update on public.pets
  for each row execute procedure public.update_updated_at();
