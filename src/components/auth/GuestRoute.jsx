"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bookmark, Loader2 } from "lucide-react";

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
        <Bookmark className="size-5 text-primary animate-pulse" />
      </div>
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return <FullPageSpinner />;
  if (user) return null;

  return <>{children}</>;
}
