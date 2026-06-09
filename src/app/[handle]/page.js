import { mockPublicProfiles } from "@/lib/mock-data";
import PublicProfileClient from "./public-profile-client";

export function generateStaticParams() {
  return Object.keys(mockPublicProfiles).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const profile = mockPublicProfiles[handle];

  if (!profile) {
    return {
      title: "Profile Not Found — Markly",
      description: "This profile does not exist.",
    };
  }

  return {
    title: `@${profile.handle} — Markly`,
    description: `Browse the public bookmark collection of @${profile.handle} on Markly.`,
  };
}

export default async function HandlePage({ params }) {
  const { handle } = await params;
  const profile = mockPublicProfiles[handle];

  return <PublicProfileClient handle={handle} profile={profile} />;
}
