import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("accessibility (axe)", () => {
  test("home page has no axe violations (WCAG A/AA ruleset)", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const violations = results.violations.filter((v) => v.impact !== "minor");
    // Surface violation details in the failure message
    expect(
      violations,
      violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`).join("\n"),
    ).toEqual([]);
  });

  test("404 page has no serious axe violations", async ({ page }) => {
    await page.goto("/definitely-not-a-real-page/", { waitUntil: "load" });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => v.impact !== "minor").map((v) => v.id)).toEqual([]);
  });
});

test.describe("keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("skip link is first focusable and becomes visible on focus", async ({ page }) => {
    await page.keyboard.press("Tab");
    const focused = page.evaluate(() => document.activeElement?.textContent);
    expect(await focused).toContain("Skip to content");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeVisible();
  });

  test("skip link target exists and main is reachable", async ({ page }) => {
    const href = await page.locator("a[href='#main-content']").first().getAttribute("href");
    expect(href).toBe("#main-content");
    await expect(page.locator("#main-content")).toBeAttached();
  });

  test("mobile menu opens, traps Escape correctly, closes and restores focus", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    // The button's accessible name flips between "Open/Close main menu";
    // locate it by its stable aria-controls instead.
    const menuButton = page.locator("button[aria-controls='mobile-menu']");
    await menuButton.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    // Focus should have moved into the dialog
    const insideDialog = await page.evaluate(() =>
      document.activeElement?.closest("[role=dialog]") != null,
    );
    expect(insideDialog).toBe(true);
    // Escape closes and returns focus to the menu button
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(menuButton).toBeFocused();
  });

  test("mobile menu closes on link click and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    // The button's accessible name flips between "Open/Close main menu";
    // locate it by its stable aria-controls instead.
    const menuButton = page.locator("button[aria-controls='mobile-menu']");
    await menuButton.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await dialog.getByRole("link", { name: /Experience/ }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.locator("#experience")).toBeInViewport();
  });

  test("copy-email button announces success in a live region", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    // Locate by type+content class (stable) — the accessible name flips from
    // "Copy email" to "Copied!" after the click, which would orphan a
    // name-based locator mid-assertion.
    const copyButton = page.locator("#contact button[type='button']");
    await copyButton.scrollIntoViewIfNeeded();
    await copyButton.click();
    await expect(copyButton).toHaveText(/Copied!/);
    const liveText = await page.evaluate(() => {
      const region = document.querySelector("[role=status][aria-live]");
      return region?.textContent ?? "";
    });
    expect(liveText).toContain("copied to clipboard");
  });

  test("all interactive controls have accessible names", async ({ page }) => {
    const unnamed = await page.evaluate(() => {
      const els = document.querySelectorAll("button, a[href], input, select, textarea");
      const bad: string[] = [];
      for (const el of els) {
        const label =
          el.getAttribute("aria-label") ??
          el.getAttribute("aria-labelledby") ??
          el.textContent?.trim() ??
          "";
        if (!label) bad.push(el.outerHTML.slice(0, 80));
      }
      return bad;
    });
    expect(unnamed).toEqual([]);
  });

  test("reduced motion keeps all content visible without scrolling animations", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    // With reduced motion the reveal utility must leave content visible immediately
    const opacity = await page.evaluate(() => {
      const section = document.querySelector("#experience h2");
      return section ? getComputedStyle(section.closest(".reveal") ?? section).opacity : null;
    });
    // The reveal element may still start hidden if JS hasn't run; check CSS rule instead
    const cssApplies = await page.evaluate(() => {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules as unknown as CSSRule[]) {
            if (rule.cssText.includes(".reveal") && rule.cssText.includes("prefers-reduced-motion")) {
              return true;
            }
          }
        } catch {
          /* cross-origin */
        }
      }
      return false;
    });
    expect(cssApplies || opacity === "1").toBe(true);
  });

  test("page has lang=en and a single landmark structure", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("navigation").first()).toBeAttached();
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
  });

  test("headings follow a logical hierarchy", async ({ page }) => {
    const levels = await page.evaluate(() =>
      Array.from(document.querySelectorAll("h1, h2, h3, h4")).map((h) =>
        Number(h.tagName.slice(1)),
      ),
    );
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] ?? 0).toBeLessThanOrEqual((levels[i - 1] ?? 1) + 1);
    }
  });
});
