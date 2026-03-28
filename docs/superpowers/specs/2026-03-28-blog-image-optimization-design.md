# Blog Image Optimization Design

**Date:** 2026-03-28
**Scope:** Blog images only (`docs/blog/images/`)

## Problem

Blog images are served as uncompressed JPGs averaging ~650 KB each (~3.2 MB total for 5 posts). No WebP variants, no lazy loading, no responsive sizing. Images display at max 1200px wide (article hero) but are served at original resolution.

## Solution

A build-time Node.js script using `sharp` that compresses and converts blog images, paired with template updates to serve WebP with JPG fallback via `<picture>` elements.

## 1. Build-Time Optimization Script

**File:** `scripts/optimize-blog-images.js`

**Behavior:**
- Scans `docs/blog/images/` for `.jpg`, `.jpeg`, and `.png` files
- For each source image, generates:
  - Compressed `.jpg` — max 1200px wide, quality 75
  - `.webp` — max 1200px wide, quality 75
- Tracks source file hashes in `docs/blog/images/.optimized.json` to skip already-optimized images on subsequent runs
- Deletes original `.png` files after optimization (replaced by the `.jpg` output)
- Overwrites original `.jpg` files with the compressed version

**Edge cases:**
- Images smaller than 1200px wide are not upscaled — they are re-encoded at their original dimensions
- If the optimized output is larger than the original (possible for already-small files), keep the smaller version
- If `sharp` fails on a specific image, log a warning and continue processing remaining images (do not fail the build)
- PNG-to-JPG conversion fills transparent areas with white — acceptable since blog images are photographs, not diagrams

**Dependency:** `sharp` (dev dependency)

**npm script:** `"optimize-images": "node scripts/optimize-blog-images.js"`

## 2. Template Changes

Three templates updated to use `<picture>` elements:

### blog.component.html (card list)
```html
<picture>
  <source [srcset]="getImageUrl(post, 'webp')" type="image/webp">
  <img [src]="getImageUrl(post, 'jpg')" [alt]="..." loading="lazy" class="card-img-top blog-card-img">
</picture>
```

### blog-post.component.html (article hero)
```html
<picture>
  <source [srcset]="blogService.getImageUrl(article.post.image, 'webp')" type="image/webp">
  <img [src]="blogService.getImageUrl(article.post.image, 'jpg')" [alt]="..." loading="eager" class="article-hero-img">
</picture>
```

### home.component.html (latest 3 posts)
```html
<picture>
  <source [srcset]="getPostImageUrl(post, 'webp')" type="image/webp">
  <img [src]="getPostImageUrl(post, 'jpg')" [alt]="..." loading="lazy" class="card-img-top blog-card-sm-img">
</picture>
```

**Loading strategy:**
- `loading="eager"` for article hero (above the fold)
- `loading="lazy"` for all card images

## 3. BlogService and Component Changes

### BlogService (`src/app/services/blog.service.ts`)

Update `getImageUrl()` to accept an optional format parameter:

```typescript
getImageUrl(filename: string, format: 'jpg' | 'webp' = 'jpg'): string {
  const baseName = filename.replace(/\.(jpg|jpeg|png)$/i, '');
  return `${this.imagesPath}/${baseName}.${format}`;
}
```

The blog manifest (`index.json`) and markdown frontmatter continue referencing original filenames (e.g., `title-search.jpg`). The service handles format switching.

### Component wrapper methods

The following component methods must also be updated to pass through the format parameter:

- **`blog.component.ts`** — `getImageUrl(post: BlogPost, format?: 'jpg' | 'webp')` delegates to `this.blogService.getImageUrl(post.image, format)`
- **`home.component.ts`** — `getPostImageUrl(post: BlogPost, format?: 'jpg' | 'webp')` delegates to `this.blogService.getImageUrl(post.image, format)`
- **`blog-post.component.html`** — already calls `blogService.getImageUrl()` directly, no wrapper needed
- **SEO call in `blog-post.component.ts`** — continues using default (JPG) via `this.blogService.getImageUrl(image)` with no format argument

## 4. npm Scripts Integration

Add to `package.json` scripts:
```json
{
  "optimize-images": "node scripts/optimize-blog-images.js"
}
```

The `deploy` script in `package.json` is updated to run optimization before the build:

```
"deploy": "node scripts/optimize-blog-images.js && ng build && shx cp -r dist/dalakotilaw/* docs/ && shx cp docs/index.html docs/404.html"
```

**Why this ordering works:** The optimize script writes to `docs/blog/images/`. The Angular build reads from `docs/blog/` (via the asset glob in `angular.json`: `{"glob": "**/*", "input": "docs/blog", "output": "/blog"}`), so optimized images are included in the build output. The subsequent `shx cp -r dist/dalakotilaw/* docs/` copies Angular output but does not contain a `blog/` directory, so it does not overwrite the optimized blog images already in `docs/blog/`.

The `.optimized.json` manifest file is committed to the repo (small, useful for incremental builds). It will be publicly accessible at `/blog/images/.optimized.json` but contains only filenames and hashes — no sensitive data.

## 5. SEO Meta Images

No changes. `SeoService.updateForBlogPost()` continues using JPG paths for `og:image` and `twitter:image` — social crawlers have inconsistent WebP support.

## Expected Results

| Metric | Before | After (estimated) |
|--------|--------|--------------------|
| Per-image size (JPG) | ~650 KB | ~80-120 KB |
| Per-image size (WebP) | N/A | ~50-80 KB |
| Total blog images payload | ~3.2 MB | ~250-400 KB (WebP) |
| Lazy loading | None | Cards lazy, hero eager |
| Format support | JPG only | WebP + JPG fallback |

## Out of Scope

- Non-blog images (hero-bg, profile, icon)
- Responsive image variants (srcset with multiple sizes)
- CDN or external image hosting
- Images embedded within blog post markdown content
