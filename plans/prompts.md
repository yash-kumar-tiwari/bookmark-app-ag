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

## Prompt 4 — Authentication (Supabase Auth)

**Date:** 2026-06-10  
**Phase:** Authentication

**Prompt:**

> Implement ONLY authentication. Database already exists.
>
> Stack: Next.js 16, JavaScript, Supabase Auth. CSR only.
>
> Do NOT use: middleware, API routes, server actions
>
> Create:
> - `src/lib/supabase.js`
> - `src/services/auth.service.js`
> - `src/hooks/useAuth.js`
> - `src/components/auth/ProtectedRoute.jsx`
> - `src/components/auth/GuestRoute.jsx`
>
> Signup flow: check handle exists → sign up user → create profile row → redirect /dashboard  
> Login: signInWithPassword → redirect /dashboard  
> Logout: signOut → redirect /login
>
> Dashboard: ProtectedRoute required.  
> Login/Signup: GuestRoute required.
>
> Handle: unique, lowercase, url friendly. Use RHF + Zod.
>
> Output complete code only. Do not implement bookmarks.

**What was produced:**

- `src/lib/supabase.js` — Browser-only Supabase client with env var validation
- `src/services/auth.service.js` — Auth service (checkHandleExists, signUp, signIn, signOut)
- `src/hooks/useAuth.js` — AuthContext + AuthProvider + useAuth hook (getSession, onAuthStateChange, profile fetch)
- `src/components/auth/ProtectedRoute.jsx` — Redirects to /login if unauthenticated, branded spinner
- `src/components/auth/GuestRoute.jsx` — Redirects to /dashboard if authenticated, branded spinner
- `src/app/layout.js` — Added AuthProvider wrapper
- `src/app/login/page.js` — Wrapped in GuestRoute, real signIn call, auth error banner
- `src/app/signup/page.js` — Wrapped in GuestRoute, 3-step signup flow, handle uniqueness check
- `src/app/dashboard/page.js` — Wrapped in ProtectedRoute, real user data from useAuth, real signOut
- `.env.example` — Environment variable template

**Key decisions:**
- Handle normalized to lowercase in auth.service (not in Zod schema) to keep validation separate from transformation
- AuthProvider placed in root layout so all pages have access
- Profile is fetched once on auth state change, not on every render
- Bookmark CRUD left as mock data (not implemented per requirement)

---

## Prompt 5 — Bookmark CRUD (Supabase)

**Date:** 2026-06-10  
**Phase:** Bookmark implementation

**Prompt:**

> Implement bookmark CRUD. Authentication already works. Database already exists.
>
> Stack: Next.js 16, JavaScript, Supabase. CSR only.
>
> Create: `src/services/bookmark.service.js`
>
> Functions: getBookmarks, createBookmark, updateBookmark, deleteBookmark
>
> Dashboard: list, add, edit, delete. Use existing forms. Never filter security on frontend — trust RLS.
> Show loading and error states. Refresh UI after mutations.

**What was produced:**

- `src/services/bookmark.service.js` — 4 CRUD functions using Supabase client, all rely on RLS
- `src/app/dashboard/page.js` — Replaced mock data with real Supabase queries:
  - Loading spinner while fetching
  - Error state with retry button
  - Async CRUD handlers that refetch after mutations
  - Dialogs show spinners during async operations
  - Removed `mockBookmarks` import

**Key decisions:**
- `getBookmarks()` does not filter by user_id — RLS handles it
- `createBookmark()` gets user.id from `supabase.auth.getUser()` since `user_id` FK is required
- After every mutation, `fetchBookmarks()` is called to refresh the full list from the server
- Dialog submit handlers re-throw errors so the dialog stays open on failure

---

## Prompt 6 — Public Profile Route (Supabase)

**Date:** 2026-06-10  
**Phase:** Public profile

**Prompt:**

> Implement public profile route `/[handle]`. Accessible without login.
>
> Fetch profile by handle, fetch public bookmarks only (is_public = true).
> Display handle and public bookmarks. Never expose private bookmarks.
>
> Create: `src/services/profile.service.js`
> Reuse existing bookmark cards. Show profile not found state.

**What was produced:**

