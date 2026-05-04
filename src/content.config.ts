import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { reviewCategories } from './lib/types';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(reviewCategories).default('book'),
    creator: z.string().default('Unknown'),
    workYear: z.number().optional(),
    rating: z.number().min(0).max(5).optional(),
    cover: z.string().default('/covers/default.svg'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
