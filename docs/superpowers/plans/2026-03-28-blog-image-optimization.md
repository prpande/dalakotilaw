# Blog Image Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce blog image load times via build-time compression, WebP conversion, and lazy loading.

**Architecture:** A Node.js script using `sharp` runs before `ng build`, scanning `docs/blog/images/` to produce compressed JPG + WebP variants. Templates use `<picture>` elements for WebP-first delivery with JPG fallback. Card images lazy-load; the article hero loads eagerly.

**Tech Stack:** sharp (Node.js image processing), Angular 16 templates, native `<picture>`/`loading` attributes.

**Spec:** `docs/superpowers/specs/2026-03-28-blog-image-optimization-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `scripts/optimize-blog-images.js` | Build-time image optimization script |
| Modify | `src/app/services/blog.service.ts` | Add format parameter to `getImageUrl()` |
| Modify | `src/app/components/blog/blog.component.ts` | Add format parameter to wrapper |
| Modify | `src/app/components/blog/blog.component.html` | `<picture>` element + lazy loading |
| Modify | `src/app/components/blog-post/blog-post.component.html` | `<picture>` element + eager loading |
| Modify | `src/app/components/home/home.component.ts` | Add format parameter to wrapper |
| Modify | `src/app/components/home/home.component.html` | `<picture>` element + lazy loading |
| Modify | `package.json` | Add `sharp` dev dep + `optimize-images` script + update `deploy` |

---

### Task 1: Install sharp and add npm scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install sharp as dev dependency**

Run: `npm install --save-dev sharp`

- [ ] **Step 2: Add optimize-images script and update deploy script in package.json**

In `package.json`, add to `"scripts"`:
```json
"optimize-images": "node scripts/optimize-blog-images.js"
```

Update the `"deploy"` script to:
```json
"deploy": "node scripts/optimize-blog-images.js && ng build && shx cp -r dist/dalakotilaw/* docs/ && shx cp docs/index.html docs/404.html"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add sharp dependency and optimize-images npm script"
```

---

### Task 2: Create the image optimization script

**Files:**
- Create: `scripts/optimize-blog-images.js`

- [ ] **Step 1: Create the script**

```javascript
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'docs', 'blog', 'images');
const MANIFEST_PATH = path.join(IMAGES_DIR, '.optimized.json');
const MAX_WIDTH = 1200;
const JPG_QUALITY = 75;
const WEBP_QUALITY = 75;
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function fileHash(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(data).digest('hex');
}

async function optimizeImage(filePath, manifest) {
  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath, ext);
  const jpgPath = path.join(IMAGES_DIR, `${baseName}.jpg`);
  const webpPath = path.join(IMAGES_DIR, `${baseName}.webp`);

  const hash = fileHash(filePath);
  if (manifest[baseName] === hash) {
    console.log(`  Skipping ${path.basename(filePath)} (unchanged)`);
    return;
  }

  console.log(`  Processing ${path.basename(filePath)}...`);
  const originalSize = fs.statSync(filePath).size;

  const image = sharp(filePath).resize({
    width: MAX_WIDTH,
    height: undefined,
    withoutEnlargement: true
  });

  // Generate JPG
  const jpgBuffer = await image
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: JPG_QUALITY })
    .toBuffer();

  // Keep smaller version for JPG (only when source is already JPG)
  if (ext === '.jpg' || ext === '.jpeg') {
    if (jpgBuffer.length < originalSize) {
      fs.writeFileSync(jpgPath, jpgBuffer);
      console.log(`    JPG: ${(originalSize / 1024).toFixed(0)} KB -> ${(jpgBuffer.length / 1024).toFixed(0)} KB`);
    } else {
      console.log(`    JPG: kept original (${(originalSize / 1024).toFixed(0)} KB, optimized was larger)`);
    }
  } else {
    // Source is PNG — always write the JPG replacement
    fs.writeFileSync(jpgPath, jpgBuffer);
    console.log(`    JPG: ${(originalSize / 1024).toFixed(0)} KB (PNG) -> ${(jpgBuffer.length / 1024).toFixed(0)} KB`);
  }

  // Generate WebP
  const webpBuffer = await sharp(filePath)
    .resize({ width: MAX_WIDTH, height: undefined, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  fs.writeFileSync(webpPath, webpBuffer);
  console.log(`    WebP: ${(webpBuffer.length / 1024).toFixed(0)} KB`);

  // Delete original PNG (now replaced by JPG)
  if (ext === '.png') {
    fs.unlinkSync(filePath);
    console.log(`    Deleted original PNG`);
  }

  // Update manifest with hash of the current JPG on disk
  manifest[baseName] = fileHash(jpgPath);
}

async function main() {
  console.log('Optimizing blog images...');

  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('No blog images directory found. Skipping.');
    return;
  }

  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .map(f => path.join(IMAGES_DIR, f));

  if (files.length === 0) {
    console.log('No images to optimize.');
    return;
  }

  const manifest = loadManifest();

  for (const file of files) {
    try {
      await optimizeImage(file, manifest);
    } catch (err) {
      console.warn(`  WARNING: Failed to optimize ${path.basename(file)}: ${err.message}`);
    }
  }

  saveManifest(manifest);
  console.log('Done.');
}

