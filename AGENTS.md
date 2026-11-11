# CCChange

Astro site with separate Traditional Chinese changelog articles for Claude Code
and OpenAI Codex. Read `README.md` for development and publication commands.

- Whenever OCR is needed, use Swift Vision OCR.
- Whenever opening, reading, or querying Excel files (`.xlsx`, `.csv`), use MiniExcel CLI (`miniexcel`).
- Use pnpm, Node >= 22.12, and preserve `.npmrc`'s `node-linker=hoisted`.
- Internal links use `getAssetPath()` from `@/utils/url` to preserve `/CCChange`.
- Existing posts default to `product: claude-code`. Codex articles belong in
  `src/content/posts/codex/` and require `product: codex`. Keep product feeds,
  archives, adjacent articles, and related articles separate.
- For Codex publication, use `.agents/skills/daily-codex-post/SKILL.md`. The
  Claude routine remains `.claude/skills/daily-changelog-post/SKILL.md`.
- Claims need sources fetched during the writing session. Distinguish official
  statements, local observations, and recommendations. Unknown is not no update.
- Apply `.claude/skills/humanizer-zh-tw/SKILL.md` to article drafts.
- Run `pnpm build` and `pnpm test` after changes. Daily publication PRs change
  only `src/content/` or `public/`; infrastructure changes need separate review.
- Only push or create a PR when requested. Never merge a PR directly; the
  existing workflow handles eligible content PRs after CI succeeds.
