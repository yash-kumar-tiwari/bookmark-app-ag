"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bookmark, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          id="navbar-logo"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Bookmark className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">Markly</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login" id="nav-login">
              Log in
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup" id="nav-signup">
              Get started
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="sm:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          id="nav-mobile-toggle"
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background px-4 pb-4 sm:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2 pt-3">
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                Log in
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup" onClick={() => setMobileOpen(false)}>
                Get started
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
