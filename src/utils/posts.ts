import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import readingTime from 'reading-time';

export type Post = CollectionEntry<'posts'>;

export async function getPosts(options: { includeDrafts?: boolean } = {}): Promise<Post[]> {
  const includeDrafts = options.includeDrafts ?? import.meta.env.DEV;
  return (await getCollection('posts', ({ data }) => includeDrafts || !data.draft))
    .sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf());
}

export function readingTimeFor(post: Post): string {
  return readingTime(post.body ?? '').text.replace('min read', 'min read');
}

export function normaliseTerm(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function relatedPosts(current: Post, posts: Post[], limit = 3): Post[] {
  return posts
    .filter((post) => post.id !== current.id)
    .map((post) => ({
      post,
      score:
        post.data.tags.filter((tag) => current.data.tags.includes(tag)).length * 2 +
        Number(post.data.category === current.data.category)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}
