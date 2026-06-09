export const mockUser = {
  id: "1",
  email: "alex@example.com",
  handle: "alexdev",
  avatarUrl: null,
  createdAt: "2024-12-01T10:00:00Z",
};

export const mockBookmarks = [
  {
    id: "1",
    title: "React Documentation",
    url: "https://react.dev",
    is_public: true,
    created_at: "2025-01-15T08:30:00Z",
  },
  {
    id: "2",
    title: "Next.js Learn",
    url: "https://nextjs.org/learn",
    is_public: true,
    created_at: "2025-02-10T14:20:00Z",
  },
  {
    id: "3",
    title: "Tailwind CSS Docs",
    url: "https://tailwindcss.com/docs",
    is_public: false,
    created_at: "2025-02-20T09:15:00Z",
  },
  {
    id: "4",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    is_public: true,
    created_at: "2025-03-05T11:00:00Z",
  },
  {
    id: "5",
    title: "GitHub",
    url: "https://github.com",
    is_public: false,
    created_at: "2025-03-12T16:45:00Z",
  },
  {
    id: "6",
    title: "Vercel Dashboard",
    url: "https://vercel.com/dashboard",
    is_public: false,
    created_at: "2025-04-01T07:30:00Z",
  },
  {
    id: "7",
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/handbook",
    is_public: true,
    created_at: "2025-04-18T13:10:00Z",
  },
  {
    id: "8",
    title: "Figma Design System",
    url: "https://www.figma.com",
    is_public: true,
    created_at: "2025-05-02T10:25:00Z",
  },
];

export const mockPublicProfiles = {
  alexdev: {
    handle: "alexdev",
    bookmarks: [
      {
        id: "1",
        title: "React Documentation",
        url: "https://react.dev",
        created_at: "2025-01-15T08:30:00Z",
      },
      {
        id: "2",
        title: "Next.js Learn",
        url: "https://nextjs.org/learn",
        created_at: "2025-02-10T14:20:00Z",
      },
      {
        id: "4",
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org",
        created_at: "2025-03-05T11:00:00Z",
      },
      {
        id: "7",
        title: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/handbook",
        created_at: "2025-04-18T13:10:00Z",
      },
      {
        id: "8",
        title: "Figma Design System",
        url: "https://www.figma.com",
        created_at: "2025-05-02T10:25:00Z",
      },
    ],
  },
  janedoe: {
    handle: "janedoe",
    bookmarks: [
      {
        id: "101",
        title: "Dribbble Inspiration",
        url: "https://dribbble.com",
        created_at: "2025-01-20T09:00:00Z",
      },
      {
        id: "102",
        title: "Awwwards",
        url: "https://www.awwwards.com",
        created_at: "2025-02-14T12:30:00Z",
      },
      {
        id: "103",
        title: "CSS Tricks",
        url: "https://css-tricks.com",
        created_at: "2025-03-01T15:45:00Z",
      },
    ],
  },
};
