// NOTE: @astrojs/rss@4.0.15 uses Zod v3 API (z.function().returns, z.preprocess) which is
// incompatible with Astro v6's bundled Zod v4. Replaced with a native XML Response until
// @astrojs/rss ships a Zod v4-compatible release.
import type { APIContext } from "astro";
import type { CollectionEntry } from "astro:content";
import config from "../config/config.json";
import { getSinglePage } from "../lib/contentParser.astro";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(context: APIContext): Promise<Response> {
  const publishedPosts = await getSinglePage("posts");
  const site = (context.site || new URL(config.site.base_url)).toString().replace(/\/$/, "");
  const title = escapeXml(config.site.title || "Northendlab Light Astro");
  const description = escapeXml("Northendlab Light Astro Blog");

  const items = publishedPosts
    .map((post: CollectionEntry<"posts">) => {
      const pubDate = (post.data.date || new Date()).toUTCString();
      const link = `${site}/blog/${post.id}/`;
      const itemTitle = escapeXml(post.data.title || "");
      const itemDesc = escapeXml(post.data.description || "");
      return `<item>
      <title>${itemTitle}</title>
      <link>${link}</link>
      <description>${itemDesc}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${link}</guid>
    </item>`;
    })
    .join("\n    ");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${site}</link>
    <description>${description}</description>
    <language>en-us</language>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
