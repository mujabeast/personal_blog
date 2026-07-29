import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '@/utils/posts';
import { postPath } from '@/utils/paths';
import { siteConfig } from '@/config';

export async function GET(context: APIContext) {
  const posts = await getPosts({ includeDrafts: false });
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: new URL(import.meta.env.BASE_URL, context.site!),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedDate,
      link: postPath(post.id),
      categories: [post.data.category, ...post.data.tags]
    })),
    customData: '<language>en-sg</language>'
  });
}
