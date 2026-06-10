# Markly — Smart Bookmark Manager

A modern, premium bookmark manager built with **Next.js 16 (App Router)**, **Supabase**, and **Nodemailer SMTP**. Save, organize, and share your bookmarks with a beautiful dark-mode interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Nodemailer](https://img.shields.io/badge/Nodemailer-SMTP-blue?logo=nodemailer)

---

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| **Framework**  | Next.js 16 (App Router)             |
| **Language**   | JavaScript                          |
| **Styling**    | Tailwind CSS 4                      |
| **UI**         | shadcn/ui (Radix primitives)        |
| **Forms**      | React Hook Form + Zod               |
| **Database**   | Supabase (PostgreSQL + RLS)         |
| **Auth**       | Supabase Auth (CSR flow)            |
| **Email**      | Nodemailer (Gmail SMTP)             |
| **Toasts**     | Sonner                              |
| **Icons**      | Lucide React                        |

---

## Pages & Routes

| Route          | Protection     | Description                                               |
| -------------- | -------------- | --------------------------------------------------------- |
| `/`            | Public         | Landing page — hero, features, CTA                        |
| `/login`       | Guest Only     | Login page (email + password)                             |
| `/signup`      | Guest Only     | Signup page (email + handle + password)                   |
| `/dashboard`   | Authenticated  | User dashboard — bookmark CRUD list                       |
| `/[handle]`    | Public         | Public profile page — displays user's public bookmarks    |
| `/api/send-welcome`| Public API | Server-side endpoint to securely send welcome email       |

---

## Features

- **Supabase Auth Integration** — Real-time authentication flow with route protection (`ProtectedRoute` for dashboard, `GuestRoute` for auth forms).
- **Bookmark CRUD** — Create, Read, Update, and Delete bookmarks via interactive modal dialogs.
- **Privacy Controls** — Individual bookmarks can be set to Public (shown on your public profile) or Private.
- **Ownership-Based Dashboard** — Secured query logic fetches bookmarks matching strictly the logged-in user (`user_id = user.id`), preventing leaks of other users' public bookmarks.
- **Public Profiles** — Access public bookmarks of any user via their handle URL `/{handle}` (case-insensitive handle validation).
- **Transactional Emails** — Welcome email triggered securely from the server-side API handler `/api/send-welcome` on successful signup using Nodemailer SMTP (e.g., Gmail App Passwords) without blocking redirection.
- **Form validation** — All input forms validate inputs using React Hook Form and Zod schemas.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or pnpm / yarn)
- A Supabase account (Database + Auth)
- A Gmail account (with an App Password enabled)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root of the project with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-gmail-app-password

NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(An [.env.example](.env.example) template is provided in the repository)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Setup & RLS

The database migrations live in the `supabase/migrations` directory.

### Migrations
1. **`00001_initial_schema.sql`** — Scaffolds tables, indexes, constraints, updated_at triggers, and row-level security (RLS) policies.
2. **`00002_profile_trigger.sql`** — Adds the `on_auth_user_created` trigger that automatically inserts a profile row when a user signs up.

### Row Level Security (RLS) Policies

| Table       | Operation | Target Roles         | policy condition / check                               |
| ----------- | --------- | -------------------- | ------------------------------------------------------ |
| `profiles`  | SELECT    | anon, authenticated  | `true` (publicly readable handles)                     |
| `profiles`  | INSERT    | authenticated        | `auth.uid() = id`                                      |
| `profiles`  | UPDATE    | authenticated        | `auth.uid() = id`                                      |
| `bookmarks` | SELECT    | authenticated        | `auth.uid() = user_id` (Owner read)                    |
| `bookmarks` | SELECT    | anon, authenticated  | `is_public = true` (Public read for visitor pages)     |
| `bookmarks` | INSERT    | authenticated        | `auth.uid() = user_id`                                 |
| `bookmarks` | UPDATE    | authenticated        | `auth.uid() = user_id`                                 |
| `bookmarks` | DELETE    | authenticated        | `auth.uid() = user_id`                                 |

---

## Project Structure

```
bookmark-app/
├── plans/                      # Prompt history and logs
│   └── prompts.md              # Chronological history of prompt entries
├── public/                     # Static assets
├── supabase/
│   └── migrations/             # Database migrations
│       ├── 00001_initial_schema.sql
│       └── 00002_profile_trigger.sql
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── send-welcome/
│   │   │       └── route.js    # Secure Nodemailer server endpoint
│   │   ├── globals.css         # Tailwind tokens & themes
│   │   ├── layout.js           # Root layout with AuthProvider
│   │   ├── page.js             # Landing page
│   │   ├── login/page.js       # Login page
│   │   ├── signup/page.js      # Signup page (triggers welcome email)
│   │   ├── dashboard/page.js   # Dashboard page (CRUD)
│   │   └── [handle]/
│   │       └── page.js         # Public profile dynamic page
│   ├── components/
│   │   ├── navbar.jsx          # Top Navigation component
│   │   ├── auth/
│   │   │   ├── GuestRoute.jsx  # Guest protection wrapper
│   │   │   └── ProtectedRoute.jsx # Auth protection wrapper
│   │   └── ui/                 # shadcn UI components
│   ├── hooks/
│   │   └── useAuth.js          # AuthContext and Auth state hook
│   ├── lib/
│   │   ├── mailer.js           # Singleton Nodemailer SMTP utility
│   │   ├── supabase.js         # Supabase client instantiation
│   │   ├── schemas.js          # Zod validation schemas
│   │   └── utils.js            # cn helper
│   └── services/
│       ├── auth.service.js     # Signup/Login/Signout database logic
│       ├── bookmark.service.js # CRUD bookmarks database logic (scoped)
│       ├── email.service.js    # Client-side welcome email trigger
│       └── profile.service.js  # Handle profile & public bookmark logic
├── package.json
└── README.md
```

---

## Deployment (Vercel)

1. Connect your repository to Vercel.
2. In the project dashboard under **Settings** -> **Environment Variables**, define the environment variables listed in the configuration step. Set `NEXT_PUBLIC_APP_URL` to your production URL.
3. Deploy the project.

---

## Development Log

All phases and prompts used to design and develop Markly are archived inside [`plans/prompts.md`](plans/prompts.md).

---

## License

Private project — all rights reserved.
