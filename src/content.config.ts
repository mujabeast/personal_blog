import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { interestTopicIds } from './data/interests';

export const categories = ['journey', 'writeups', 'learning', 'projects', 'experiences'] as const;

const posts = defineCollection({
  loader: glob({ pattern: ['**/*.{md,mdx}', '!**/README.md'], base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(220),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(categories),
    tags: z.array(z.string()).default([]),
    graphTopics: z.array(z.enum(interestTopicIds)).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    coverImage: z.string().optional(),
    canonicalUrl: z.url().optional()
  })
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    graphTopics: z.array(z.enum(interestTopicIds)).default([]),
    lastUpdated: z.coerce.date().optional()
  })
});

export const collections = { posts, pages };
