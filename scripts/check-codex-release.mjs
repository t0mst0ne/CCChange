#!/usr/bin/env node
import { pathToFileURL } from "node:url";

export const REGISTRY_URL = "https://registry.npmjs.org/@openai%2Fcodex";
const STABLE_VERSION = /^\d+\.\d+\.\d+$/;
const DAY = 24 * 60 * 60 * 1000;

/** Dist-tags select the channel; package timestamps establish freshness. */
export function summarizeReleases(metadata, now = new Date()) {
  const checkedAt = new Date(now);
  if (!Number.isFinite(checkedAt.getTime())) throw new Error("Invalid check time");
  const latest = metadata["dist-tags"]?.latest;
  if (!STABLE_VERSION.test(latest ?? "")) {
    throw new Error("npm has no valid stable latest tag; freshness is unknown");
  }

  function release(version) {
    const timestamp = metadata.time?.[version];
    const publishedAt = new Date(timestamp ?? "");
    const age = checkedAt.getTime() - publishedAt.getTime();
    if (!Number.isFinite(age) || age < 0) {
      throw new Error(`Invalid or future publication time for ${version}; freshness is unknown`);
    }
    return {
      version,
      publishedAt: publishedAt.toISOString(),
      ageHours: Math.round(age / 36000) / 100,
      releasedWithin24h: age <= DAY,
    };
  }

  const stableReleases = Object.entries(metadata.time ?? {})
    .filter(([version, time]) => STABLE_VERSION.test(version) &&
      Number.isFinite(Date.parse(time)) && Date.parse(time) <= checkedAt.getTime())
    .map(([version]) => release(version))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  const alpha = metadata["dist-tags"]?.alpha;
  return {
    checkedAt: checkedAt.toISOString(),
    timezone: "Asia/Taipei",
    scope: "Codex CLI npm releases only; check App and IDE announcements separately",
    source: REGISTRY_URL,
    changelogUrl: "https://learn.chatgpt.com/docs/changelog",
    latest: release(latest),
    alpha: alpha ? release(alpha) : null,
    stablePublishedWithin24h: stableReleases.filter((item) => item.releasedWithin24h),
    recentStable: stableReleases.slice(0, 6),
  };
}

export async function checkCodexRelease({ fetchImpl = fetch, now = new Date() } = {}) {
  const response = await fetchImpl(REGISTRY_URL, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`npm returned HTTP ${response.status}; freshness is unknown`);
  return summarizeReleases(await response.json(), now);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(JSON.stringify(await checkCodexRelease(), null, 2));
  } catch (error) {
    console.error(`codex:check: ${error.message}`);
    process.exitCode = 1;
  }
}
