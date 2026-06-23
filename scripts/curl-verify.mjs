import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const scratch = process.env.SCRATCH_DIR;
const base = "http://localhost:3000";

const routes = [
  { path: "/", mustInclude: "View projects" },
  { path: "/projects", mustInclude: "Things I" },
  { path: "/about", mustInclude: "Pedro Santos" },
  { path: "/contact", mustInclude: "Let" },
  { path: "/blog", mustInclude: "Writing" },
  { path: "/blog/rebuilding-my-site", mustInclude: "Rebuilding my personal site" },
  { path: "/projects/melro-io", mustInclude: "Melro.io" },
];

const log = [];

for (const { path: route, mustInclude } of routes) {
  const res = await fetch(`${base}${route}`);
  const html = await res.text();
  assert.equal(res.status, 200, `${route} must return 200`);
  assert.ok(html.includes(mustInclude), `${route} must include "${mustInclude}"`);
  assert.ok(html.includes("main"), `${route} must render main element`);
  log.push(`${route}: OK (${html.length} bytes)`);
}

fs.writeFileSync(path.join(scratch, "curl-verify.log"), log.join("\n") + "\n");
console.log("curl-verify: all routes passed");