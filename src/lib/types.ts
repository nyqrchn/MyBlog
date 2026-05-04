export const reviewCategories = ['book', 'movie', 'music', 'live', 'note'] as const;

export type ReviewCategory = (typeof reviewCategories)[number];

export type ViewMode = 'grid' | 'list';

export type Review = {
  title: string;
  description: string;
  url: string;
  date: string;
  tags: string[];
  category: ReviewCategory;
  creator: string;
  workYear?: number;
  rating?: number;
  cover: string;
};

export const categoryLabels: Record<ReviewCategory, string> = {
  book: '本',
  movie: '映画',
  music: '音楽',
  live: 'ライブレポ',
  note: '雑記',
};
