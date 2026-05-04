import { useMemo, useState } from 'react';

type Post = {
  title: string;
  description: string;
  url: string;
  date: string;
  tags: string[];
};

type Props = {
  posts: Post[];
  tags: string[];
};

export default function TagFilter({ posts, tags }: Props) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesTag = activeTag ? post.tags.includes(activeTag) : true;
      const searchable = `${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase();
      return matchesTag && searchable.includes(normalizedQuery);
    });
  }, [activeTag, posts, query]);

  return (
    <section className="filter-panel" aria-label="記事検索">
      <div className="search-row">
        <label htmlFor="post-search">Search</label>
        <input
          id="post-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="タイトル、説明、タグで検索"
        />
      </div>

      <div className="tag-list" aria-label="タグで絞り込み">
        <button
          className={activeTag === '' ? 'active' : ''}
          type="button"
          onClick={() => setActiveTag('')}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            className={activeTag === tag ? 'active' : ''}
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="post-list" aria-live="polite">
        {visiblePosts.map((post) => (
          <article className="post-card" key={post.url}>
            <p className="meta">{post.date}</p>
            <h2>
              <a href={post.url}>{post.title}</a>
            </h2>
            <p>{post.description}</p>
            <div className="inline-tags">
              {post.tags.map((tag) => (
                <a href={`/tags/${encodeURIComponent(tag)}/`} key={tag}>
                  {tag}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>

      {visiblePosts.length === 0 && <p className="empty-state">一致する記事はありません。</p>}
    </section>
  );
}
