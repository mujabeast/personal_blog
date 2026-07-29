import type { APIRoute } from 'astro';
import { getPosts } from '@/utils/posts';
import { postPath } from '@/utils/paths';

export const GET: APIRoute = async () => {
  const posts = await getPosts({ includeDrafts: false });
  return new Response(JSON.stringify(posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    publishedDate: post.data.publishedDate.toISOString(),
    url: postPath(post.id),
    excerpt: (post.body ?? '').replace(/[#*_>`\[\]-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 260)
  }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
