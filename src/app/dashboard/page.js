"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookmarkSchema } from "@/lib/schemas";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/services/auth.service";
import {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
} from "@/services/bookmark.service";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bookmark,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Globe,
  Lock,
  LogOut,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

// ── Add Bookmark Dialog ──────────────────────────────────────────────────
function AddBookmarkDialog({ open, onOpenChange, onAdd }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: { title: "", url: "", is_public: false },
  });

  async function onSubmit(data) {
    try {
      await onAdd(data);
      reset();
      onOpenChange(false);
    } catch {
      // error handled by parent
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add bookmark</DialogTitle>
          <DialogDescription>
            Save a new link to your collection.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="add-bookmark-form">
          <div className="space-y-2">
            <Label htmlFor="add-title">Title</Label>
            <Input
              id="add-title"
              placeholder="My awesome link"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-url">URL</Label>
            <Input
              id="add-url"
              placeholder="https://example.com"
              {...register("url")}
              aria-invalid={!!errors.url}
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Public bookmark</p>
                <p className="text-xs text-muted-foreground">
                  Visible on your public profile
                </p>
              </div>
            </div>
            <Controller
              name="is_public"
              control={control}
              render={({ field }) => (
                <Switch
                  id="add-is-public"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} id="add-bookmark-submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Adding…
                </>
              ) : (
                "Add bookmark"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit Bookmark Dialog ─────────────────────────────────────────────────
function EditBookmarkDialog({ open, onOpenChange, bookmark, onEdit }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      title: bookmark?.title ?? "",
      url: bookmark?.url ?? "",
      is_public: bookmark?.is_public ?? false,
    },
  });

  async function onSubmit(data) {
    try {
      await onEdit(bookmark.id, data);
      onOpenChange(false);
    } catch {
      // error handled by parent
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit bookmark</DialogTitle>
          <DialogDescription>
            Update the details of your bookmark.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="edit-bookmark-form">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              placeholder="My awesome link"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-url">URL</Label>
            <Input
              id="edit-url"
              placeholder="https://example.com"
              {...register("url")}
              aria-invalid={!!errors.url}
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Public bookmark</p>
                <p className="text-xs text-muted-foreground">
                  Visible on your public profile
                </p>
              </div>
            </div>
            <Controller
              name="is_public"
              control={control}
              render={({ field }) => (
                <Switch
                  id="edit-is-public"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} id="edit-bookmark-submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete Confirmation Dialog ───────────────────────────────────────────
function DeleteBookmarkDialog({ open, onOpenChange, bookmark, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    try {
      setDeleting(true);
      await onDelete(bookmark.id);
      onOpenChange(false);
    } catch {
      // error handled by parent
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <AlertTriangle />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete bookmark?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove{" "}
            <span className="font-medium text-foreground">
              &quot;{bookmark?.title}&quot;
            </span>{" "}
            from your collection. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting} id="delete-cancel">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={deleting}
            onClick={handleConfirm}
            id="delete-confirm"
          >
            {deleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ── Bookmark Row ─────────────────────────────────────────────────────────
function BookmarkRow({ bookmark, onEdit, onDelete }) {
  const domain = (() => {
    try {
      return new URL(bookmark.url).hostname.replace("www.", "");
    } catch {
      return bookmark.url;
    }
  })();

  return (
    <div className="group flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-muted/50">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Bookmark className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{bookmark.title}</p>
          {bookmark.is_public ? (
            <Badge variant="secondary" className="shrink-0 gap-1">
              <Globe className="size-2.5" />
              Public
            </Badge>
          ) : (
            <Badge variant="outline" className="shrink-0 gap-1">
              <Lock className="size-2.5" />
              Private
            </Badge>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{domain}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon-sm"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            id={`bookmark-open-${bookmark.id}`}
          >
            <ExternalLink className="size-3.5" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(bookmark)}
          id={`bookmark-edit-${bookmark.id}`}
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(bookmark)}
          id={`bookmark-delete-${bookmark.id}`}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ── Dashboard Content ────────────────────────────────────────────────────
function DashboardContent() {
  const router = useRouter();
  const { profile } = useAuth();

  // Bookmark state
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  // UI state
  const [copied, setCopied] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const publicCount = bookmarks.filter((b) => b.is_public).length;
  const privateCount = bookmarks.filter((b) => !b.is_public).length;

  const handle = profile?.handle ?? "user";
  const email = profile?.email ?? "";

  // ── Fetch bookmarks ──────────────────────────────────────────────────
  const fetchBookmarks = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getBookmarks();
      setBookmarks(data);
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
      setError(err?.message || "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // ── CRUD handlers ────────────────────────────────────────────────────
  async function handleAdd(data) {
    try {
      await createBookmark(data);
      toast.success("Bookmark added");
      await fetchBookmarks();
    } catch (err) {
      toast.error(err?.message || "Failed to add bookmark");
      throw err; // re-throw so dialog knows it failed
    }
  }

  async function handleEdit(id, data) {
    try {
      await updateBookmark(id, data);
      toast.success("Bookmark updated");
      await fetchBookmarks();
    } catch (err) {
      toast.error(err?.message || "Failed to update bookmark");
      throw err;
    }
  }

  async function handleDelete(id) {
    try {
      await deleteBookmark(id);
      toast.success("Bookmark deleted");
      await fetchBookmarks();
    } catch (err) {
      toast.error(err?.message || "Failed to delete bookmark");
      throw err;
    }
  }

  function handleCopyProfileLink() {
    navigator.clipboard
      ?.writeText(`${window.location.origin}/${handle}`)
      .then(() => {
        setCopied(true);
        toast.success("Profile link copied!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error("Failed to copy"));
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await signOut();
      toast.success("Signed out");
      router.replace("/login");
    } catch (err) {
      toast.error(err?.message || "Failed to sign out");
      setLoggingOut(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            id="dashboard-logo"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Bookmark className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Markly</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={handleLogout}
            disabled={loggingOut}
            id="dashboard-logout"
          >
            <LogOut className="size-3.5" />
            {loggingOut ? "Signing out…" : "Log out"}
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* ── Sidebar: User Card ────────────────────────────────────── */}
          <div className="space-y-4">
            <Card className="border-border/60">
              <CardContent className="flex flex-col items-center pt-2 text-center">
                <Avatar size="lg" className="mb-3 size-16">
                  <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                    {handle.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold">@{handle}</h2>
                <p className="text-sm text-muted-foreground">{email}</p>

                <Separator className="my-4" />

                <div className="grid w-full grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xl font-bold">{bookmarks.length}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{publicCount}</p>
                    <p className="text-xs text-muted-foreground">Public</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{privateCount}</p>
                    <p className="text-xs text-muted-foreground">Private</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={handleCopyProfileLink}
                  id="copy-profile-link"
                >
                  {copied ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy profile link"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full gap-2 text-muted-foreground"
                  asChild
                >
                  <Link href={`/${handle}`} id="view-public-profile">
                    <ExternalLink className="size-3.5" />
                    View public profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ── Main: Bookmark List ───────────────────────────────────── */}
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Bookmarks</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your saved links
                </p>
              </div>
              <Button
                className="gap-2"
                onClick={() => setAddOpen(true)}
                id="add-bookmark-trigger"
              >
                <Plus className="size-4" />
                Add bookmark
              </Button>
            </div>

            {/* List */}
            <Card className="border-border/60">
              <CardContent className="p-2">
                {/* Loading state */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Loader2 className="mb-3 size-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Loading bookmarks…
                    </p>
                  </div>
                ) : error ? (
                  /* Error state */
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
                      <AlertTriangle className="size-6 text-destructive" />
                    </div>
                    <h3 className="font-semibold">Failed to load bookmarks</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                    <Button
                      variant="outline"
                      className="mt-4 gap-2"
                      onClick={fetchBookmarks}
                      id="retry-fetch"
                    >
                      <RefreshCw className="size-3.5" />
                      Try again
                    </Button>
                  </div>
                ) : bookmarks.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
                      <Bookmark className="size-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold">No bookmarks yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add your first bookmark to get started
                    </p>
                    <Button
                      className="mt-4 gap-2"
                      onClick={() => setAddOpen(true)}
                      id="add-first-bookmark"
                    >
                      <Plus className="size-4" />
                      Add bookmark
                    </Button>
                  </div>
                ) : (
                  /* Bookmark list */
                  <div className="divide-y divide-border/60">
                    {bookmarks.map((bookmark) => (
                      <BookmarkRow
                        key={bookmark.id}
                        bookmark={bookmark}
                        onEdit={(b) => {
                          setSelectedBookmark(b);
                          setEditOpen(true);
                        }}
                        onDelete={(b) => {
                          setSelectedBookmark(b);
                          setDeleteOpen(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <AddBookmarkDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={handleAdd}
      />

      {selectedBookmark && (
        <>
          <EditBookmarkDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            bookmark={selectedBookmark}
            onEdit={handleEdit}
          />
          <DeleteBookmarkDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            bookmark={selectedBookmark}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}

// ── Dashboard Page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
