# Markly — Development Prompt Log

A chronological record of all prompts used to build this application. Each entry documents what was requested and what was produced.

---

## Prompt 1 — Frontend UI (Initial Build)

**Date:** 2026-06-09  
**Phase:** Frontend scaffolding

**Prompt:**

> Build ONLY frontend UI.
>
> Stack:
> - Next.js 16 App Router
> - JavaScript
> - Tailwind
> - shadcn/ui
> - React Hook Form
> - Zod
>
> Do NOT use: Supabase, Resend, API routes, Server actions, Middleware
>
> Create pages:
> - `/`
> - `/login`
> - `/signup`
> - `/dashboard`
> - `/[handle]`
>
> Forms:
>
> Signup: email, password, handle  
> Login: email, password  
> Bookmark: title, url, is_public  
>
> Use RHF + Zod. Submit handlers should only: `console.log(data);`
>
> Dashboard: user card, handle, bookmark list, add bookmark dialog, edit bookmark dialog, delete dialog. Use mock data only.
>
> Public profile `/[handle]`: Show handle, public bookmarks. Use mock data.
>
> Output complete code only. Do not add backend logic.

**What was produced:**

- `src/app/page.js` — Landing page with hero, feature cards, CTA
- `src/app/login/page.js` — Login form (RHF + Zod)
- `src/app/signup/page.js` — Signup form with handle field (RHF + Zod)
- `src/app/dashboard/page.js` — Full dashboard with user card, bookmark list, add/edit/delete dialogs
- `src/app/[handle]/page.js` — Server component for dynamic route
- `src/app/[handle]/public-profile-client.jsx` — Public profile with bookmark cards
- `src/components/navbar.jsx` — Responsive glassmorphism navbar
- `src/lib/schemas.js` — Zod schemas (signup, login, bookmark)
- `src/lib/mock-data.js` — Mock user, bookmarks, and public profiles
- `src/app/globals.css` — Premium violet/indigo dark theme with design tokens
- `src/app/layout.js` — Root layout (dark mode, Geist fonts, Sonner toaster)

**Build result:** ✅ Compiled successfully — all 6 routes generated (0 errors)

---

## Prompt 2 — Supabase Database Schema

**Date:** 2026-06-09  
**Phase:** Database setup

**Prompt:**

> Implement ONLY Supabase database setup. Do NOT modify frontend.
>
> Create SQL for:
>
> profiles: id uuid PK, email, handle unique, created_at  
> bookmarks: id uuid PK, user_id, title, url, is_public, created_at, updated_at
>
> Requirements: foreign keys, indexes, constraints, unique handle, handle validation, updated_at trigger
>
> Enable RLS.
>
> Profiles: Public can read handles.  
> Bookmarks: Owner can select/insert/update/delete using `auth.uid() = user_id`. Visitors can only read `is_public = true`.
>
> Generate complete SQL, indexes, constraints, RLS policies. Output SQL only.

**What was produced:**

- `supabase/migrations/00001_initial_schema.sql` — Complete migration with:
  - `profiles` table (FK → `auth.users`, handle regex validation, unique constraint)
  - `bookmarks` table (FK → `profiles`, title/url constraints, `updated_at` trigger)
  - 4 indexes (handle lookup, user_id, partial public bookmarks, created_at desc)
  - RLS enabled on both tables with 7 policies

**Build result:** ✅ No frontend changes — build unaffected

---

## Prompt 3 — README & Prompt Log

**Date:** 2026-06-09  
**Phase:** Documentation

**Prompt:**

> Update README with instructions and also add plans folder and add prompt so that keep record of prompts used while developing the app.

**What was produced:**

- `README.md` — Complete project documentation (tech stack, pages, features, setup, database schema, project structure, env vars)
- `plans/prompts.md` — This file (chronological prompt log)

---

*— End of log. Append new prompts below as development continues. —*
