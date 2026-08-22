import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  educationSchema,
  experienceFrontmatterSchema,
  profileSchema,
  projectFrontmatterSchema,
  skillsSchema,
  type Education,
  type Experience,
  type Profile,
  type Project,
  type Skills,
} from "./content-schema";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function formatZodError(file: string, error: unknown): never {
  const issues =
    error && typeof error === "object" && "issues" in error
      ? (error as { issues: { path: (string | number)[]; message: string }[] }).issues
          .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("\n")
      : String(error);
  throw new Error(`Invalid front matter in ${file}:\n${issues}`);
}

function readMarkdown(relativePath: string): { data: unknown; body: string } {
  const fullPath = path.join(CONTENT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Content file not found: ${fullPath}`);
  }
  const raw = fs.readFileSync(fullPath, "utf8");
  const parsed = matter(raw);
  // Strip raw HTML tags from Markdown bodies at load time so nothing unsanitized reaches render.
  const body = parsed.content.replace(/<[^>]*>/g, "");
  return { data: parsed.data, body };
}

export function getProfile(): Profile {
  const { data } = readMarkdown("profile.md");
  const result = profileSchema.safeParse(data);
  if (!result.success) formatZodError("profile.md", result.error);
  return result.data;
}

export function getSkills(): Skills {
  const { data } = readMarkdown("skills.md");
  const result = skillsSchema.safeParse(data);
  if (!result.success) formatZodError("skills.md", result.error);
  return result.data;
}

export function getEducation(): Education {
  const { data } = readMarkdown("education.md");
  const result = educationSchema.safeParse(data);
  if (!result.success) formatZodError("education.md", result.error);
  return result.data;
}

export function getExperience(): Experience[] {
  const dir = path.join(CONTENT_ROOT, "experience");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const entries = files.map((file) => {
    const { data, body } = readMarkdown(path.join("experience", file));
    const result = experienceFrontmatterSchema.safeParse(data);
    if (!result.success) formatZodError(`experience/${file}`, result.error);
    return { ...result.data, body };
  });
  return entries.sort((a, b) => a.order - b.order);
}

export function getProjects(options?: { featuredOnly?: boolean }): Project[] {
  const dir = path.join(CONTENT_ROOT, "projects");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const entries = files.map((file) => {
    const { data, body } = readMarkdown(path.join("projects", file));
    const result = projectFrontmatterSchema.safeParse(data);
    if (!result.success) formatZodError(`projects/${file}`, result.error);
    return { ...result.data, body };
  });
  const filtered = options?.featuredOnly
    ? entries.filter((p) => p.featured)
    : entries;
  return filtered.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

/** Validate every content file; returns list of validated files or throws. */
export function validateAllContent(): string[] {
  const validated: string[] = [];
  getProfile();
  validated.push("profile.md");
  getSkills();
  validated.push("skills.md");
  getEducation();
  validated.push("education.md");
  for (const e of getExperience()) validated.push(`experience (${e.company})`);
  for (const p of getProjects()) validated.push(`projects (${p.title})`);
  return validated;
}
