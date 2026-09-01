import { expect, test } from "@playwright/test";

/**
 * Scroll-spy scenarios for the left rail. The active item must track the
 * viewport position in every direction — wheel scrolling, keyboard jumps,
 * anchor navigation, clicks, and edge cases at the top and bottom of the
 * page. The spy is a pure position check (35% viewport line) with a
 * bottom-of-page fallback, so all of these must hold.
 */

async function activeHref(page: import("@playwright/test").Page): Promise<string | null> {
  return page.evaluate(() => document.querySelector('nav[aria-label="Main"] a[aria-current="true"]')?.getAttribute("href") ?? null);
}

async function scrollTo(page: import("@playwright/test").Page, y: number): Promise<void> {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  // rAF-throttled spy + smooth-scroll override: wait two frames minimum
  await page.waitForTimeout(250);
}

test.describe("rail scroll-spy", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("About is active at page top", async ({ page }) => {
    await scrollTo(page, 0);
    expect(await activeHref(page)).toBe("#about");
  });

  test("Experience becomes active when its heading crosses the band", async ({ page }) => {
    // Scroll so the experience h2 sits above the 35% line
    await page.evaluate(() => {
      const el = document.getElementById("experience")!;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3);
    });
    await page.waitForTimeout(250);
    expect(await activeHref(page)).toBe("#experience");
  });

  test("Contact activates at exact max scroll (bottom-anchored fallback)", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(250);
    expect(await activeHref(page)).toBe("#contact");
  });

  test("Contact stays active when overscrolling/bouncing at the bottom", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(250);
    // simulate elastic overscroll attempts
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight + 500));
    await page.waitForTimeout(250);
    expect(await activeHref(page)).toBe("#contact");
  });

  test("Experience re-activates when scrolling back UP from Contact (regression)", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(250);
    expect(await activeHref(page)).toBe("#contact");

    // scroll up ~400px: experience section now spans the band
    await page.evaluate(() => window.scrollBy(0, -400));
    await page.waitForTimeout(250);
    expect(await activeHref(page)).toBe("#experience");
  });

  test("About re-activates when scrolling back to the top from below", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(250);
    await scrollTo(page, 0);
    expect(await activeHref(page)).toBe("#about");
  });

  test("wheel-scrolling through the page steps About -> Experience -> Contact", async ({ page }) => {
    const steps = 24;
    const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    const seen: Array<string | null> = [];
    let prev: string | null = null;
    for (let i = 0; i <= steps; i++) {
      await scrollTo(page, Math.round((max * i) / steps));
      const cur = await activeHref(page);
      if (cur !== prev) {
        seen.push(cur);
        prev = cur;
      }
    }
    // Must visit all three sections, in order, no flicker back
    expect(seen).toEqual(["#about", "#experience", "#contact"]);
  });

  test("clicking a rail link highlights it immediately (before scroll settles)", async ({ page }) => {
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.click('nav[aria-label="Main"] a[href="#contact"]');
    // don't wait for smooth scroll to settle
    expect(await activeHref(page)).toBe("#contact");
  });

  test("anchor deep-link (#contact) activates Contact", async ({ page }) => {
    await page.goto("/#contact", { waitUntil: "networkidle" });
    await page.waitForTimeout(900); // allow hash-settle recompute (600ms)
    expect(await activeHref(page)).toBe("#contact");
  });

  test("anchor deep-link (#experience) activates Experience", async ({ page }) => {
    await page.goto("/#experience", { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    expect(await activeHref(page)).toBe("#experience");
  });

  test("keyboard End key jumps to bottom and highlights Contact", async ({ page }) => {
    await page.keyboard.press("End");
    await page.waitForTimeout(600);
    expect(await activeHref(page)).toBe("#contact");
  });

  test("keyboard Home key jumps to top and highlights About", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
    await page.keyboard.press("Home");
    await page.waitForTimeout(600);
    expect(await activeHref(page)).toBe("#about");
  });

  test("narrow viewport: no errors and page still scrolls cleanly", async ({ page }) => {
    // The rail is display:none below lg; the spy still runs (harmless) but is
    // not user-visible — assert no layout breakage instead of hidden DOM state.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("rapid double-click (Contact then Experience) pins the second click", async ({ page }) => {
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const contactLink = page.locator('nav[aria-label="Main"] a[href="#contact"]');
    const expLink = page.locator('nav[aria-label="Main"] a[href="#experience"]');
    await contactLink.click();
    await expLink.click(); // immediately after
    await page.waitForTimeout(300);
    // Experience (the last-clicked) must still be highlighted
    expect(await activeHref(page)).toBe("#experience");
    // and after the pin fully expires, still experience (scroll has settled there)
    await page.waitForTimeout(2000);
    expect(await activeHref(page)).toBe("#experience");
  });

  test("exactly one item is ever highlighted", async ({ page }) => {
    const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    for (let i = 0; i <= 10; i++) {
      await scrollTo(page, Math.round((max * i) / 10));
      const count = await page.evaluate(() => document.querySelectorAll('nav[aria-label="Main"] a[aria-current="true"]').length);
      expect(count).toBe(1);
    }
  });
});
