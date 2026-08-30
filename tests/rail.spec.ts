import { expect, test } from "@playwright/test";

// Regression coverage for the fixed left-rail navigation (lg+ viewport):
//   1. every rail link points at a section that actually exists (no dead anchors)
//   2. page content is offset by the rail width so nothing sits underneath it
//   3. scroll-spy moves aria-current as the user scrolls

const RAIL_WIDTH = 240; // lg:w-60

test.describe("desktop left-rail navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("every rail link targets an existing section id", async ({ page }) => {
    const dead = await page.evaluate(() => {
      const bad: string[] = [];
      for (const a of Array.from(document.querySelectorAll('nav[aria-label="Main"] a[href*="#"], nav[aria-label="Sections"] a[href*="#"]'))) {
        const href = a.getAttribute("href") ?? "";
        const hash = href.slice(href.indexOf("#") + 1);
        if (!hash) continue;
        if (!document.getElementById(hash)) bad.push(href);
      }
      return bad;
    });
    expect(dead, `dead anchors: ${dead.join(", ")}`).toEqual([]);
  });

  test("rail links cover all six sections with correct labels", async ({ page }) => {
    const links = await page.evaluate(() => {
      const out: string[] = [];
      for (const nav of Array.from(document.querySelectorAll('nav[aria-label="Main"]'))) {
        for (const a of Array.from(nav.querySelectorAll("a[href^='#']"))) {
          out.push(`${a.getAttribute("href")} ${a.textContent?.trim()}`);
        }
      }
      return out;
    });
    // #work is the projects grid; label must not duplicate "Experience"
    expect(links.some((l) => l.includes("#work") && l.includes("Projects"))).toBe(true);
    expect(links.some((l) => l.includes("#experience") && l.includes("Experience"))).toBe(true);
    expect(links.length).toBe(6);
  });

  test("page content clears the fixed rail at lg (no overlap)", async ({ page }) => {
    const overlap = await page.evaluate((railWidth) => {
      const bad: string[] = [];
      const selectors = ["#about h1", "#work h2", "#experience h2", "#skills h2", "#education h2", "#contact h2"];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (!el) {
          bad.push(`${sel} missing`);
          continue;
        }
        const r = el.getBoundingClientRect();
        if (r.left < railWidth) bad.push(`${sel} left=${Math.round(r.left)} < ${railWidth}`);
      }
      return bad;
    }, RAIL_WIDTH);

    expect(overlap, overlap.join(" | ")).toEqual([]);
  });

  test("scroll-spy highlights the section in view", async ({ page }) => {
    const currentBefore = await page.evaluate(() =>
      document.querySelector('nav[aria-label="Main"] a[aria-current="true"], nav[aria-label="Sections"] a[aria-current="true"]')?.getAttribute("href"),
    );
    expect(currentBefore).toBe("#about");

    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700); // allow IntersectionObserver to fire

    const currentAfter = await page.evaluate(() =>
      document.querySelector('nav[aria-label="Main"] a[aria-current="true"], nav[aria-label="Sections"] a[aria-current="true"]')?.getAttribute("href"),
    );
    expect(currentAfter).toBe("#experience");
  });
});
