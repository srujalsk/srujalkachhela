import AboutSidebar from "@/components/AboutSidebar";
import Contact from "@/components/Contact";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import FeaturedWork from "@/components/FeaturedWork";
import Footer from "@/components/Footer";
import Hero, { ImpactMetrics } from "@/components/Hero";
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
      <SiteNav />
      <main
        id="main-content"
        className="flex-1 lg:pl-64 [scroll-padding-top:6rem]"
      >
        <Hero profile={profile} />
        <ImpactMetrics metrics={profile.metrics} />

        {/* Two-column layout: static info rail on the left (lg+),
            scrolling content column on the right. Stacks on mobile. */}
        <div className="container-site grid grid-cols-1 gap-x-12 py-20 sm:py-28 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <AboutSidebar profile={profile} />

          <div className="min-w-0 scroll-mt-24 space-y-24 pt-16 lg:pt-0">
            <FeaturedWork projects={projects} />
            <ExperienceTimeline entries={experience} />
            <SkillsSection skills={skills} />
            <EducationSection education={education} />
          </div>
        </div>

        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
