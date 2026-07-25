import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
let workerPromise;

async function getWorker() {
  workerPromise ??= import(workerUrl.href).then((module) => module.default);
  return workerPromise;
}

const workerEnvironment = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const executionContext = {
  waitUntil() {},
  passThroughOnException() {},
};

async function request(description, headers = {}) {
  const worker = await getWorker();
  return worker.fetch(
    new Request("http://localhost/api/extract-opportunity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost",
        ...headers,
      },
      body: JSON.stringify({ description }),
    }),
    workerEnvironment,
    executionContext,
  );
}

async function withGeminiResponse(providerResponse, callback) {
  const originalFetch = globalThis.fetch;
  let capturedRequest = null;

  globalThis.fetch = async (input, init) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;

    if (url.includes("generativelanguage.googleapis.com")) {
      capturedRequest = { url, init };
      return typeof providerResponse === "function"
        ? providerResponse(input, init)
        : providerResponse;
    }

    return originalFetch(input, init);
  };

  try {
    await callback(() => capturedRequest);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function interactionWithOutput(output) {
  return new Response(
    JSON.stringify({
      id: "interaction-test",
      model: "gemini-3.5-flash-lite",
      object: "interaction",
      status: "completed",
      steps: [
        {
          type: "model_output",
          content: [{ type: "text", text: JSON.stringify(output) }],
        },
      ],
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

test("extracts structured opportunity fields without exposing the key", { concurrency: false }, async () => {
  process.env.GEMINI_API_KEY = "test-api-key-not-real";
  const extraction = {
    title: "Weekend Food Drive",
    type: "Volunteer",
    date: "Next Saturday, 10 AM-2 PM",
    commitment: "4 hours",
    location: "Community Center",
    format: "In person",
    ageRange: "14-18",
    supervision: "Adult coordinator",
    skills: "Event support",
    impact: "Supports local families",
  };

  await withGeminiResponse(
    () => interactionWithOutput(extraction),
    async (capture) => {
      const response = await request("We need teen volunteers next Saturday.");
      const body = await response.json();

      assert.equal(response.status, 200);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.deepEqual(body, {
        extraction,
        completeness: 100,
        needsConfirmation: [],
      });
      assert.doesNotMatch(JSON.stringify(body), /test-api-key-not-real/);

      const providerRequest = capture();
      assert.ok(providerRequest);
      assert.match(providerRequest.url, /\/interactions/);
      assert.doesNotMatch(
        String(providerRequest.init?.body ?? ""),
        /test-api-key-not-real/,
      );
    },
  );
});

test("keeps missing facts blank and computes review completeness", { concurrency: false }, async () => {
  process.env.GEMINI_API_KEY = "test-api-key-not-real";
  const extraction = {
    title: "Weekend Food Drive",
    type: "Volunteer",
    date: "",
    commitment: "",
    location: "Rahma Community Center",
    format: "In person",
    ageRange: "",
    supervision: "",
    skills: "Event support",
    impact: "Supports local families",
  };

  await withGeminiResponse(() => interactionWithOutput(extraction), async () => {
    const response = await request("Help with our food drive.");
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.completeness, 60);
    assert.deepEqual(body.needsConfirmation, [
      "date",
      "commitment",
      "ageRange",
      "supervision",
    ]);
  });
});

test("rejects malformed, empty, oversized, and cross-origin requests", { concurrency: false }, async () => {
  const worker = await getWorker();
  const malformed = await worker.fetch(
    new Request("http://localhost/api/extract-opportunity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost",
      },
      body: "{",
    }),
    workerEnvironment,
    executionContext,
  );
  assert.equal(malformed.status, 400);

  assert.equal((await request("")).status, 400);
  assert.equal((await request("x".repeat(5_001))).status, 400);
  assert.equal(
    (
      await request("Valid description", {
        Origin: "https://untrusted.example",
      })
    ).status,
    400,
  );
});

test("returns a sanitized error when the key is missing", { concurrency: false }, async () => {
  delete process.env.GEMINI_API_KEY;

  const response = await request("A valid opportunity description.");
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.deepEqual(body, {
    error: {
      code: "NOT_CONFIGURED",
      message: "Gemini extraction is not configured yet.",
    },
  });
});

test("maps provider quota and malformed-output failures", { concurrency: false }, async () => {
  process.env.GEMINI_API_KEY = "test-api-key-not-real";

  await withGeminiResponse(
    new Response(
      JSON.stringify({
        error: {
          code: 429,
          message: "Provider quota details that must stay private.",
          status: "RESOURCE_EXHAUSTED",
        },
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      },
    ),
    async () => {
      const response = await request("A valid opportunity description.");
      const body = await response.json();
      assert.equal(response.status, 429);
      assert.equal(body.error.code, "RATE_LIMITED");
      assert.doesNotMatch(JSON.stringify(body), /Provider quota details/);
    },
  );

  await withGeminiResponse(
    () => interactionWithOutput({ unexpected: "shape" }),
    async () => {
      const response = await request("A valid opportunity description.");
      const body = await response.json();
      assert.equal(response.status, 502);
      assert.equal(body.error.code, "UPSTREAM_ERROR");
      assert.doesNotMatch(JSON.stringify(body), /unexpected/);
    },
  );
});
