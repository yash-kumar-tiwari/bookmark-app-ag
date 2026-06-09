"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bookmark, Eye, EyeOff, AtSign } from "lucide-react";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      handle: "",
    },
  });

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="hero-grid fixed inset-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2">
        <div className="h-[400px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
          id="signup-logo"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <Bookmark className="size-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Markly</span>
        </Link>

        <Card className="glow border-border/60">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>
              Start organizing your bookmarks today
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="signup-form">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-destructive" id="signup-email-error">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Handle */}
              <div className="space-y-2">
                <Label htmlFor="signup-handle">Handle</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground">
                    <AtSign className="size-3.5" />
                  </div>
                  <Input
                    id="signup-handle"
                    type="text"
                    placeholder="yourhandle"
                    autoComplete="username"
                    className="pl-8"
                    {...register("handle")}
                    aria-invalid={!!errors.handle}
                  />
                </div>
                {errors.handle ? (
                  <p className="text-xs text-destructive" id="signup-handle-error">
                    {errors.handle.message}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    This will be your public profile URL
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    id="signup-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="size-3.5" />
                    ) : (
                      <Eye className="size-3.5" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive" id="signup-password-error">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
                id="signup-submit"
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
                id="signup-login-link"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