main();
```

- [ ] **Step 2: Run the script to verify it works**

Run: `npm run optimize-images`

Expected: Each blog image is processed, compressed JPG + WebP created, sizes logged. Verify:
- 5 `.webp` files created in `docs/blog/images/`
- 5 `.jpg` files updated (smaller sizes)
- `.optimized.json` created with 5 entries
- No errors in output

- [ ] **Step 3: Verify output sizes are in expected range**

Run: `ls -la docs/blog/images/`

Expected: JPGs ~80-120 KB, WebPs ~50-80 KB each.

- [ ] **Step 4: Commit**

```bash
git add scripts/optimize-blog-images.js docs/blog/images/
git commit -m "feat: add blog image optimization script with sharp

Generates compressed JPG + WebP for each blog image.
Max 1200px wide, quality 75, with hash-based caching."
```

---

### Task 3: Update BlogService to support format parameter

**Files:**
- Modify: `src/app/services/blog.service.ts:46-48`

- [ ] **Step 1: Update getImageUrl method**

Replace in `src/app/services/blog.service.ts`:

```typescript
// OLD
getImageUrl(filename: string): string {
  return `${this.imagesPath}/${filename}`;
}

// NEW
getImageUrl(filename: string, format: 'jpg' | 'webp' = 'jpg'): string {
  const baseName = filename.replace(/\.(jpg|jpeg|png)$/i, '');
  return `${this.imagesPath}/${baseName}.${format}`;
}
```

- [ ] **Step 2: Verify the app compiles**

Run: `ng build --configuration development 2>&1 | tail -5`

Expected: Build succeeds. All existing callers pass no format argument, so they default to `'jpg'` — no breakage.

- [ ] **Step 3: Commit**

```bash
git add src/app/services/blog.service.ts
git commit -m "feat: add format parameter to BlogService.getImageUrl()"
```

---

### Task 4: Update blog list component (template + wrapper)

**Files:**
- Modify: `src/app/components/blog/blog.component.ts:49-51`
- Modify: `src/app/components/blog/blog.component.html:15`

- [ ] **Step 1: Update the wrapper method in blog.component.ts**

Replace in `src/app/components/blog/blog.component.ts`:

```typescript
// OLD
getImageUrl(post: BlogPost): string {
  return this.blogService.getImageUrl(post.image);
}

// NEW
getImageUrl(post: BlogPost, format?: 'jpg' | 'webp'): string {
  return this.blogService.getImageUrl(post.image, format);
}
```

- [ ] **Step 2: Update the template to use `<picture>` with lazy loading**

Replace in `src/app/components/blog/blog.component.html`:

```html
<!-- OLD -->
<img [src]="getImageUrl(post)" [alt]="getTitle(post)" class="card-img-top blog-card-img">

<!-- NEW -->
<picture>
  <source [srcset]="getImageUrl(post, 'webp')" type="image/webp">
  <img [src]="getImageUrl(post, 'jpg')" [alt]="getTitle(post)" loading="lazy" class="card-img-top blog-card-img">
