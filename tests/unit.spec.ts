import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.resolve(__dirname, "..");

test.describe("content integrity", () => {
  test("profile.md parses with required fields", () => {
    const raw = readFileSync(path.join(ROOT, "content/profile.md"), "utf8");
    const { data } = matter(raw);
    expect(data.name).toBe("Srujal Kachhela");
    expect(String(data.email)).toMatch(/@/);
    expect(Array.isArray(data.metrics)).toBe(true);
    expect((data.metrics as unknown[]).length).toBe(4);
  });

  test("all experience files have company/role/dates", () => {
    const dir = path.join(ROOT, "content/experience");
    const files = readFileSync;
    const entries = require("node:fs").readdirSync(dir).filter((f: string) => f.endsWith(".md"));
    expect(entries.length).toBeGreaterThanOrEqual(4);
    for (const file of entries) {
      const { data } = matter(readFileSync(path.join(dir, file), "utf8"));
      expect(data.company, `${file}: company`).toBeTruthy();
      expect(data.role, `${file}: role`).toBeTruthy();
      expect(String(data.start), `${file}: start`).toMatch(/^\d{4}-\d{2}$/);
      expect(String(data.end), `${file}: end`).toMatch(/^\d{4}-\d{2}$|^present$/i);
      expect(typeof data.order, `${file}: order`).toBe("number");
    }
  });

  test("project links are either valid URLs or empty strings", () => {
    const dir = path.join(ROOT, "content/projects");
    const entries = require("node:fs").readdirSync(dir).filter((f: string) => f.endsWith(".md"));
    for (const file of entries) {
      const { data } = matter(readFileSync(path.join(dir, file), "utf8"));
      const links = data.links ?? {};
      for (const key of ["source", "demo"] as const) {
        const value = links[key];
        if (value) expect(String(value), `${file}: ${key}`).toMatch(/^https?:\/\//);
      }
    }
  });

  test("no phone number is exposed by default", () => {
    const raw = readFileSync(path.join(ROOT, "content/profile.md"), "utf8");
    const { data } = matter(raw);
    expect(Boolean(data.showPhone)).toBe(false);
  });
});

test.describe("home page rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("has exactly one H1", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("Srujal Kachhela");
  });

  test("renders all major sections", async ({ page }) => {
    for (const id of ["about", "experience", "contact"]) {
      await expect(page.locator(`#${id}`), `section #${id}`).toBeAttached();
    }
  });

  test("renders experience as company tabs", async ({ page }) => {
    // Experience is a flat inline tab row: one tab per company
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    await expect(page.locator("#experience")).toContainText("Agoda");
    await expect(page.locator("#experience")).toContainText("vConstruct");
    await expect(page.locator("#experience")).toContainText("Persistent Systems");
    await expect(page.locator("#experience")).toContainText("Atos India");

    // Selecting a tab shows that role's details
    await tabs.nth(1).click();
    const panel = page.getByRole("tabpanel");
    await expect(panel).toContainText("@ vConstruct");
  });

  test("no CV download button when cvPath is empty", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Download CV" })).toHaveCount(0);
  });

  test("email is present and copy button exists", async ({ page }) => {
    await expect(page.getByRole("link", { name: /srujal\.k@gmail\.com/ }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Copy email/ })).toBeVisible();
  });
});
