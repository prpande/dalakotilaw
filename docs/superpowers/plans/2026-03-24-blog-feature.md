# Blog Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fully functional blog to dalakotilaw.com with markdown authoring, runtime loading, bilingual support, and GitHub Action manifest generation.

**Architecture:** Blog posts are authored as markdown files in `docs/blog/posts/` and loaded at runtime via HTTP — no Angular rebuild needed to publish. A GitHub Action auto-generates `docs/blog/index.json` from frontmatter. The Angular app fetches this manifest for listings and individual `.md` files for article rendering using `marked` + `DOMPurify`.

**Tech Stack:** Angular 16, marked (markdown parser), DOMPurify (HTML sanitizer), gray-matter (frontmatter parser for CI script), GitHub Actions

**Spec:** `docs/superpowers/specs/2026-03-24-blog-feature-design.md`

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/app/services/blog.service.ts` | Fetches manifest and markdown, parses and sanitizes HTML |
| `src/app/models/blog.models.ts` | `BlogPost` and `BlogArticle` interfaces |
| `src/app/components/blog-post/blog-post.component.ts` | Individual article page |
| `src/app/components/blog-post/blog-post.component.html` | Article template (hero image, title, rendered markdown) |
| `src/app/components/blog-post/blog-post.component.css` | Article page styles |
| `scripts/generate-blog-manifest.js` | Node script to generate `docs/blog/index.json` from frontmatter |
| `.github/workflows/blog-manifest.yml` | GitHub Action to run manifest generator on push |
| `docs/blog/posts/.gitkeep` | Ensures posts directory exists in git |
| `docs/blog/images/.gitkeep` | Ensures images directory exists in git |
| `docs/blog/index.json` | Initial empty manifest (`[]`) |

### Modified Files
| File | Change |
|------|--------|
| `package.json` | Add `marked@^4`, `dompurify@^2`, `@types/dompurify` dependencies; add `gray-matter` dev dependency |
| `angular.json` | Add `docs/blog` as asset source for dev server access |
| `src/app/models/blog.models.ts` | New file with TypeScript interfaces |
| `src/app/app.module.ts:30-39` | Add `BlogPostComponent` to declarations |
| `src/app/app-routing.module.ts:10-38` | Add `blog/:slug` route, add `pathMatch: 'full'` to existing blog route |
| `src/app/components/blog/blog.component.ts` | Replace placeholder with listing logic |
| `src/app/components/blog/blog.component.html` | Replace "Coming Soon" with blog card grid |
| `src/app/components/blog/blog.component.css` | Blog listing styles |
| `src/app/components/home/home.component.ts:1-32` | Add BlogService injection, `latestPosts` property |
| `src/app/components/home/home.component.html:28-29` | Insert latest articles section between practice cards and CTA |
| `src/app/components/home/home.component.css` | Add blog card styles (smaller than practice cards) |
| `src/assets/i18n/en.json` | Add blog-related i18n keys |
| `src/assets/i18n/hi.json` | Add Hindi blog i18n keys |

---

## Task 1: Install Dependencies and Create Blog Directory Structure

**Files:**
- Modify: `package.json`
- Create: `docs/blog/posts/.gitkeep`
- Create: `docs/blog/images/.gitkeep`
- Create: `docs/blog/index.json`

- [ ] **Step 1: Install npm dependencies**

```bash
npm install marked@^4 dompurify@^2
npm install --save-dev @types/dompurify gray-matter
```

Using `marked@^4` and `dompurify@^2` for reliable CommonJS support with Angular 16's webpack build. Newer major versions are ESM-only and may cause build failures.

- [ ] **Step 2: Verify the build still works**

```bash
ng build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Create blog directory structure**

```bash
mkdir -p docs/blog/posts docs/blog/images
touch docs/blog/posts/.gitkeep docs/blog/images/.gitkeep
```

- [ ] **Step 3b: Configure angular.json for dev server access to blog files**

In `angular.json`, find `projects > dalakotilaw > architect > build > options > assets` array and add:

