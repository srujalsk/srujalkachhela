import type { Profile } from "@/lib/content-schema";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function NotFound() {
  const profile = {
    name: "Srujal Kachhela",
    location: "Bangkok, Thailand",
    email: "srujal.k@gmail.com",
    linkedin: "https://www.linkedin.com/in/srujalkachhela/",
    x: "https://x.com/srujalsk",
  } satisfies Pick<Profile, "name" | "location" | "email" | "linkedin" | "x"> as Profile;

  return (
    <>
      <main id="main-content" className="flex-1 container-site flex flex-col items-start justify-center py-32">
        <p className="font-mono text-accent-500" aria-hidden="true">404</p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-paper-50">Page not found</h1>
        <p className="mt-4 max-w-md text-paper-300">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center rounded-md bg-accent-500 px-6 font-mono text-sm font-semibold text-ink-950 hover:bg-accent-400 transition-colors"
        >
          Back to home
        </Link>
      </main>
      <Footer profile={profile} />
    </>
  );
}
