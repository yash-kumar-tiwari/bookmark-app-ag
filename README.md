# Markly — Smart Bookmark Manager

A modern bookmark manager built with Next.js 16, Supabase, and shadcn/ui. Save, organize, and share your bookmarks with a beautiful dark-mode interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | Next.js 16 (App Router)             |
| Language     | JavaScript                          |
| Styling      | Tailwind CSS 4                      |
| UI           | shadcn/ui (Radix primitives)        |
| Forms        | React Hook Form + Zod               |
| Database     | Supabase (PostgreSQL + Auth + RLS)  |
| Fonts        | Geist Sans / Geist Mono             |
| Toasts       | Sonner                              |
| Icons        | Lucide React                        |

## Pages

| Route          | Description                                      |
| -------------- | ------------------------------------------------ |
| `/`            | Landing page — hero, features, CTA               |
| `/login`       | Login form (email + password)                     |
| `/signup`      | Signup form (email + handle + password)           |
| `/dashboard`   | Authenticated dashboard — bookmarks CRUD          |
| `/[handle]`    | Public profile — shows handle + public bookmarks  |

## Features

- **Bookmark CRUD** — Add, edit, delete bookmarks via modal dialogs
- **Public/Private toggle** — Each bookmark can be public or private
- **Public profiles** — Anyone can view public bookmarks at `/{handle}`
- **Form validation** — All forms use React Hook Form + Zod schemas
- **Dark mode** — Premium violet/indigo design system
- **Responsive** — Mobile-first with glassmorphism navbar
- **Mock data** — Frontend works standalone with mock data (no backend required)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm / yarn)
- Supabase project (for database — optional for frontend-only dev)

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm start
```

---

## Database Setup (Supabase)

The SQL migration lives at:

```
supabase/migrations/00001_initial_schema.sql
```

### Tables

**`profiles`**
| Column       | Type         | Notes                        |
| ------------ | ------------ | ---------------------------- |
| `id`         | uuid (PK)    | FK → `auth.users(id)`        |
| `email`      | text         | Not null                     |
| `handle`     | text         | Unique, validated via regex   |
| `created_at` | timestamptz  | Default `now()`              |

**`bookmarks`**
| Column       | Type         | Notes                        |
| ------------ | ------------ | ---------------------------- |
| `id`         | uuid (PK)    | Auto-generated               |
| `user_id`    | uuid (FK)    | FK → `profiles(id)`          |
| `title`      | text         | 1–200 chars                  |
| `url`        | text         | Must match `https?://`       |
| `is_public`  | boolean      | Default `false`              |
| `created_at` | timestamptz  | Default `now()`              |
| `updated_at` | timestamptz  | Auto-updated via trigger     |

### Row Level Security (RLS)

| Policy                       | Table       | Who             | Access              |
| ---------------------------- | ----------- | --------------- | ------------------- |
| Profiles publicly readable   | `profiles`  | Everyone        | SELECT              |
| Users update own profile     | `profiles`  | Authenticated   | UPDATE (own)        |
| Owner select own bookmarks   | `bookmarks` | Authenticated   | SELECT (own)        |
| Owner insert own bookmarks   | `bookmarks` | Authenticated   | INSERT (own)        |
| Owner update own bookmarks   | `bookmarks` | Authenticated   | UPDATE (own)        |
| Owner delete own bookmarks   | `bookmarks` | Authenticated   | DELETE (own)        |
| Anyone read public bookmarks | `bookmarks` | Everyone        | SELECT (is_public)  |

### Run the migration

In the Supabase SQL Editor, paste and run the contents of `supabase/migrations/00001_initial_schema.sql`.

Or with the Supabase CLI:

```bash
supabase db push
```

---

## Project Structure

```
bookmark-app/
├── public/                    # Static assets
├── plans/                     # Development prompts & planning docs
│   └── prompts.md             # Prompt log used during development
├── supabase/
│   └── migrations/
│       └── 00001_initial_schema.sql
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind + design tokens
│   │   ├── layout.js          # Root layout (dark mode, fonts)
│   │   ├── page.js            # Landing page
│   │   ├── login/page.js      # Login form
│   │   ├── signup/page.js     # Signup form
│   │   ├── dashboard/page.js  # Dashboard (CRUD)
│   │   └── [handle]/
│   │       ├── page.js                # Server component (metadata)
│   │       └── public-profile-client.jsx  # Client component
│   ├── components/
│   │   ├── navbar.jsx         # App navbar
│   │   └── ui/                # shadcn/ui components (55+)
│   └── lib/
│       ├── utils.js           # cn() utility
│       ├── schemas.js         # Zod validation schemas
│       └── mock-data.js       # Mock data for standalone dev
├── components.json            # shadcn/ui configuration
├── next.config.mjs
├── package.json
└── README.md
```

---

## Environment Variables

When connecting to Supabase, create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> **Note:** The frontend currently uses mock data and does not require these variables to run.

---

## Development Log

All prompts used during development are documented in [`plans/prompts.md`](plans/prompts.md).

---

## License

Private project — all rights reserved.
