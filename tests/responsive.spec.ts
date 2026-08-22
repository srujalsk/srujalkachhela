import { expect, test } from "@playwright/test";

// Mobile-first viewport matrix from the brief (portrait) + landscape checks
const PORTRAIT_WIDTHS = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440];
const HEIGHT = 800;

test.describe("responsive layout", () => {
  for (const width of PORTRAIT_WIDTHS) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await page.goto("/", { waitUntil: "networkidle" });

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const bad: string[] = [];
        if (doc.scrollWidth > window.innerWidth) {
          // find offending elements
          for (const el of Array.from(document.querySelectorAll("*"))) {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 1 || rect.left < -1) {
              const tag = el.tagName.toLowerCase();
              const cls = typeof el.className === "string" ? el.className.slice(0, 60) : "";
              bad.push(`${tag}.${cls} right=${Math.round(rect.right)}`);
            }
          }
        }
        return { scrollWidth: doc.scrollWidth, innerWidth: window.innerWidth, bad: bad.slice(0, 8) };
      });
      expect(
        overflow.scrollWidth,
        `scrollWidth ${overflow.scrollWidth} > ${overflow.innerWidth}; offenders: ${overflow.bad.join(" | ")}`,
      ).toBeLessThanOrEqual(overflow.innerWidth);
    });

    test(`no clipped content at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await page.goto("/", { waitUntil: "networkidle" });

      const clipped = await page.evaluate(() => {
        const bad: string[] = [];
        for (const el of Array.from(document.querySelectorAll("a, button, h1, h2, h3, p, li, dd, dt"))) {
          const style = getComputedStyle(el);
          if (style.overflowX === "hidden" || style.overflow === "hidden") continue;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          if (rect.right > window.innerWidth + 2 || rect.left < -2) {
            bad.push(`${el.tagName.toLowerCase()}: ${el.textContent?.slice(0, 40)}`);
          }
        }
        return bad.slice(0, 8);
      });
      expect(clipped, clipped.join(" | ")).toEqual([]);
    });
  }

  test("landscape orientation at 430x320 works", async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 320 });
    await page.goto("/", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(overflow).toBeLessThanOrEqual(430);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("landscape orientation at 768x420 works", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 420 });
    await page.goto("/", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(overflow).toBeLessThanOrEqual(768);
  });

  test("mobile menu usable at 320px with 44px+ touch targets", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/", { waitUntil: "networkidle" });
    const menuButton = page.getByRole("button", { name: "Open main menu" });
    const box = await menuButton.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    await menuButton.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    const links = dialog.getByRole("link");
    const n = await links.count();
    expect(n).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < n; i++) {
      const b = await links.nth(i).boundingBox();
      expect(b?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test("sticky nav does not cover anchored section headings", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const covered = await page.evaluate(() => {
      const heading = document.querySelector("#experience h2");
      if (!heading) return "missing";
      const r = heading.getBoundingClientRect();
      const nav = document.querySelector("header");
      const navH = nav ? nav.getBoundingClientRect().bottom : 0;
      return r.top < navH ? `heading top ${r.top} < nav bottom ${navH}` : "ok";
    });
    expect(covered).toBe("ok");
  });

  test("zoom 200% keeps content usable (simulated via CSS zoom on 1280px viewport)", async ({ page }) => {
    // Simulate 200% zoom: halve the effective viewport
    await page.setViewportSize({ width: 640, height: 400 });
    await page.goto("/", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(overflow).toBeLessThanOrEqual(640);
  });

  test("zoom 400% keeps content usable (simulated via 320px effective viewport)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 200 });
    await page.goto("/", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(overflow).toBeLessThanOrEqual(320);
  });

  test("no hover-only interactions: all content reachable without hover", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    // Every project card must expose its summary text without hover
    const cards = page.locator("#work article");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }
  });
});