- `src/services/profile.service.js` — `getProfileByHandle(handle)` + `getPublicBookmarks(userId)`
- `src/app/[handle]/page.js` — Rewrote as single CSR page with 4 states: loading, error, not found, profile view
- Deleted `src/app/[handle]/public-profile-client.jsx` (merged into page.js)

**Key decisions:**
- `getPublicBookmarks()` explicitly filters `is_public = true` as belt-and-suspenders with RLS
- Removed `generateStaticParams` and `generateMetadata` — page is now fully CSR (no server component)
- Profile fetched by handle, then public bookmarks fetched by the profile's user id
- `maybeSingle()` used for profile lookup so null = not found (no error thrown)

---

## Prompt 7 — Welcome Email Integration (Resend)

**Date:** 2026-06-10  
**Phase:** Email notification integration

**Prompt:**

> Authentication already works.
> 
> Implement welcome email.
> 
> Use: Resend
> 
> Create: src/services/email.service.js
> 
> Create: .env.example
> 
> ```env
> NEXT_PUBLIC_SUPABASE_URL=
> NEXT_PUBLIC_SUPABASE_ANON_KEY=
> SUPABASE_SERVICE_ROLE_KEY=
> RESEND_API_KEY=
> NEXT_PUBLIC_APP_URL=
> ```
> 
> After successful signup: Send email.
> 
> Subject: Welcome to Bookmarks
> 
> Email contains:
> - greeting
> - user handle
> - dashboard link
> 
> Handle failures gracefully. Do not block signup if email fails.
> 
> Provide: Resend setup, Supabase setup, Vercel deployment steps
> 
> Output complete code only.

**What was produced:**

- `src/services/email.service.js` — Client-side service wrapper that invokes our server API.
- `src/app/api/send-welcome/route.js` — Server-side Next.js API route to securely handle the Resend API call without key exposure.
- `src/app/signup/page.js` — Integrated `sendWelcomeEmail` call inside the form submission after successful signup, catching errors gracefully.
- `.env.example` — Configuration template containing the five required environment variables.

**Key decisions:**
- Created a Next.js Route Handler for server-side execution because `RESEND_API_KEY` is a secret key and must not be exposed to the client browser.
- Wrapped the API request client-side and server-side in try/catch blocks so any errors (such as missing/expired keys or network failure) are logged to the console instead of throwing errors that block signup.

---

## Prompt 8 — Bookmark Visibility Bug Fix

**Date:** 2026-06-10  
**Phase:** Security and query scoping

**Prompt:**

> BUG FIX ONLY
> 
> Do NOT rebuild the application.
> Do NOT create new pages.
> Do NOT change UI.
> 
> Analyze the existing codebase and fix the bookmark visibility/security issue.
> 
> Current bug:
> User A: 3 bookmarks (2 public, 1 private).
> User B logs in. Dashboard incorrectly shows User A's public bookmarks.
> 
> Expected behavior:
> Dashboard must ONLY show bookmarks owned by the currently authenticated user.
> 
> RLS Requirements:
> Owner should be able to SELECT/INSERT/UPDATE/DELETE own bookmarks using `auth.uid() = user_id`.
> Public visitors should only be able to read bookmarks where `is_public = true`.
> 
> Service Layer Requirements:
> Dashboard service: must fetch bookmarks by current authenticated user id.
> Public profile service: must fetch bookmarks by profile id AND is_public = true.
> Separate methods if needed (e.g. getMyBookmarks()).

**What was produced:**

- `src/services/bookmark.service.js` — Renamed `getBookmarks()` to `getMyBookmarks()`, added dynamic retrieval of the authenticated user's ID using `supabase.auth.getUser()`, and added an explicit `.eq("user_id", user.id)` filter to ensure only the owner's bookmarks are fetched.
- `src/app/dashboard/page.js` — Updated imports and function calls to use `getMyBookmarks()` instead of `getBookmarks()`.

**Key decisions:**
- Rather than modifying database RLS policies (which correctly allow anyone, including logged-in users, to read public bookmarks of other users when visiting their public profile page), the query scoping on the dashboard was fixed. By explicitly filtering dashboard queries by the authenticated user's ID, we ensure other users' public bookmarks are not returned in the dashboard.
- Renamed the service function to `getMyBookmarks()` to distinguish it cleanly from public profile bookmark retrieval services.

---

*— End of log. Append new prompts below as development continues. —*


