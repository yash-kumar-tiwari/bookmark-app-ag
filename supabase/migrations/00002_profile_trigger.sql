-- ============================================================
-- Markly — Fix: Auto-create profile on signup
-- Migration: 00002_profile_trigger
--
-- Problem:  After signUp(), the session may not exist yet
--           (e.g. email confirmation enabled), so the client-side
--           profiles.insert() fails with RLS violation (42501).
--
-- Solution: Use a database trigger on auth.users that auto-creates
--           the profile row from raw_user_meta_data. The trigger
--           runs as SECURITY DEFINER, bypassing RLS entirely.
-- ============================================================

-- Create the trigger function
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

-- Fire after every new user is created in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
