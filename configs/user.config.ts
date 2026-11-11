import type { UserConfig } from "../src/site.config";

const userConfig: UserConfig = {
  title: "CCChange",
  description:
    "Claude Code 與 OpenAI Codex 的 changelog 中文講義，追蹤版本更新與工作流程的實際影響。",

  // GitHub Pages project site: <user>.github.io + base "/CCChange" (see astro.config.mjs)
  url: "https://htlin222.github.io",
  author: "htlin222",

  navigation: [
    { title: "Claude Code", url: "/posts" },
    { title: "Codex", url: "/codex" },
    { title: "封存", url: "/archive" },
    { title: "關於", url: "/about" },
  ],

  footerLinks: [
    { title: "Claude Code RSS", url: "/rss.xml" },
    { title: "Codex RSS", url: "/codex/rss.xml" },
    { title: "Archive", url: "/archive" },
    { title: "Source", url: "https://github.com/htlin222/CCChange" },
  ],

  social: [
    {
      title: "GitHub",
      url: "https://github.com/htlin222/CCChange",
      icon: "github",
    },
  ],

  footerCredits: "Built with Astro & Lipi · Claude Code 與 OpenAI Codex 講義",

  postsPerPage: 10,
  recentPosts: 6,
  relatedPosts: 4,

  showThemeToggle: true,
  showReadingTime: true,

  heroVariant: "studio",

  annotation: "每天讀一次 changelog，省下一週的踩坑。",
};

export default userConfig;
