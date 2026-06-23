import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const scratch = process.env.SCRATCH_DIR;
const base = "http://localhost:3000";
const routes = ["/", "/projects", "/about", "/contact", "/blog"];

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage();

page.on("pageerror", (err) => errors.push(err.message));

for (const route of routes) {
  const res = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  if (!res || !res.ok()) throw new Error(`Failed to load ${route}: ${res?.status()}`);
  const box = await page.locator("main").boundingBox();
  if (!box || box.width === 0 || box.height === 0) {
    throw new Error(`main has no painted content on ${route}`);
  }
}

await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(scratch, "homepage.png"), fullPage: true });

await page.goto(`${base}/projects`, { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(scratch, "other-pages.png"), fullPage: true });

await page.click('a[href="/about"]');
await page.waitForURL("**/about");
if (!page.url().includes("/about")) throw new Error("Navigation to /about failed");

if (errors.length) throw new Error(`Page errors: ${errors.join("; ")}`);

await browser.close();
fs.writeFileSync(path.join(scratch, "playwright-console.log"), "no page errors\n");
console.log("playwright-verify: passed");