```json
{ "glob": "**/*", "input": "docs/blog", "output": "/blog" }
```

This makes `docs/blog/` accessible at `/blog/` during `ng serve` and `ng build`. Since the deploy script (`shx cp -r dist/dalakotilaw/* docs/`) merges into `docs/`, and `docs/blog/` already exists there as the source of truth, the copied-back `blog/` directory is harmless (identical content).

- [ ] **Step 4: Create initial empty manifest**

Write `docs/blog/index.json`:

```json
[]
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json docs/blog/
git commit -m "chore: install blog dependencies and create blog directory structure"
```

---

## Task 2: Add TypeScript Interfaces and i18n Keys

**Files:**
- Create: `src/app/models/blog.models.ts`
- Modify: `src/assets/i18n/en.json`
- Modify: `src/assets/i18n/hi.json`

- [ ] **Step 1: Create blog model interfaces**

Write `src/app/models/blog.models.ts`:

```typescript
export interface BlogPost {
  slug: string;
  date: string;
  image: string;
  tags: string[];
  en: { title: string; summary: string };
  hi?: { title: string; summary: string };
}

export interface BlogArticle {
  post: BlogPost;
  htmlContent: SafeHtml;
  lang: string;
}
```

Note: `SafeHtml` is imported from `@angular/platform-browser`. This allows the template to use `[innerHTML]` without Angular double-sanitizing the already-sanitized DOMPurify output.

```typescript
// This import is used in blog.models.ts:
import { SafeHtml } from '@angular/platform-browser';
```

- [ ] **Step 2: Add English i18n keys**

Note: `blog.title` already exists in `en.json` — keep it as is. Remove the dead keys `blog.coming_soon` and `blog.message` since the placeholder is being replaced.

Add these keys to `src/assets/i18n/en.json` (before the closing `}`):

```json
"home.blog.title": "Latest Articles",
"home.blog.view_all": "View All Articles",
"blog.back": "Back to Blog",
"blog.read_more": "Read More",
"blog.fallback_notice": "This article is not yet available in the selected language",
"blog.no_posts": "No articles yet. Check back soon.",
"blog.loading": "Loading article...",
"blog.not_found": "Article not found"
```

- [ ] **Step 3: Add Hindi i18n keys**

Add these keys to `src/assets/i18n/hi.json` (before the closing `}`):

```json
"home.blog.title": "नवीनतम लेख",
"home.blog.view_all": "सभी लेख देखें",
"blog.back": "ब्लॉग पर वापस जाएँ",
"blog.read_more": "और पढ़ें",
"blog.fallback_notice": "यह लेख चयनित भाषा में अभी उपलब्ध नहीं है",
"blog.no_posts": "अभी कोई लेख नहीं है। कृपया बाद में देखें।",
"blog.loading": "लेख लोड हो रहा है...",
"blog.not_found": "लेख नहीं मिला"
```

- [ ] **Step 4: Commit**

```bash
git add src/app/models/blog.models.ts src/assets/i18n/en.json src/assets/i18n/hi.json
git commit -m "feat: add blog TypeScript interfaces and i18n keys"
```

---

## Task 3: Create BlogService

**Files:**
- Create: `src/app/services/blog.service.ts`

- [ ] **Step 1: Write BlogService**

