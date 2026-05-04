import { getCollection, type CollectionEntry } from 'astro:content';

export type RecordPost = CollectionEntry<'records'>;

export function postSlug(post: RecordPost) {
  return post.id.replace(/\.(md|mdx)$/, '');
}

export function postUrl(post: RecordPost) {
  return `/records/${postSlug(post)}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export async function getPublishedPosts() {
  const posts = await getCollection('records', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export async function getAllTags() {
  const posts = await getPublishedPosts();
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) =>
    a.localeCompare(b),
  );
}
