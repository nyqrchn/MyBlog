import { useEffect, useMemo, useRef, useState } from 'react';
import { site } from '../lib/site';
import { categoryLabels, type Review, type ViewMode } from '../lib/types';
import Rating from './Rating';

type Props = {
  reviews: Review[];
};

const pageSize = 12;

export default function ReviewArchive({ reviews }: Props) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [hasLoadedViewMode, setHasLoadedViewMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesCategory = activeCategory ? review.category === activeCategory : true;
      const searchable =
        `${review.title} ${review.description} ${review.creator} ${review.tags.join(' ')}`.toLowerCase();

      return matchesCategory && searchable.includes(normalizedQuery);
    });
  }, [activeCategory, query, reviews]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [activeCategory, query, viewMode]);

  useEffect(() => {
    const savedViewMode = window.localStorage.getItem(site.storageKeys.viewMode);
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode);
    }
    setHasLoadedViewMode(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedViewMode) return;
    window.localStorage.setItem(site.storageKeys.viewMode, viewMode);
  }, [hasLoadedViewMode, viewMode]);

  useEffect(() => {
    if (!isSearchOpen) return;
    searchInputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + pageSize, filteredReviews.length));
        }
      },
      { rootMargin: '480px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredReviews.length]);

  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReviews.length;

  return (
    <>
      <header className="site-header archive-header">
        <h1>
          <a href="/">{site.name}</a>
        </h1>

        <nav aria-label="Primary navigation">
          {site.nav.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button className="icon-button" type="button" onClick={() => setIsSearchOpen(true)} aria-label={site.labels.openSearch}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
          </svg>
        </button>
      </header>

      {isSearchOpen && (
        <div className="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title">
          <button className="modal-backdrop" type="button" aria-label={site.labels.closeSearch} onClick={() => setIsSearchOpen(false)} />
          <div className="search-dialog">
            <div className="modal-header">
              <h2 id="search-title">{site.labels.search}</h2>
              <button className="icon-button" type="button" onClick={() => setIsSearchOpen(false)} aria-label={site.labels.closeSearch}>
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="search-row">
              <label htmlFor="review-search">{site.labels.searchLabel}</label>
              <input
                id="review-search"
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder={site.labels.searchPlaceholder}
              />
            </div>
          </div>
        </div>
      )}

      <main className="page-shell archive-shell">
        <div className="archive-filter-row">
          <div className="filter-group" aria-label="作品カテゴリ">
            <button
              className={activeCategory === '' ? 'active' : ''}
              type="button"
              onClick={() => setActiveCategory('')}
            >
              {site.labels.allCategories}
            </button>
            {Object.entries(categoryLabels).map(([category, label]) => (
              <button
                className={activeCategory === category ? 'active' : ''}
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="list-tools">
            <p className="result-count">
              {filteredReviews.length} {site.labels.workCountSuffix}
            </p>
            <div className="view-toggle" aria-label="表示切替">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="グリッド表示"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />
                </svg>
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="リスト表示"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <section className="review-browser" aria-label="レビュー一覧">
          <div className={viewMode === 'grid' ? 'review-grid' : 'review-list'} aria-live="polite">
            {visibleReviews.map((review) => (
              <article className="review-card" key={review.url}>
                <a className="cover-link" href={review.url} aria-label={`${review.title}を読む`}>
                  <img src={review.cover} alt="" loading="lazy" />
                </a>
                <div className="review-card-body">
                  <div className="review-meta">
                    <span>{categoryLabels[review.category]}</span>
                    <span>{review.date}</span>
                  </div>
                  <h2>
                    <a href={review.url}>{review.title}</a>
                  </h2>
                  <p className="creator">
                    {review.creator}
                    {review.workYear ? ` / ${review.workYear}` : ''}
                  </p>
                  <p>{review.description}</p>
                  {review.rating && <Rating value={review.rating} />}
                </div>
              </article>
            ))}
          </div>

          {filteredReviews.length === 0 && <p className="empty-state">{site.labels.emptyReviews}</p>}
          {hasMore && <div className="scroll-sentinel" ref={sentinelRef} aria-hidden="true" />}
        </section>

        <section className="profile-card" aria-labelledby="profile-heading">
          <div className="profile-icon" aria-hidden="true">{site.labels.profileIcon}</div>
          <div className="profile-copy">
            <p className="eyebrow">{site.labels.about}</p>
            <h2 id="profile-heading">{site.name}</h2>
            <p>{site.labels.profileText}</p>
          </div>
          <a className="text-link" href="/about/">
            {site.labels.profileLink}
          </a>
        </section>
      </main>
    </>
  );
}
