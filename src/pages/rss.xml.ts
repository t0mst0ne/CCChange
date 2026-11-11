import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import siteConfig from "@/site.config";
import {
  getPostsByProduct,
  getPostUrl,
} from "@/utils/content";

export async function GET(context: APIContext) {
  const posts = await getPostsByProduct("claude-code");
  const site = context.site ?? siteConfig.url;

  return rss({
    title: `${siteConfig.title} · Claude Code`,
    description: "Claude Code 每日 changelog 中文講義。",
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate:
        post.data.updated ??
        post.data.published,
      link: getPostUrl(
        post.id,
        post.filePath
      ),
    })),
  });
}
