import { supabase } from "@/lib/supabase";

/**
 * Fetch a profile by handle.
 * RLS allows public reads on profiles.
 */
export async function getProfileByHandle(handle) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, handle, created_at")
    .eq("handle", handle.toLowerCase())
    .maybeSingle();

  if (error) throw error;
  return data; // null if not found
}

/**
 * Fetch public bookmarks for a given user id.
 * RLS ensures only is_public = true rows are returned to non-owners.
 */
export async function getPublicBookmarks(userId) {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id, title, url, is_public, created_at")
    .eq("user_id", userId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