Write `src/app/services/blog.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, catchError, map } from 'rxjs';
import { marked } from 'marked';
import * as DOMPurify from 'dompurify';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogPost, BlogArticle } from '../models/blog.models';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly manifestUrl = 'blog/index.json';
  private readonly postsPath = 'blog/posts';
  private readonly imagesPath = 'blog/images';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.manifestUrl).pipe(
      catchError(() => of([]))
    );
  }

  getPost(slug: string, lang: string): Observable<BlogArticle> {
    return this.getPosts().pipe(
      map(posts => posts.find(p => p.slug === slug)),
      switchMap(post => {
        if (!post) {
          throw new Error('Post not found');
        }
        const url = `${this.postsPath}/${slug}.${lang}.md`;
        return this.http.get(url, { responseType: 'text' }).pipe(
          map(markdown => this.parseMarkdown(markdown, post, lang)),
          catchError(() => {
            if (lang !== 'en') {
              return this.http.get(`${this.postsPath}/${slug}.en.md`, { responseType: 'text' }).pipe(
                map(markdown => this.parseMarkdown(markdown, post, 'en')),
              );
            }
            throw new Error('Post not found');
          })
        );
      })
    );
  }

  getImageUrl(filename: string): string {
    return `${this.imagesPath}/${filename}`;
  }

  private parseMarkdown(raw: string, post: BlogPost, lang: string): BlogArticle {
    const body = this.stripFrontmatter(raw);
    const html = marked.parse(body) as string;
    const clean = DOMPurify.sanitize(html);
    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(clean);
    return { post, htmlContent: safeHtml, lang };
  }

  private stripFrontmatter(markdown: string): string {
    const match = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
    return match ? markdown.slice(match[0].length) : markdown;
  }
}
```

- [ ] **Step 2: Verify build**

```bash
ng build
```

Expected: Build succeeds. The `import * as DOMPurify from 'dompurify'` syntax is used for CJS compatibility with Angular 16's webpack build.

- [ ] **Step 3: Commit**

```bash
git add src/app/services/blog.service.ts
git commit -m "feat: add BlogService for fetching and rendering blog posts"
```

---

## Task 4: Build Blog Listing Page

**Files:**
- Modify: `src/app/components/blog/blog.component.ts`
- Modify: `src/app/components/blog/blog.component.html`
- Modify: `src/app/components/blog/blog.component.css`

- [ ] **Step 1: Update blog component class**

