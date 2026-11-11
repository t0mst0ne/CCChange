import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import siteConfig from "@/site.config";
import { getPostsByProduct, getPostUrl } from "@/utils/content";
import { absoluteUrl } from "@/utils/url";

export async function GET(context: APIContext) {
  const site = context.site ?? siteConfig.url;
  const posts = await getPostsByProduct("codex");
  return rss({
    title: `${siteConfig.title} · OpenAI Codex`,
    description: "OpenAI Codex 的版本變更與工作流程建議，繁體中文講義。",
    site: absoluteUrl("/codex/", site),
    customData: "<language>zh-TW</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: new URL(getPostUrl(post.id, post.filePath), site).toString(),
    })),
  });
}