</picture>
```

- [ ] **Step 3: Verify the app compiles**

Run: `ng build --configuration development 2>&1 | tail -5`

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/blog/blog.component.ts src/app/components/blog/blog.component.html
git commit -m "feat: add WebP support and lazy loading to blog list images"
```

---

### Task 5: Update blog post component (template only)

**Files:**
- Modify: `src/app/components/blog-post/blog-post.component.html:18-20`

- [ ] **Step 1: Update the article hero image to use `<picture>` with eager loading**

Replace in `src/app/components/blog-post/blog-post.component.html`:

```html
<!-- OLD -->
<div class="article-hero">
  <img [src]="blogService.getImageUrl(article.post.image)" [alt]="getTitle()" class="article-hero-img">
</div>

<!-- NEW -->
<div class="article-hero">
  <picture>
    <source [srcset]="blogService.getImageUrl(article.post.image, 'webp')" type="image/webp">
    <img [src]="blogService.getImageUrl(article.post.image, 'jpg')" [alt]="getTitle()" loading="eager" class="article-hero-img">
  </picture>
</div>
```

Note: The SEO call in `blog-post.component.ts` uses `this.blogService.getImageUrl(article.post.image)` with no format argument — this correctly defaults to JPG for OG meta tags. No change needed.

- [ ] **Step 2: Verify the app compiles**

Run: `ng build --configuration development 2>&1 | tail -5`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/blog-post/blog-post.component.html
git commit -m "feat: add WebP support and eager loading to blog post hero image"
```

---

### Task 6: Update home component (template + wrapper)

**Files:**
- Modify: `src/app/components/home/home.component.ts:68-70`
- Modify: `src/app/components/home/home.component.html:47`

- [ ] **Step 1: Update the wrapper method in home.component.ts**

Replace in `src/app/components/home/home.component.ts`:

```typescript
// OLD
getPostImageUrl(post: BlogPost): string {
  return this.blogService.getImageUrl(post.image);
}

// NEW
getPostImageUrl(post: BlogPost, format?: 'jpg' | 'webp'): string {
  return this.blogService.getImageUrl(post.image, format);
}
```

- [ ] **Step 2: Update the template to use `<picture>` with lazy loading**

Replace in `src/app/components/home/home.component.html`:

```html
<!-- OLD -->
<img [src]="getPostImageUrl(post)" [alt]="getPostTitle(post)" class="card-img-top blog-card-sm-img">

<!-- NEW -->
<picture>
  <source [srcset]="getPostImageUrl(post, 'webp')" type="image/webp">
  <img [src]="getPostImageUrl(post, 'jpg')" [alt]="getPostTitle(post)" loading="lazy" class="card-img-top blog-card-sm-img">
</picture>
```

- [ ] **Step 3: Verify the app compiles**

Run: `ng build --configuration development 2>&1 | tail -5`

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/home/home.component.ts src/app/components/home/home.component.html
git commit -m "feat: add WebP support and lazy loading to home page blog cards"
```

---

### Task 7: Full build verification

- [ ] **Step 1: Run the full deploy pipeline**

Run: `npm run optimize-images && ng build`

Expected: Images optimized (or skipped if cached), Angular build succeeds.

- [ ] **Step 2: Verify blog images in build output**

Run: `ls -la dist/dalakotilaw/blog/images/`

Expected: Both `.jpg` and `.webp` files present for all 5 blog posts, plus `.optimized.json`.

- [ ] **Step 3: Run tests**

Run: `ng test --watch=false`

Expected: All existing tests pass.

- [ ] **Step 4: Spot-check with dev server (manual)**

Run: `ng serve`

Open browser to `http://localhost:4200/blog`. Verify:
- Blog card images load (check Network tab for WebP requests in Chrome)
- Click a post — hero image loads eagerly
- No console errors

- [ ] **Step 5: Commit any remaining changes if needed**

```bash
git status
# If docs/blog/images/ has new .webp files not yet committed:
git add docs/blog/images/
git commit -m "build: add optimized WebP blog images to docs"
```
