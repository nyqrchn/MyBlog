import { useState } from 'react';
import { site } from '../lib/site';
import type { Review } from '../lib/types';
import SearchModal from './SearchModal';

type Props = {
  reviews: Review[];
};

export default function SiteHeader({ reviews }: Props) {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="site-header archive-header">
        <div className="site-title">
          <a href="/">{site.name}</a>
        </div>

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

      <SearchModal
        reviews={reviews}
        isOpen={isSearchOpen}
        query={query}
        onClose={() => setIsSearchOpen(false)}
        onQueryChange={setQuery}
        showResults
      />
    </>
  );
}
