export const siteId = 'kiwoku-record';

export const site = {
  id: siteId,
  name: 'キヲクレコード',
  description: '本、映画、音楽作品のレビューと感想を集める個人アーカイブです。',
  copyright: 'All rights reserved.',
  nav: [
    { href: '/records/', label: 'Records' },
    { href: '/tags/', label: 'Tags' },
    { href: '/about/', label: 'About' },
  ],
  storageKeys: {
    viewMode: `${siteId}:view-mode`,
  },
  labels: {
    about: 'About',
    allCategories: 'すべて',
    closeSearch: '検索を閉じる',
    emptyReviews: '一致するレビューはありません。',
    openSearch: '検索を開く',
    profileIcon: '記',
    profileLink: 'この棚について',
    profileText: '本、映画、音楽、ライブ、雑記を、あとから思い出せる形で残していく作品棚です。',
    search: 'Search',
    searchLabel: '作品名、作者、タグ',
    searchPlaceholder: '検索語を入力',
    workCountSuffix: 'works',
  },
} as const;
