import Contact from "@/components/Contact";
import ExperienceTabs from "@/components/ExperienceTabs";
import FeaturedWork from "@/components/FeaturedWork";
import Footer from "@/components/Footer";
import Hero, { ImpactMetrics } from "@/components/Hero";
import MobileNav from "@/components/MobileNav";
import Reveal from "@/components/Reveal";
import SiteNav from "@/components/SiteNav";
import { SkillsSection, EducationSection } from "@/components/SkillsEducation";
import {
  getEducation,
  getExperience,
  getProfile,
  getProjects,
  getSkills,
} from "@/lib/content";
import { absoluteUrl, getSiteConfig } from "@/lib/site";

export default function HomePage() {
  const profile = getProfile();
  const projects = getProjects();
  const experience = getExperience();
  const skills = getSkills();
  const education = getEducation();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.safeTitle,
      email: `mailto:${profile.email}`,
      url: absoluteUrl("/"),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bangkok",
        addressCountry: "TH",
      },
      sameAs: [profile.linkedin, profile.x],
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "University of Pune" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: profile.name,
      url: absoluteUrl("/"),
      description: getSiteConfig().description,
      inLanguage: "en",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MobileNav />
      <div className="lg:flex">
        {/* Fixed left rail (desktop): logo + section nav + socials; the
            content column to the right does the scrolling. */}
        <SiteNav />

        <main
          id="main-content"
          className="min-w-0 flex-1 mx-auto w-full max-w-3xl px-6 sm:px-10 lg:mx-0 lg:ml-60 lg:max-w-none lg:pl-14 lg:pr-10 xl:pr-20"
        >
          <Hero profile={profile} />
          <ImpactMetrics metrics={profile.metrics} />

          <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-24 py-20">
            <Reveal>
              <h2 id="experience-heading" className="flex items-baseline gap-4 font-mono text-xl sm:text-2xl font-bold text-paper-50">
                <span aria-hidden="true" className="text-accent-500 text-base">02.</span>
                Where I&apos;ve worked
              </h2>
            </Reveal>
            <ExperienceTabs entries={experience} />
          </section>

          <FeaturedWork projects={projects} />
          <SkillsSection skills={skills} />
          <EducationSection education={education} />
          <Contact profile={profile} />
        </main>
      </div>
      <Footer profile={profile} />
    </>
  );
}
