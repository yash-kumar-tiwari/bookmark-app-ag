import { supabase } from "@/lib/supabase";

/**
 * Check whether a handle is already taken.
 * Uses a case-insensitive match (DB has a lower() unique index).
 */
export async function checkHandleExists(handle) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("handle", handle.toLowerCase())
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

/**
 * Sign up a new user.
 *
 * Flow:
 *   1. Check handle uniqueness
 *   2. Create auth user with handle in metadata
 *   3. A database trigger (handle_new_user) auto-creates the profile row
 *      from raw_user_meta_data, so no manual insert is needed here.
 */
export async function signUp({ email, password, handle }) {
  const normalizedHandle = handle.toLowerCase().trim();

  // 1. Check if handle is taken
  const exists = await checkHandleExists(normalizedHandle);
  if (exists) {
    throw new Error("This handle is already taken");
  }

  // 2. Create auth user — pass handle + email as user metadata
  //    The DB trigger `handle_new_user` reads this metadata and
  //    inserts the profile row automatically (runs as security definer,
  //    so RLS does not block it).
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        handle: normalizedHandle,
        email,
      },
    },
  });

  console.log(data, error, "signup");

  if (error) throw error;
  if (!data.user) throw new Error("Signup failed — no user returned");

  return data;
}

/**
 * Sign in with email + password.
 */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
