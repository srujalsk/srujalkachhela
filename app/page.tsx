import Contact from "@/components/Contact";
import ExperienceTabs from "@/components/ExperienceTabs";
import FeaturedWork from "@/components/FeaturedWork";
import Footer from "@/components/Footer";
import Hero, { ImpactMetrics } from "@/components/Hero";
import Reveal from "@/components/Reveal";
import SiteNav from "@/components/SiteNav";
import SideRail from "@/components/SideRail";
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
      <div className="lg:flex">
        {/* Fixed left rail (desktop): nav tracks scroll; content column scrolls */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:px-10">
          <SideRail />
        </aside>

        <div className="min-w-0 flex-1">
          <SiteNav />

          <main id="main-content" className="mx-auto w-full max-w-3xl px-6 sm:px-10">
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

          <Footer profile={profile} />
        </div>
      </div>
    </>
  );
}
