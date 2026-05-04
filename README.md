# Blog

Astro + React + MDX で作る、本・映画・音楽・ライブレポ・雑記用の軽量な静的サイトです。記事は `src/content/records` に MDX で追加します。

## Development

```sh
export PATH="$HOME/.volta/bin:$PATH"
volta install node@22.12.0 pnpm@10.24.0
pnpm install
pnpm dev
```

If `node -v` does not show `v22.12.0` in this project, add `export PATH="$HOME/.volta/bin:$PATH"` to your `~/.zshrc` and open a new terminal.

## Build

```sh
pnpm build
pnpm preview
```

## Cloudflare Pages

- Build command: `pnpm build`
- Output directory: `dist`
- Root directory: repository root
- Node.js version: `22.12.0` or newer
- Environment variable: set `SITE_URL` to the published URL for canonical URLs and sitemap generation

## Writing

Create a new `.mdx` file in `src/content/records`.

```mdx
---
title: "Post title"
description: "Short description"
category: "book"
creator: "Creator name"
workYear: 2026
rating: 4.2
cover: "/covers/default.svg"
publishedAt: 2026-05-04
tags: ["Astro", "React"]
draft: false
---

Body content.
```

`category` は `book`, `movie`, `music`, `live`, `note` のいずれかを指定します。

Images can be placed in `public/` and used freely in MDX.

```mdx
![Alt text](/covers/default.svg)
```
