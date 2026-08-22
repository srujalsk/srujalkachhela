import { z } from "zod";

/** Shared link map — empty string means "not available; hide the button". */
const linksSchema = z
  .object({
    source: z.string().default(""),
    demo: z.string().default(""),
  })
  .default({ source: "", demo: "" });

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(["open-source", "case-study"]),
  featured: z.boolean().default(false),
  year: z.number().int().optional(),
  summary: z.string().min(1),
  stack: z.array(z.string()).default([]),
  links: linksSchema,
  confidential: z.boolean().default(false),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export interface Project extends ProjectFrontmatter {
  body: string;
}

export const experienceFrontmatterSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional(),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}$|^present$/i),
  order: z.number().int(),
  stack: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
});

export type ExperienceFrontmatter = z.infer<typeof experienceFrontmatterSchema>;

export interface Experience extends ExperienceFrontmatter {
  body: string;
}

export const profileSchema = z.object({
  name: z.string().min(1),
  safeTitle: z.string().min(1),
  tagline: z.string().min(1),
  location: z.string().min(1),
  email: z.string().email(),
  linkedin: z.string().url(),
  x: z.string().url(),
  cvPath: z.string().default(""),
  showPhone: z.boolean().default(false),
  phone: z.string().default(""),
  metrics: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .min(1),
});

export type Profile = z.infer<typeof profileSchema>;

export const skillsSchema = z.object({
  groups: z
    .array(
      z.object({
        name: z.string().min(1),
        items: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
});

export type Skills = z.infer<typeof skillsSchema>;

export const educationSchema = z.object({
  entries: z
    .array(
      z.object({
        title: z.string().min(1),
        detail: z.string().default(""),
        year: z.string().optional(),
      }),
    )
    .min(1),
});

export type Education = z.infer<typeof educationSchema>;
