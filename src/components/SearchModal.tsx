import { useEffect, useMemo, useRef } from 'react';
import { site } from '../lib/site';
import type { Review } from '../lib/types';

type Props = {
  reviews: Review[];
  isOpen: boolean;
  query: string;
  onClose: () => void;
  onQueryChange: (query: string) => void;
  showResults?: boolean;
};

export default function SearchModal({
  reviews,
  isOpen,
  query,
  onClose,
  onQueryChange,
  showResults = false,
}: Props) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return reviews
      .filter((review) => {
        const searchable =
          `${review.title} ${review.description} ${review.creator} ${review.tags.join(' ')}`.toLowerCase();
        return searchable.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [query, reviews]);

  useEffect(() => {
    if (!isOpen) return;
    searchInputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title">
      <button className="modal-backdrop" type="button" aria-label={site.labels.closeSearch} onClick={onClose} />
      <div className="search-dialog">
        <div className="modal-header">
          <h2 id="search-title">{site.labels.search}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label={site.labels.closeSearch}>
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
            onChange={(event) => onQueryChange(event.currentTarget.value)}
            placeholder={site.labels.searchPlaceholder}
          />
        </div>

        {showResults && (
          <div className="search-results" aria-live="polite">
            {results.map((review) => (
              <a href={review.url} key={review.url}>
                <span>{review.title}</span>
                <small>{review.creator}</small>
              </a>
            ))}
            {query.trim() && results.length === 0 && <p>{site.labels.emptyReviews}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
