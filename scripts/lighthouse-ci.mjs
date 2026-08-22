/**
 * Runs Lighthouse against the static export (out/) via a local server,
 * in mobile and desktop modes, multiple runs, saving JSON + HTML reports
 * to lighthouse-report/ and a summary to lighthouse-report/summary.json.
 *
 * Usage: tsx scripts/lighthouse-ci.mjs [url-paths...]
 * Defaults to "/".
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out");
const REPORT_DIR = path.join(ROOT, "lighthouse-report");
const PORT = 4180;
const HOST = "127.0.0.1";
const RUNS = Number(process.env.LH_RUNS ?? 3);

const paths = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ["/"];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
};

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const url = (req.url ?? "/").split("?")[0];
      let p = path.join(OUT, decodeURIComponent(url));
      if (url.endsWith("/") || !path.extname(p)) p = path.join(p, "index.html");
      try {
        const data = await fs.readFile(p);
        res.writeHead(200, { "Content-Type": MIME[path.extname(p)] ?? "application/octet-stream" });
        res.end(data);
      } catch {
        try {
          const data404 = await fs.readFile(path.join(OUT, "404.html"));
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(data404);
        } catch {
          res.writeHead(404);
          res.end("Not found");
        }
      }
    });
    server.listen(PORT, HOST, () => resolve(server));
  });
}

async function runLighthouse(url, formFactor, index) {
  const outPath = path.join(REPORT_DIR, `report-${formFactor}-${index}.json`);
  const htmlPath = path.join(REPORT_DIR, `report-${formFactor}-${index}.html`);
  const flags = [
    "lighthouse",
    url,
    `--output=json`,
    `--output=html`,
    `--output-path=${path.join(REPORT_DIR, `tmp-${formFactor}-${index}`)}`,
    `--port=0`,
    "--quiet",
    "--only-categories=performance,accessibility,best-practices,seo",
    formFactor === "desktop" ? "--preset=desktop" : "--preset=perf", // mobile default
  ];
  // Run via npx so we don't need a global install
  await new Promise((resolve, reject) => {
    const child = spawn("npx", flags, { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`lighthouse exited ${code}`))));
    child.on("error", reject);
  });
  // Lighthouse appends .report.json / .report.html to output-path
  await fs.rename(`${path.join(REPORT_DIR, `tmp-${formFactor}-${index}`)}.report.json`, outPath).catch(() => {});
  await fs.rename(`${path.join(REPORT_DIR, `tmp-${formFactor}-${index}`)}.report.html`, htmlPath).catch(() => {});
  const json = JSON.parse(await fs.readFile(outPath, "utf8"));
  const cats = json.categories;
  const audits = json.audits;
  return {
    url,
    formFactor,
    run: index,
    scores: {
      performance: cats.performance.score,
      accessibility: cats.accessibility.score,
      bestPractices: cats["best-practices"].score,
      seo: cats.seo.score,
    },
    metrics: {
      fcp: audits["first-contentful-paint"]?.displayValue,
      lcp: audits["largest-contentful-paint"]?.displayValue,
      tbt: audits["total-blocking-time"]?.displayValue,
      cls: audits["cumulative-layout-shift"]?.displayValue,
      si: audits["speed-index"]?.displayValue,
      pageWeightBytes: json.audits["total-byte-weight"]?.numericValue,
      requests: audits["network-requests"]?.numericValue,
    },
    reportJson: path.relative(ROOT, outPath),
    reportHtml: path.relative(ROOT, htmlPath),
  };
}

const server = await serve();
await fs.mkdir(REPORT_DIR, { recursive: true });
try {
  const all = [];
  for (const p of paths) {
    for (const formFactor of ["mobile", "desktop"]) {
      for (let i = 1; i <= RUNS; i++) {
        console.log(`Lighthouse ${formFactor} run ${i}/${RUNS} for ${p} ...`);
        const result = await runLighthouse(`http://${HOST}:${PORT}${p}`, formFactor, i);
        console.log(
          `  P=${result.scores.performance} A=${result.scores.accessibility} BP=${result.scores.bestPractices} SEO=${result.scores.seo}`,
        );
        all.push(result);
      }
    }
  }
  await fs.writeFile(path.join(REPORT_DIR, "summary.json"), JSON.stringify(all, null, 2));
  console.log(`\nSaved ${all.length} reports to lighthouse-report/ (summary.json written)`);
} finally {
  server.close();
}
