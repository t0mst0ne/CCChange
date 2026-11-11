import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { checkCodexRelease, summarizeReleases } from "./check-codex-release.mjs";

const now = new Date("2026-11-11T04:00:00Z");
function metadata() {
  return {
    "dist-tags": { latest: "0.167.1", alpha: "0.169.0-alpha.9" },
    time: {
      created: "2025-01-01T00:00:00Z",
      modified: "2026-11-11T03:59:00Z",
      "0.167.0": "2026-11-06T01:46:00Z",
      "0.167.1": "2026-11-10T21:39:00Z",
      "0.167.1-darwin-arm64": "2026-11-11T03:50:00Z",
      "0.169.0-alpha.9": "2026-11-11T03:00:00Z",
    },
  };
}

test("stable tag and publication time determine freshness; alpha and platforms stay separate", () => {
  const report = summarizeReleases(metadata(), now);
  assert.equal(report.latest.version, "0.167.1");
  assert.equal(report.latest.releasedWithin24h, true);
  assert.equal(report.alpha.version, "0.169.0-alpha.9");
  assert.deepEqual(report.stablePublishedWithin24h.map((r) => r.version), ["0.167.1"]);
  assert.deepEqual(report.recentStable.map((r) => r.version), ["0.167.1", "0.167.0"]);
});

test("a fresh alpha or metadata edit does not make an old stable release new", () => {
  const data = metadata();
  data.time["0.167.1"] = "2026-11-08T00:00:00Z";
  const report = summarizeReleases(data, now);
  assert.equal(report.latest.releasedWithin24h, false);
  assert.equal(report.alpha.releasedWithin24h, true);
  assert.deepEqual(report.stablePublishedWithin24h, []);
});

test("24-hour boundary is inclusive; future packages are excluded", () => {
  const data = metadata();
  data.time["0.167.1"] = "2026-11-10T04:00:00Z";
  data.time["0.168.0"] = "2026-11-12T00:00:00Z";
  assert.equal(summarizeReleases(data, now).latest.releasedWithin24h, true);
  assert.equal(summarizeReleases(data, new Date(now.getTime() + 1)).latest.releasedWithin24h, false);
  assert.equal(summarizeReleases(data, now).recentStable.some((r) => r.version === "0.168.0"), false);
});

test("missing tags or invalid publication times fail instead of claiming no release", () => {
  for (const timestamp of [undefined, "invalid", "2026-11-12T00:00:00Z"]) {
    const data = metadata();
    data.time["0.167.1"] = timestamp;
    assert.throws(() => summarizeReleases(data, now), /freshness is unknown/);
  }
  assert.throws(() => summarizeReleases({ time: {} }, now), /freshness is unknown/);
});

test("a package without an alpha channel is supported", () => {
  const data = metadata();
  delete data["dist-tags"].alpha;
  assert.equal(summarizeReleases(data, now).alpha, null);
});

test("HTTP and network failures propagate instead of reporting no update", async () => {
  await assert.rejects(checkCodexRelease({ fetchImpl: async () => ({ ok: false, status: 503 }) }), /503.*unknown/);
  await assert.rejects(checkCodexRelease({ fetchImpl: async () => { throw new Error("offline"); } }), /offline/);
  const report = await checkCodexRelease({ fetchImpl: async () => ({ ok: true, json: async () => metadata() }), now });
  assert.equal(report.checkedAt, now.toISOString());
});

const checker = resolve("scripts/check-content.mjs");
function lintPost({ product, host, inCodex = false, title = "0.167.1：測試" }) {
  const root = mkdtempSync(join(tmpdir(), "ccchange-content-"));
  try {
    const directory = join(root, "src/content/posts", inCodex ? "codex" : "");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "2026-01-01-example.md"), `---
title: "${title}"
description: "測試文章"
published: 2026-01-01
${product ? `product: ${product}\n` : ""}---
## 改了什麼
| 項目 | 說明 |
| --- | --- |
| 版本 | 已更新 |
## 為什麼要改
[官方文件](https://${host}/docs/example)
## 對你的流程有什麼影響
1. 確認版本。
`);
    const result = spawnSync(process.execPath, [checker], { cwd: root, encoding: "utf8" });
    return { status: result.status, output: result.stdout + result.stderr };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("legacy Claude posts and explicit Codex posts pass their own source rules", () => {
  assert.equal(lintPost({ host: "code.claude.com" }).status, 0);
  assert.equal(lintPost({ product: "codex", host: "learn.chatgpt.com", inCodex: true }).status, 0);
  assert.equal(lintPost({ product: "codex", host: "developers.openai.com", inCodex: true, title: "Codex App：更新說明" }).status, 0);
});

test("wrong product sources, unknown products, and misplaced articles fail", () => {
  for (const options of [
    { host: "developers.openai.com" },
    { product: "codex", host: "code.claude.com", inCodex: true },
    { product: "other", host: "learn.chatgpt.com" },
    { product: "codex", host: "learn.chatgpt.com" },
    { host: "code.claude.com", inCodex: true },
    { product: "codex", host: "learn.chatgpt.com.evil.example", inCodex: true },
  ]) {
    const result = lintPost(options);
    assert.equal(result.status, 1, result.output);
  }
});
