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

## 3. BlogService Changes

**File:** `src/app/services/blog.service.ts`

Update `getImageUrl()` to accept an optional format parameter:

```typescript
getImageUrl(filename: string, format: 'jpg' | 'webp' = 'jpg'): string {
  const baseName = filename.replace(/\.(jpg|jpeg|png)$/i, '');
  return `${this.imagesPath}/${baseName}.${format}`;
}
```

The blog manifest (`index.json`) and markdown frontmatter continue referencing original filenames (e.g., `title-search.jpg`). The service handles format switching.

## 4. npm Scripts Integration

Add to `package.json` scripts:
```json
{
  "optimize-images": "node scripts/optimize-blog-images.js"
}
```

Image optimization runs before `ng build` in the deployment workflow.

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
