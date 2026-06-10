-- ============================================================
-- Markly — Supabase Database Schema
-- Migration: 00001_initial_schema
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Extensions
-- ────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- 2. Tables
-- ────────────────────────────────────────────────────────────

-- Profiles ───────────────────────────────────────────────────

create table public.profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  email      text        not null,
  handle     text        not null,
  created_at timestamptz not null default now(),

  -- Handle must be unique (case-insensitive enforced via index)
  constraint profiles_handle_unique unique (handle),

  -- Handle format: 3-30 chars, lowercase alphanumeric + hyphens + underscores
  -- Must start and end with alphanumeric, no consecutive hyphens/underscores
  constraint profiles_handle_format check (
    handle ~ '^[a-z0-9]([a-z0-9_-]{1,28}[a-z0-9])?$'
    and handle !~ '[-_]{2,}'
  ),

  -- Handle length guard (redundant with regex but explicit)
  constraint profiles_handle_length check (
    char_length(handle) >= 3
    and char_length(handle) <= 30
  ),

  -- Email basic non-empty check (Supabase Auth validates format)
  constraint profiles_email_not_empty check (
    char_length(trim(email)) > 0
  )
);

comment on table  public.profiles             is 'User profile linked 1:1 with auth.users';
comment on column public.profiles.id          is 'Matches auth.users.id';
comment on column public.profiles.handle      is 'Unique public handle (lowercase, 3-30 chars)';

-- Bookmarks ──────────────────────────────────────────────────

create table public.bookmarks (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  title      text        not null,
  url        text        not null,
  is_public  boolean     not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Title must be non-empty and <= 200 chars
  constraint bookmarks_title_not_empty check (
    char_length(trim(title)) > 0
  ),
  constraint bookmarks_title_max_length check (
    char_length(title) <= 200
  ),

  -- URL must be non-empty and look like a URL
  constraint bookmarks_url_not_empty check (
    char_length(trim(url)) > 0
  ),
  constraint bookmarks_url_format check (
    url ~ '^https?://.+'
  )
);

comment on table  public.bookmarks            is 'User-saved bookmarks';
comment on column public.bookmarks.is_public  is 'If true, visible on the user''s public profile';

-- ────────────────────────────────────────────────────────────
-- 3. Indexes
-- ────────────────────────────────────────────────────────────

-- Case-insensitive handle lookup (also powers uniqueness for mixed-case input)
create unique index profiles_handle_lower_idx
  on public.profiles (lower(handle));

-- Fast lookup of bookmarks by owner
create index bookmarks_user_id_idx
  on public.bookmarks (user_id);

-- Public bookmarks feed / profile page queries
create index bookmarks_user_id_is_public_idx
  on public.bookmarks (user_id, is_public)
  where is_public = true;

-- Ordering bookmarks by creation date
create index bookmarks_created_at_idx
  on public.bookmarks (created_at desc);

-- ────────────────────────────────────────────────────────────
-- 4. updated_at Trigger
-- ────────────────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookmarks_set_updated_at
  before update on public.bookmarks
  for each row
  execute function public.handle_updated_at();

-- ────────────────────────────────────────────────────────────
-- 4b. Auto-create profile on signup
--     Reads handle + email from auth.users.raw_user_meta_data
--     which is set via supabase.auth.signUp({ options: { data } })
-- ────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, handle)
  values (
    new.id,
    new.email,
    lower(trim(new.raw_user_meta_data ->> 'handle'))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 5. Row Level Security
-- ────────────────────────────────────────────────────────────

-- Enable RLS on both tables ──────────────────────────────────

alter table public.profiles  enable row level security;
alter table public.bookmarks enable row level security;

-- Profiles policies ──────────────────────────────────────────

-- Anyone (including anonymous) can read profiles (handles are public)
create policy "Profiles are publicly readable"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

-- Users can insert their own profile (signup flow)
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Users can update only their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- Bookmarks policies ─────────────────────────────────────────

-- Owner: SELECT own bookmarks (public + private)
create policy "Owner can select own bookmarks"
  on public.bookmarks
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Owner: INSERT bookmarks (only for themselves)
create policy "Owner can insert own bookmarks"
  on public.bookmarks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Owner: UPDATE own bookmarks
create policy "Owner can update own bookmarks"
  on public.bookmarks
  for update
  to authenticated
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Owner: DELETE own bookmarks
create policy "Owner can delete own bookmarks"
  on public.bookmarks
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Visitors: can read only public bookmarks
create policy "Anyone can read public bookmarks"
  on public.bookmarks
  for select
  to anon, authenticated
  using (is_public = true);
