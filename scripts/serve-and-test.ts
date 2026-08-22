/**
 * Serves the static export (out/) and runs the requested Playwright suite.
 * Usage: tsx scripts/serve-and-test.ts <a11y|responsive|unit>
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { createServer } from "node:http";

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out");
const PORT = Number(process.env.TEST_PORT ?? 4173);
const HOST = "127.0.0.1";
const suite = process.argv[2] ?? "a11y";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".pdf": "application/pdf",
};

function startServer(): Promise<void> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = (req.url ?? "/").split("?")[0];
      let filePath = path.join(OUT, decodeURIComponent(url));
      if (url.endsWith("/")) filePath = path.join(filePath, "index.html");
      else if (!path.extname(filePath)) filePath = path.join(filePath, "index.html");
      fsServe(res, filePath);
    });
    function fsServe(res: import("node:http").ServerResponse, filePath: string) {
      import("node:fs").then((fs) => {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            // GitHub Pages-style 404
            fs.readFile(path.join(OUT, "404.html"), (err2, data404) => {
              if (err2) {
                res.writeHead(404);
                res.end("Not found");
              } else {
                res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
                res.end(data404);
              }
            });
            return;
          }
          const ext = path.extname(filePath).toLowerCase();
          res.writeHead(200, { "Content-Type": MIME[ext] ?? "application/octet-stream" });
          res.end(data);
        });
      });
    }
    server.listen(PORT, HOST, () => resolve());
  });
}

async function main() {
  await startServer();
  console.log(`Serving ${OUT} at http://${HOST}:${PORT}`);

  const specFile =
    suite === "a11y"
      ? "tests/a11y.spec.ts"
      : suite === "responsive"
        ? "tests/responsive.spec.ts"
        : "tests/unit.spec.ts";

  const child = spawn("npx", ["playwright", "test", specFile], {
    stdio: "inherit",
    cwd: ROOT,
    env: { ...process.env, TEST_BASE_URL: `http://${HOST}:${PORT}` },
  });

  child.on("exit", (code) => {
    process.exit(code ?? 1);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
