import { supabase } from "@/lib/supabase";

/**
 * Fetch all bookmarks for the current authenticated user only.
 * Explicitly filters by user_id to prevent showing other users' public bookmarks.
 */
export async function getMyBookmarks() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create a new bookmark.
 * RLS ensures user_id must match auth.uid().
 */
export async function createBookmark({ title, url, is_public }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: user.id,
      title,
      url,
      is_public,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing bookmark by id.
 * RLS ensures only the owner can update.
 */
export async function updateBookmark(id, { title, url, is_public }) {
  const { data, error } = await supabase
    .from("bookmarks")
    .update({ title, url, is_public })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a bookmark by id.
 * RLS ensures only the owner can delete.
 */
export async function deleteBookmark(id) {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
