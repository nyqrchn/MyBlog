import type { CSSProperties } from 'react';

type Props = {
  value: number;
};

export default function Rating({ value }: Props) {
  const percentage = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <p className="rating" aria-label={`評価 ${value.toFixed(1)} / 5`}>
      <span className="stars" style={{ '--rating': `${percentage}%` } as CSSProperties} aria-hidden="true">
        <span className="stars-base">★★★★★</span>
        <span className="stars-fill">★★★★★</span>
      </span>
      <span>{value.toFixed(1)}</span>
    </p>
  );
}
