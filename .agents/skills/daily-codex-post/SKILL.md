---
name: daily-codex-post
description: Research OpenAI Codex updates and write a dated Traditional Chinese CCChange article. Use for today's Codex post or the Codex daily publishing routine; Claude Code uses its existing separate skill.
---

# Daily Codex 講義

Run from the CCChange repository root. Write one article in
`src/content/posts/codex/YYYY-MM-DD-slug.md`, using Asia/Taipei for the article
date. This routine prepares and validates a local article. Push and open a PR
only when the user asks to publish or has authorized that publishing routine.
Before creating a file, check for an existing Codex article for that Taiwan
date. Update the existing draft or report that it is already complete; avoid
publishing a duplicate on a retry.

## Establish what shipped

```bash
TZ=Asia/Taipei date '+%Y-%m-%d %H:%M:%S %Z'
pnpm --silent codex:check > /tmp/ccchange-codex-release.json
curl -fL --max-time 30 https://learn.chatgpt.com/docs/changelog \
  -o /tmp/ccchange-codex-changelog.html
```

Read both results. The helper uses npm's `dist-tags.latest` and exact package
publication timestamps. `alpha` is reported separately; a platform package or
an alpha published today does not make the stable channel new. Report the exact
check time and distinguish release dates from the Taiwan article date.

The npm check covers CLI only. Fetch the official changelog entries for App,
IDE, or cloud updates separately before making statements about those surfaces.
Do not claim “Codex had no updates” from a CLI-only check. If a request fails,
say freshness is unknown; never turn a failed request into “no release.”

Read the latest release entry and the preceding substantive entry in full.
Follow the version-specific official links when a changelog gives no detail.
Do not attribute the previous version's features to a patch with sparse notes.
An unpublished change on the default branch is not a released feature.

Use first-party sources: the official changelog at
`https://learn.chatgpt.com/docs/changelog`, current Codex documentation linked
there, and npm's `@openai/codex` metadata. Source-code comparisons, when needed,
must use the exact release tags in OpenAI's Codex repository. The CLI is open
source: prefer a targeted source diff over guessing behavior from string counts.
Source presence does not prove a remotely controlled capability is enabled.

For settings, commands, pricing, or behavior claims, fetch the relevant official
page during this run. Preserve experimental gates and platform restrictions.
Test cheap commands in a scratch directory if useful; do not modify the user's
Codex installation or configuration. Label untested behavior as 官方文件, never
本機實測. Clearly label recommendations and inferences as 建議 or 判讀.

## Write the article

```yaml
---
title: "Codex CLI <verified-version>：<具體變更>"
description: "一到兩句說明今天讀者要知道什麼。"
published: YYYY-MM-DD
product: codex
category: Changelog
tags: [codex, changelog, codex-cli]
lang: zh-TW
---
```

Replace all placeholders with verified values. The filename date and published
date must agree. For an App or IDE announcement without a published version,
name `Codex` in the title and cite the official dated announcement; never invent
a semantic version. Existing Claude articles stay where they are.

Exactly these three `##` sections, in this order:

1. `改了什麼`: a table of facts, with the freshness verdict and source links.
2. `為什麼要改`: the concrete problem this fixes. If the reason is undocumented,
   say so and separate your interpretation from the official statement.
3. `對你的流程有什麼影響`: numbered actions in execution order, or 不用管 with
   a reason. Commands and settings retain their exact spelling.

The prose target is 2,000 characters; the hard cap is 3,200. Include at least
one fetched official link on `developers.openai.com`, `platform.openai.com`, or
`learn.chatgpt.com`. No `我的看法` heading, fabricated quotes, or banned phrases
such as 可以考慮 / 這意味著 / 所謂的. A no-release article is valid: state the
scope and discuss a verified existing feature without manufacturing news.

Read `.claude/skills/humanizer-zh-tw/SKILL.md`, revise the whole draft, and score
the five dimensions privately. Revise again below 40/50. Keep source evidence
and command output in the working notes or PR body, not in long article digressions.

## Validate and publish

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm test
```

All three must succeed before a publication PR. When publication is authorized,
use branch `daily/codex-YYYY-MM-DD`, stage only the article explicitly, commit,
push, and create a PR with `codex-daily`. Check that the label exists; if absent,
report the one-time repository setup rather than silently using another label.
Do not merge it yourself. The workflow accepts content/public changes only and
retains its CI, author, same-repository, base-branch, and draft gates.

The PR body records checked versions and times, the scoped 24-hour verdict,
article coverage, and exact verification results. Use a body file for multiline
text. If a required source or check cannot be verified, leave a local draft
(or a draft PR if publishing was requested) and explain the gap.

This skill does not install a schedule. A separately configured Codex automation
can invoke `$daily-codex-post` daily at 08:00 Asia/Taipei with its intended
publication authorization.
