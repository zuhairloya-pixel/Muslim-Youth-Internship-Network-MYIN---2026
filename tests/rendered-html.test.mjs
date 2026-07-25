import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished MYIN experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>MYIN/);
  assert.match(html, /Your skills can move/);
  assert.match(html, /See Amina/);
  assert.match(html, /Opportunity, with purpose/);
  assert.doesNotMatch(html, /codex-preview/i);
  assert.doesNotMatch(html, /react-loading-skeleton/i);
});

test("contains finished metadata and removes starter preview code", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Youth Digital Media Assistant/);
  assert.match(page, /StudentView/);
  assert.match(page, /OrganizationView/);
  assert.match(page, /ImpactView/);
  assert.match(page, /\/api\/extract/);
  assert.match(page, /calculateMatch/);
  assert.match(page, /Reset demo/);
  assert.match(layout, /Muslim Youth Internship Network/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});

test("keeps Gemini configuration out of browser assets", async () => {
  const clientRoot = new URL("../dist/client/", import.meta.url);
  const assetPaths = await readdir(clientRoot, { recursive: true });
  const javascriptPaths = assetPaths.filter((path) => path.endsWith(".js"));
  const assets = await Promise.all(
    javascriptPaths.map((path) => readFile(new URL(path, clientRoot), "utf8")),
  );
  const clientJavaScript = assets.join("\n");

  assert.doesNotMatch(clientJavaScript, /GEMINI_API_KEY/);
  assert.doesNotMatch(clientJavaScript, /test-api-key-not-real/);
});
