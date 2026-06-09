import { z } from "zod";

export const signupSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(72, { message: "Password must be at most 72 characters" }),
  handle: z
    .string()
    .min(3, { message: "Handle must be at least 3 characters" })
    .max(30, { message: "Handle must be at most 30 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Handle can only contain letters, numbers, hyphens, and underscores",
    }),
});

export const loginSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" }),
});

export const bookmarkSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be at most 200 characters" }),
  url: z
    .url({ message: "Please enter a valid URL" }),
  is_public: z.boolean().default(false),
});