Replace `src/app/components/blog/blog.component.ts` with:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { TranslationService } from '../../services/translation.service';
import { BlogPost } from '../../models/blog.models';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, OnDestroy {
  posts: BlogPost[] = [];
  currentLang = 'en';
  private langSub!: Subscription;

  constructor(
    private blogService: BlogService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.blogService.getPosts().subscribe(posts => this.posts = posts);
    this.langSub = this.translationService.lang$.subscribe(
      lang => this.currentLang = lang
    );
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  getTitle(post: BlogPost): string {
    if (this.currentLang === 'hi' && post.hi) return post.hi.title;
    return post.en.title;
  }

  getSummary(post: BlogPost): string {
    if (this.currentLang === 'hi' && post.hi) return post.hi.summary;
    return post.en.summary;
  }

  getImageUrl(post: BlogPost): string {
    return this.blogService.getImageUrl(post.image);
  }
}
```

- [ ] **Step 2: Write blog listing template**

Replace `src/app/components/blog/blog.component.html` with:

```html
<section class="page-header">
  <div class="container">
    <h1>{{ 'blog.title' | translate }}</h1>
  </div>
</section>

<section class="section" *ngIf="posts.length > 0">
  <div class="container">
    <div class="row g-4">
      <div *ngFor="let post of posts" class="col-12 col-md-6 col-lg-4">
        <a [routerLink]="['/blog', post.slug]" class="blog-card-link">
          <div class="card blog-card">
            <img [src]="getImageUrl(post)" [alt]="getTitle(post)" class="card-img-top blog-card-img">
            <div class="card-body">
              <div class="blog-card-meta">
                <span class="blog-card-date">{{ post.date }}</span>
                <span *ngFor="let tag of post.tags" class="blog-card-tag">{{ tag }}</span>
              </div>
              <h5 class="card-title">{{ getTitle(post) }}</h5>
              <p class="card-text text-muted">{{ getSummary(post) }}</p>
              <span class="blog-read-more">{{ 'blog.read_more' | translate }} &rarr;</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</section>

<section class="section text-center" *ngIf="posts.length === 0">
  <div class="container">
    <p class="text-muted">{{ 'blog.no_posts' | translate }}</p>
  </div>
</section>
```

- [ ] **Step 3: Write blog listing styles**

Replace `src/app/components/blog/blog.component.css` with:

```css
.blog-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.blog-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  height: 100%;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.blog-card-img {
  height: 200px;
  object-fit: cover;
}

.blog-card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.blog-card-date {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.blog-card-tag {
  font-size: 0.7rem;
  background-color: var(--bg-warm);
  color: var(--primary-color);
  padding: 0.1rem 0.5rem;
  border-radius: 3px;
  text-transform: capitalize;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.9rem;
  line-height: 1.5;
}

.blog-read-more {
  color: var(--accent-color);
  font-weight: 500;
  font-size: 0.85rem;
}

@media (max-width: 576px) {
  .blog-card-img {
    height: 160px;
  }
}
```

- [ ] **Step 4: Verify build**

```bash
ng build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/blog/
git commit -m "feat: replace blog placeholder with listing page"
```

---

## Task 5: Create Blog Article Page

**Files:**
- Create: `src/app/components/blog-post/blog-post.component.ts`
- Create: `src/app/components/blog-post/blog-post.component.html`
- Create: `src/app/components/blog-post/blog-post.component.css`
- Modify: `src/app/app.module.ts:30-39`
- Modify: `src/app/app-routing.module.ts:10-38`

- [ ] **Step 1: Create BlogPostComponent class**

Write `src/app/components/blog-post/blog-post.component.ts`:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { TranslationService } from '../../services/translation.service';
import { BlogArticle } from '../../models/blog.models';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit, OnDestroy {
  article: BlogArticle | null = null;
  loading = true;
  error = false;
  isFallback = false;
  private slug = '';
  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    public blogService: BlogService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    // lang$ is a BehaviorSubject — emits current value immediately, so no separate loadArticle call needed
    this.subs.push(
      this.translationService.lang$.subscribe(lang => {
        if (this.slug) {
          this.loadArticle(lang);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  getTitle(): string {
    if (!this.article) return '';
    const lang = this.article.lang;
    const post = this.article.post;
    if (lang === 'hi' && post.hi) return post.hi.title;
    return post.en.title;
  }

  private loadArticle(lang: string): void {
    this.loading = true;
    this.error = false;
    this.isFallback = false;

    this.blogService.getPost(this.slug, lang).subscribe({
      next: (article) => {
        this.article = article;
        this.isFallback = article.lang !== lang;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
```

- [ ] **Step 2: Create article template**

Write `src/app/components/blog-post/blog-post.component.html`:

```html
<!-- Loading -->
<section class="section text-center" *ngIf="loading">
  <div class="container">
    <p class="text-muted">{{ 'blog.loading' | translate }}</p>
  </div>
</section>

<!-- Error -->
<section class="section text-center" *ngIf="error && !loading">
  <div class="container">
    <h2>{{ 'blog.not_found' | translate }}</h2>
    <a routerLink="/blog" class="btn btn-outline-accent mt-3">{{ 'blog.back' | translate }}</a>
  </div>
</section>

<!-- Article -->
<ng-container *ngIf="article && !loading && !error">
  <div class="article-hero">
    <img [src]="blogService.getImageUrl(article.post.image)" [alt]="getTitle()" class="article-hero-img">
  </div>

  <section class="section">
    <div class="container">
      <a routerLink="/blog" class="article-back">&larr; {{ 'blog.back' | translate }}</a>

      <div class="article-header">
        <h1 class="article-title">{{ getTitle() }}</h1>
        <div class="article-meta">
          <span class="article-date">{{ article.post.date }}</span>
          <span *ngFor="let tag of article.post.tags" class="article-tag">{{ tag }}</span>
        </div>
      </div>

      <div *ngIf="isFallback" class="article-fallback-notice">
        {{ 'blog.fallback_notice' | translate }}
      </div>

      <div class="article-body" [innerHTML]="article.htmlContent"></div>
    </div>
  </section>
</ng-container>
```

- [ ] **Step 3: Create article styles**

Write `src/app/components/blog-post/blog-post.component.css`:

```css
.article-hero {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
}

.article-hero-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.article-back {
  display: inline-block;
  color: var(--accent-color);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.article-back:hover {
  text-decoration: underline;
}

.article-header {
  margin-bottom: 2rem;
}

.article-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.75rem;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.article-date {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.article-tag {
  font-size: 0.75rem;
  background-color: var(--bg-warm);
  color: var(--primary-color);
  padding: 0.15rem 0.6rem;
  border-radius: 3px;
  text-transform: capitalize;
}

.article-fallback-notice {
  background-color: var(--bg-warm);
  border-left: 4px solid var(--accent-color);
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-body);
}

.article-body {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-body);
  max-width: 800px;
}

.article-body h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.article-body h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-dark);
}

.article-body p {
  margin-bottom: 1rem;
}

.article-body img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1rem 0;
}

.article-body ul, .article-body ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.article-body li {
  margin-bottom: 0.5rem;
}

.article-body blockquote {
  border-left: 4px solid var(--accent-color);
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background-color: var(--bg-light);
  font-style: italic;
}

@media (max-width: 576px) {
  .article-hero-img {
    height: 200px;
  }
}
```

- [ ] **Step 4: Register component in AppModule**

In `src/app/app.module.ts`, add import at the top (after line 26):

```typescript
import { BlogPostComponent } from './components/blog-post/blog-post.component';
```

Add `BlogPostComponent` to the `declarations` array (after `BlogComponent` on line 35):

```typescript
BlogPostComponent,
```

- [ ] **Step 5: Update routing**

In `src/app/app-routing.module.ts`, add import at top (after line 5):

```typescript
import { BlogPostComponent } from './components/blog-post/blog-post.component';
```

Replace the blog route block (lines 19-22) with:

```typescript
  {
    path: "blog",
    component: BlogComponent,
    pathMatch: 'full'
  },
  {
    path: "blog/:slug",
    component: BlogPostComponent
  },
```

- [ ] **Step 6: Verify build**

```bash
ng build
```

Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/app/components/blog-post/ src/app/app.module.ts src/app/app-routing.module.ts
git commit -m "feat: add blog article page with routing"
```

---

## Task 6: Add Latest Articles to Home Page

**Files:**
- Modify: `src/app/components/home/home.component.ts:1-32`
- Modify: `src/app/components/home/home.component.html:28-29`
- Modify: `src/app/components/home/home.component.css`

- [ ] **Step 1: Update home component class**

In `src/app/components/home/home.component.ts`, add imports at top:

```typescript
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { TranslationService } from '../../services/translation.service';
import { BlogPost } from '../../models/blog.models';
```

Update the class to implement `OnInit` and `OnDestroy`:

```typescript
export class HomeComponent implements OnInit, OnDestroy {
  practiceAreas: PracticeArea[] = [
    // ... existing practice areas unchanged ...
  ];

  latestPosts: BlogPost[] = [];
  currentLang = 'en';
  private langSub!: Subscription;

  constructor(
    private router: Router,
    private blogService: BlogService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.blogService.getPosts().subscribe(
      posts => this.latestPosts = posts.slice(0, 3)
    );
    this.langSub = this.translationService.lang$.subscribe(
      lang => this.currentLang = lang
    );
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  navigateToPractice(id: string): void {
    this.router.navigate(['/practices'], { fragment: id });
  }

  getPostTitle(post: BlogPost): string {
    if (this.currentLang === 'hi' && post.hi) return post.hi.title;
    return post.en.title;
  }

  getPostSummary(post: BlogPost): string {
    if (this.currentLang === 'hi' && post.hi) return post.hi.summary;
    return post.en.summary;
  }

  getPostImageUrl(post: BlogPost): string {
    return this.blogService.getImageUrl(post.image);
  }
}
```

- [ ] **Step 2: Add latest articles section to template**

In `src/app/components/home/home.component.html`, insert this block between the closing `</section>` of practice area cards (line 28) and the `<!-- CTA Section -->` comment (line 30):

```html

<!-- Latest Articles -->
<section class="section section-dark" *ngIf="latestPosts.length > 0">
  <div class="container">
    <h2 class="text-center mb-4">{{ 'home.blog.title' | translate }}</h2>
    <div class="row g-3">
      <div *ngFor="let post of latestPosts" class="col-12 col-md-6 col-lg-4">
        <a [routerLink]="['/blog', post.slug]" class="blog-card-link">
          <div class="card blog-card-sm">
            <img [src]="getPostImageUrl(post)" [alt]="getPostTitle(post)" class="card-img-top blog-card-sm-img">
            <div class="card-body p-3">
              <div class="blog-card-sm-date">{{ post.date }}</div>
              <h6 class="blog-card-sm-title">{{ getPostTitle(post) }}</h6>
              <p class="blog-card-sm-summary">{{ getPostSummary(post) }}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="text-center mt-4">
      <a routerLink="/blog" class="btn btn-outline-accent">{{ 'home.blog.view_all' | translate }}</a>
    </div>
  </div>
</section>

```

- [ ] **Step 3: Add blog card styles to home component CSS**

Append to `src/app/components/home/home.component.css` (before the `@media` block):

```css
.blog-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}
.blog-card-sm {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  height: 100%;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.blog-card-sm:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
.blog-card-sm-img {
  height: 140px;
  object-fit: cover;
}
.blog-card-sm-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
}
.blog-card-sm-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.3rem;
  line-height: 1.3;
}
.blog-card-sm-summary {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.4;
  margin-bottom: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

Update the existing `@media (max-width: 576px)` block to include:

```css
@media (max-width: 576px) {
  .hero-section { min-height: 50vh; }
  .hero-overlay { padding: 3rem 0; }
  .blog-card-sm-img { height: 120px; }
}
```

- [ ] **Step 4: Verify build**

```bash
ng build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/home/
git commit -m "feat: add latest articles section to home page"
```

---

## Task 7: Create GitHub Action and Manifest Generator Script

**Files:**
- Create: `scripts/generate-blog-manifest.js`
- Create: `.github/workflows/blog-manifest.yml`

- [ ] **Step 1: Write manifest generator script**

Write `scripts/generate-blog-manifest.js`:

```javascript
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '..', 'docs', 'blog', 'posts');
const OUTPUT = path.join(__dirname, '..', 'docs', 'blog', 'index.json');
const REQUIRED_FIELDS = ['slug', 'date', 'title', 'summary', 'image'];

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.writeFileSync(OUTPUT, '[]');
    console.log('No posts directory found. Wrote empty manifest.');
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const grouped = {};

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);

    const missing = REQUIRED_FIELDS.filter(f => !data[f]);
    if (missing.length > 0) {
      console.warn(`WARNING: Skipping ${file} — missing fields: ${missing.join(', ')}`);
      continue;
    }

    const langMatch = file.match(/\.(\w+)\.md$/);
    const lang = langMatch ? langMatch[1] : 'en';
    const slug = data.slug;

    if (!grouped[slug]) {
      grouped[slug] = {
        slug,
        date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : String(data.date),
        image: data.image,
        tags: data.tags || [],
      };
    }

    grouped[slug][lang] = {
      title: data.title,
      summary: data.summary,
    };
  }

  const manifest = Object.values(grouped)
    .filter(entry => entry.en) // must have at least English
    .sort((a, b) => b.date.localeCompare(a.date));

  fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2));
  console.log(`Generated manifest with ${manifest.length} post(s).`);
}

main();
```

- [ ] **Step 2: Test the script locally**

```bash
node scripts/generate-blog-manifest.js
```

Expected: `Generated manifest with 0 post(s).` (no posts yet). Check that `docs/blog/index.json` contains `[]`.

- [ ] **Step 3: Write GitHub Action workflow**

Write `.github/workflows/blog-manifest.yml`:

```yaml
name: Generate Blog Manifest

on:
  push:
    branches: [master]
    paths: ['docs/blog/posts/**']

jobs:
  generate-manifest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install gray-matter
        run: npm install gray-matter

      - name: Generate manifest
        run: node scripts/generate-blog-manifest.js

      - name: Commit manifest
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: auto-generate blog manifest [skip ci]"
          file_pattern: docs/blog/index.json
```

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-blog-manifest.js .github/workflows/blog-manifest.yml
git commit -m "feat: add blog manifest generator and GitHub Action"
```

---

## Task 8: Add Seed Blog Posts and End-to-End Verification

**Files:**
- Create: 5 blog posts (EN + HI pairs) in `docs/blog/posts/`
- Copy: 5 hero images to `docs/blog/images/`
- Generate: `docs/blog/index.json`

The seed blog posts are sourced from `C:\Users\praty\Downloads\blog\`. Each post needs frontmatter added and the files renamed to match the `{slug}.{lang}.md` convention.

- [ ] **Step 1: Copy and rename hero images**

```bash
cp "C:/Users/praty/Downloads/blog/CivVsCrim.jpg" docs/blog/images/civil-vs-criminal.jpg
cp "C:/Users/praty/Downloads/blog/TitleSearch.jpg" docs/blog/images/title-search.jpg
cp "C:/Users/praty/Downloads/blog/chargeSheet.jpg" docs/blog/images/charge-sheet-response.jpg
cp "C:/Users/praty/Downloads/blog/docMistakes.jpg" docs/blog/images/documentation-mistakes.jpg
cp "C:/Users/praty/Downloads/blog/recovery.jpg" docs/blog/images/recovery-action-guide.jpg
```

- [ ] **Step 2: Format and place all blog posts with frontmatter**

For each post, add YAML frontmatter and save to `docs/blog/posts/`. Remove any trailing reference link definitions (`[1]: ...`) from the markdown body — these are not valid in the rendered context. The existing `#` heading becomes redundant with the `title` field so remove it from the body.

The 5 post pairs to create:

**Post 1: civil-vs-criminal** (tags: civil, criminal)
- `docs/blog/posts/civil-vs-criminal.en.md` — from `CivVsCrim.en.md`
- `docs/blog/posts/civil-vs-criminal.hi.md` — from `CivVsCrim.hi.md`
- Frontmatter EN: title "Civil Dispute or Criminal Case? Understanding the Difference", date 2026-03-20, summary "Not every serious dispute is a criminal case. Learn how to correctly classify financial and property conflicts.", image civil-vs-criminal.jpg
- Frontmatter HI: title "दीवानी विवाद या आपराधिक मामला? अंतर को समझना", date 2026-03-20, same slug/image/tags

**Post 2: title-search** (tags: property, banking)
- `docs/blog/posts/title-search.en.md` — from `TitleSearch.en.md`
- `docs/blog/posts/title-search.hi.md` — from `TitleSearch.hi.md`
- Frontmatter EN: title "Why Title Search Matters Before Mortgage, Purchase, or Loan Sanction", date 2026-03-18, summary "Title scrutiny is one of the most important risk-control steps in any property transaction or mortgage creation.", image title-search.jpg
- Frontmatter HI: title "बंधक, खरीद, या ऋण स्वीकृति से पहले टाइटल सर्च क्यों महत्वपूर्ण है", date 2026-03-18, same slug/image/tags

**Post 3: charge-sheet-response** (tags: banking, disciplinary)
- `docs/blog/posts/charge-sheet-response.en.md` — from `chargeSheet.en.md`
- `docs/blog/posts/charge-sheet-response.hi.md` — from `chargeSheet.hi.md`
- Frontmatter EN: title "What to Do After Receiving a Charge Sheet or Show Cause Notice", date 2026-03-15, summary "A practical guide for bank officers on how to respond to disciplinary proceedings carefully and effectively.", image charge-sheet-response.jpg
- Frontmatter HI: title "चार्जशीट या शो कॉज नोटिस मिलने पर क्या करें", date 2026-03-15, same slug/image/tags

**Post 4: documentation-mistakes** (tags: banking, recovery)
- `docs/blog/posts/documentation-mistakes.en.md` — from `docMistakes.en.md`
- `docs/blog/posts/documentation-mistakes.hi.md` — from `docMistakes.hi.md`
- Frontmatter EN: title "Common Documentation Mistakes in Banking and Recovery Matters", date 2026-03-12, summary "In banking and recovery work, documents do not merely support a case — they often become the case.", image documentation-mistakes.jpg
- Frontmatter HI: title "बैंकिंग और रिकवरी मामलों में आम दस्तावेजी गलतियाँ", date 2026-03-12, same slug/image/tags

**Post 5: recovery-action-guide** (tags: banking, recovery, civil)
- `docs/blog/posts/recovery-action-guide.en.md` — from `recovery.en.md`
- `docs/blog/posts/recovery-action-guide.hi.md` — from `recovery.hi.md`
- Frontmatter EN: title "Borrowers, Guarantors, and Recovery Action: A Practical Guide", date 2026-03-10, summary "A practical guide to understanding rights, duties, and common misunderstandings in banking recovery.", image recovery-action-guide.jpg
- Frontmatter HI: title "उधारकर्ता, गारंटर, और रिकवरी कार्रवाई: एक व्यावहारिक मार्गदर्शिका", date 2026-03-10, same slug/image/tags

- [ ] **Step 3: Generate the manifest locally**

```bash
node scripts/generate-blog-manifest.js
```

Expected: `Generated manifest with 5 post(s).`

- [ ] **Step 4: Verify the generated manifest**

Read `docs/blog/index.json` and confirm it contains all 5 posts sorted by date (newest first), each with `slug`, `date`, `image`, `tags`, `en`, and `hi` fields.

- [ ] **Step 5: Run the dev server and test**

```bash
ng serve
```

Open `http://localhost:4200` and verify:
1. Home page shows the "Latest Articles" section with 3 cards (most recent posts)
2. Blog cards have hero image thumbnails, titles, dates, and summaries
3. Blog cards are visually smaller than practice area cards
4. Clicking a card navigates to `/blog/{slug}`
5. Article page shows hero image, title, date, tags, and rendered markdown
6. `/blog` shows the full listing with all 5 posts
7. Language toggle switches title/summary on listing between EN and HI
8. On article page, language toggle re-fetches the Hindi markdown version

- [ ] **Step 6: Commit**

```bash
git add docs/blog/
git commit -m "feat: add seed blog posts with bilingual content"
```

---

## Task 9: Final Build and Deployment Verification

**Files:**
- Modify: `docs/` (deployment build output)

- [ ] **Step 1: Run the full deploy script**

```bash
npm run deploy
```

Expected: Build succeeds, output copied to `docs/`, `404.html` created.

- [ ] **Step 2: Verify blog files survive deployment**

Check that these files still exist after deploy (the deploy script copies `dist/` into `docs/` but should not delete `docs/blog/`):

```bash
ls docs/blog/index.json
ls docs/blog/posts/understanding-property-rights.en.md
ls docs/blog/images/property-rights-hero.jpg
```

If the deploy script (`shx cp -r dist/dalakotilaw/* docs/`) overwrites `docs/blog/`, you need to update the deploy script to preserve it. Adjust the `deploy` script in `package.json` to:

```json
"deploy": "ng build && shx cp -r dist/dalakotilaw/* docs/ && shx cp docs/index.html docs/404.html"
```

The `shx cp -r` copies files **into** `docs/` without deleting existing content, so `docs/blog/` should survive. Verify this.

- [ ] **Step 3: Verify CNAME file survives**

```bash
cat docs/CNAME
```

Expected: `dalakotilaw.com`

- [ ] **Step 4: Commit if any deployment adjustments were needed**

```bash
git add -A docs/ package.json
git commit -m "build: production build with blog feature"
```
