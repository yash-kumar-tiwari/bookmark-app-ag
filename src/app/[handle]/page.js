"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getProfileByHandle,
  getPublicBookmarks,
} from "@/services/profile.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bookmark,
  ExternalLink,
  ArrowLeft,
  Globe,
  Link2,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

// ── Loading State ────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="hero-grid fixed inset-0" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
          <Bookmark className="size-5 text-primary animate-pulse" />
        </div>
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

// ── Error State ──────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="hero-grid fixed inset-0" />
      <div className="relative z-10 text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
          <AlertTriangle className="size-7 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{message}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6 gap-2"
          onClick={onRetry}
        >
          <RefreshCw className="size-3.5" />
          Try again
        </Button>
      </div>
    </div>
  );
}

// ── Not Found State ──────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="hero-grid fixed inset-0" />
      <div className="relative z-10 text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-muted mx-auto">
          <Bookmark className="size-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Profile not found</h1>
        <p className="mt-2 text-muted-foreground">
          This user doesn&apos;t exist or hasn&apos;t shared any bookmarks yet.
        </p>
        <Button variant="outline" size="sm" asChild className="mt-6 gap-2">
          <Link href="/" id="not-found-home">
            <ArrowLeft className="size-3.5" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ── Profile View ─────────────────────────────────────────────────────────
function ProfileView({ handle, bookmarks }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            id="profile-logo"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Bookmark className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Markly</span>
          </Link>
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href="/signup" id="profile-signup-cta">
              Create your own
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        {/* Profile header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Avatar size="lg" className="mb-4 size-20">
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {handle.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-2xl font-bold tracking-tight">@{handle}</h1>

          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Globe className="size-2.5" />
              {bookmarks.length}{" "}
              {bookmarks.length === 1 ? "bookmark" : "bookmarks"}
            </Badge>
          </div>
        </div>

        {/* Bookmarks grid */}
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
              <Link2 className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">No public bookmarks</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This user hasn&apos;t shared any bookmarks yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {bookmarks.map((bookmark) => {
              const domain = (() => {
                try {
                  return new URL(bookmark.url).hostname.replace("www.", "");
                } catch {
                  return bookmark.url;
                }
              })();

              return (
                <a
                  key={bookmark.id}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                  id={`public-bookmark-${bookmark.id}`}
                >
                  <Card className="border-border/60 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 group-hover:-translate-y-0.5">
                    <CardContent className="flex items-center gap-4 py-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Bookmark className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium group-hover:text-primary transition-colors">
                          {bookmark.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {domain}
                        </p>
                      </div>
                      <ExternalLink className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100" />
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 px-4 py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 text-xs text-muted-foreground">
          <Bookmark className="size-3" />
          <span>
            Powered by{" "}
            <Link
              href="/"
              className="font-medium text-foreground hover:underline underline-offset-4"
            >
              Markly
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}

// ── Page Component ───────────────────────────────────────────────────────
export default function HandlePage() {
  const params = useParams();
  const handle = params.handle;

  const [profile, setProfile] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  async function fetchProfile() {
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);

      // 1. Fetch profile by handle
      const profileData = await getProfileByHandle(handle);
      if (!profileData) {
        setNotFound(true);
        return;
      }

      setProfile(profileData);

      // 2. Fetch public bookmarks for this user
      const bookmarkData = await getPublicBookmarks(profileData.id);
      setBookmarks(bookmarkData);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (handle) fetchProfile();
  }, [handle]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchProfile} />;
  if (notFound) return <NotFound />;

  return <ProfileView handle={profile.handle} bookmarks={bookmarks} />;
}
