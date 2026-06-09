import Link from "next/link";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Globe,
  Lock,
  Share2,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "Markly — Smart Bookmark Manager",
  description:
    "Save, organize, and share your bookmarks beautifully. Your personal link library, available anywhere.",
};

const features = [
  {
    icon: Bookmark,
    title: "Save Anything",
    description:
      "Capture links from anywhere with a single click. Organize with custom collections and tags.",
  },
  {
    icon: Globe,
    title: "Public Profile",
    description:
      "Share your curated bookmarks with the world through a beautiful public profile page.",
  },
  {
    icon: Lock,
    title: "Private by Default",
    description:
      "Your bookmarks are private unless you choose to share them. Full control, always.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built with modern technologies for instant load times and a seamless experience.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Share individual bookmarks or your entire collection with a unique public link.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Your data is encrypted and backed up. Access your bookmarks from any device.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-24 sm:py-32">
        {/* Background effects */}
        <div className="hero-grid absolute inset-0" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Sparkles className="size-3.5 text-primary" />
            <span className="text-muted-foreground">
              Your bookmarks, beautifully organized
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="gradient-text">Save, organize,</span>
            <br />
            <span className="text-foreground">and share your links</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Markly is a modern bookmark manager that helps you save, organize,
            and discover the best content on the web. Share your curated
            collections with the world.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/signup" id="hero-cta-signup">
                Start for free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/alexdev" id="hero-cta-demo">
                View demo profile
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-border/60 bg-muted/30 px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Powerful features wrapped in a beautiful, intuitive interface.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mb-2 font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glow mx-auto rounded-3xl border border-border/60 bg-card p-10 sm:p-14">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join thousands of users who organize their web with Markly.
            </p>
            <Button size="lg" asChild className="mt-6 gap-2">
              <Link href="/signup" id="cta-bottom-signup">
                Create your account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary">
              <Bookmark className="size-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">Markly</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Markly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
