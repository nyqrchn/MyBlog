import { useEffect, useMemo, useRef, useState } from 'react';
import { site } from '../lib/site';
import { categoryLabels, type Review, type ViewMode } from '../lib/types';
import Rating from './Rating';

type Props = {
  reviews: Review[];
};

const pageSize = 12;

export default function ReviewArchive({ reviews }: Props) {
  const [activeCategory, setActiveCategory] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [hasLoadedViewMode, setHasLoadedViewMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesCategory = activeCategory ? review.category === activeCategory : true;
      return matchesCategory;
    });
  }, [activeCategory, reviews]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [activeCategory, viewMode]);

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
      <main className="page-shell archive-shell">
        <h1 className="archive-page-title">記録一覧</h1>
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
                  <span className="cover-description">{review.description}</span>
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
                  <p className="review-description">{review.description}</p>
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
