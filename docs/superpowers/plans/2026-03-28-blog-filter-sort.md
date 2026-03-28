# Blog Filter & Sort Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add tag filtering and date sorting to the blog listing page with URL query parameter sync.

**Architecture:** All filtering/sorting is client-side in `BlogComponent`. A dropdown multi-select filter lets users pick tags (OR logic). A sort dropdown switches between newest/oldest. URL query params reflect state for bookmarkability. No new services, no API changes.

**Tech Stack:** Angular 16, ActivatedRoute/Router for URL params, component-scoped CSS with site CSS variables.

**Spec:** `docs/superpowers/specs/2026-03-28-blog-filter-sort-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/app/components/blog/blog.component.ts` | Filter/sort state, URL sync, filtering logic |
| Modify | `src/app/components/blog/blog.component.html` | Filter bar UI, overlay, empty state |
| Modify | `src/app/components/blog/blog.component.css` | Filter bar styling, responsive layout |

---

### Task 1: Add filter/sort state and logic to BlogComponent

**Files:**
- Modify: `src/app/components/blog/blog.component.ts`

- [ ] **Step 1: Add imports and constructor injections**

Add `ActivatedRoute` and `Router` imports and inject them. Replace the full file with:

```typescript
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  filteredPosts: BlogPost[] = [];
  currentLang = 'en';
  allTags: string[] = [];
  selectedTags = new Set<string>();

  get selectedTagsList(): string[] {
    return [...this.selectedTags].sort();
  }
  sortOrder: 'newest' | 'oldest' = 'newest';
  dropdownOpen = false;

  private langSub!: Subscription;
  private postsSub!: Subscription;

  constructor(
    private blogService: BlogService,
    private translationService: TranslationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postsSub = this.blogService.getPosts().subscribe(posts => {
      this.posts = posts;
      this.allTags = [...new Set(posts.flatMap(p => p.tags))].sort();
      this.readFromUrl();
      this.applyFilters();
    });
    this.langSub = this.translationService.lang$.subscribe(
      lang => this.currentLang = lang
    );
  }

  ngOnDestroy(): void {
    this.postsSub?.unsubscribe();
    this.langSub?.unsubscribe();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.dropdownOpen = false;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  toggleTag(tag: string): void {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
    this.applyFilters();
    this.syncToUrl();
  }

  clearFilters(): void {
    this.selectedTags.clear();
    this.applyFilters();
    this.syncToUrl();
  }

  setSortOrder(order: string): void {
    this.sortOrder = order === 'oldest' ? 'oldest' : 'newest';
    this.applyFilters();
    this.syncToUrl();
  }

  getTitle(post: BlogPost): string {
    if (this.currentLang === 'hi' && post.hi) return post.hi.title;
    return post.en.title;
  }

  getSummary(post: BlogPost): string {
    if (this.currentLang === 'hi' && post.hi) return post.hi.summary;
    return post.en.summary;
  }

  getImageUrl(post: BlogPost, format?: 'jpg' | 'webp'): string {
    return this.blogService.getImageUrl(post.image, format);
  }

  private applyFilters(): void {
    let result = this.posts;

    if (this.selectedTags.size > 0) {
      result = result.filter(post =>
        post.tags.some(tag => this.selectedTags.has(tag))
      );
    }

    result = [...result].sort((a, b) => {
      return this.sortOrder === 'newest'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date);
    });

    this.filteredPosts = result;
  }

  private syncToUrl(): void {
    const queryParams: Record<string, string | null> = {};

    if (this.selectedTags.size > 0) {
      queryParams.tags = [...this.selectedTags].sort().join(',');
    } else {
      queryParams.tags = null;
    }

    if (this.sortOrder === 'oldest') {
      queryParams.sort = 'oldest';
    } else {
      queryParams.sort = null;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private readFromUrl(): void {
    const params = this.route.snapshot.queryParamMap;
    let hadInvalid = false;

    const tagsParam = params.get('tags');
    if (tagsParam) {
      tagsParam.split(',').forEach(tag => {
        if (this.allTags.includes(tag)) {
          this.selectedTags.add(tag);
        } else {
          hadInvalid = true;
        }
      });
    }

    const sortParam = params.get('sort');
    if (sortParam === 'oldest') {
      this.sortOrder = 'oldest';
    } else if (sortParam) {
      hadInvalid = true;
    }

    // Only update URL if invalid params were present
    if (hadInvalid) {
      this.syncToUrl();
    }
  }
}
```

- [ ] **Step 2: Verify the app compiles**

Run: `npx ng build --configuration development 2>&1 | tail -5`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/blog/blog.component.ts
git commit -m "feat: add filter/sort state and logic to blog component"
```

---

### Task 2: Add filter bar HTML to blog template

**Files:**
- Modify: `src/app/components/blog/blog.component.html`

- [ ] **Step 1: Replace the full template**

Replace `src/app/components/blog/blog.component.html` with:

```html
<section class="page-header">
  <div class="container">
    <h1>{{ 'blog.title' | translate }}</h1>
    <div class="separator"><div class="sep-line"></div><div class="sep-dot"></div><div class="sep-diamond"></div><div class="sep-dot"></div><div class="sep-line"></div></div>
  </div>
</section>

<section class="section" *ngIf="posts.length > 0">
  <div class="container">

    <!-- Filter & Sort Bar -->
    <div class="blog-filter-bar">
      <div class="filter-controls">
        <!-- Filter Dropdown -->
        <div class="filter-dropdown-wrapper">
          <button class="filter-dropdown-btn" (click)="toggleDropdown()">
            <span class="filter-dropdown-icon">&#9662;</span>
            Filter by topic
            <span class="filter-badge" *ngIf="selectedTags.size > 0">{{ selectedTags.size }}</span>
          </button>

          <!-- Overlay to catch click-outside -->
          <div class="filter-overlay" *ngIf="dropdownOpen" (click)="closeDropdown()"></div>

          <!-- Dropdown panel -->
          <div class="filter-dropdown" *ngIf="dropdownOpen">
            <label *ngFor="let tag of allTags" class="filter-dropdown-item" (click)="toggleTag(tag); $event.stopPropagation()">
              <input type="checkbox" [checked]="selectedTags.has(tag)">
              <span class="filter-dropdown-label">{{ tag }}</span>
            </label>
            <div class="filter-dropdown-footer" *ngIf="selectedTags.size > 0">
              <button class="filter-clear-btn" (click)="clearFilters(); closeDropdown()">Clear all</button>
            </div>
          </div>
        </div>

        <!-- Active filter chips -->
        <div class="filter-chips" *ngIf="selectedTagsList.length > 0">
          <span *ngFor="let tag of selectedTagsList" class="filter-chip">
            {{ tag }}
            <button class="filter-chip-remove" (click)="toggleTag(tag)">×</button>
          </span>
        </div>
      </div>

      <!-- Sort Dropdown -->
      <div class="sort-control">
        <label class="sort-label">Sort:</label>
        <select class="sort-select" [ngModel]="sortOrder" (ngModelChange)="setSortOrder($event)">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
    </div>

    <!-- Card Grid -->
    <div class="row g-4" *ngIf="filteredPosts.length > 0">
      <div *ngFor="let post of filteredPosts" class="col-12 col-md-6 col-lg-4">
        <a [routerLink]="['/blog', post.slug]" class="blog-card-link">
          <div class="card blog-card">
            <picture>
              <source [srcset]="getImageUrl(post, 'webp')" type="image/webp">
              <img [src]="getImageUrl(post, 'jpg')" [alt]="getTitle(post)" loading="lazy" class="card-img-top blog-card-img">
            </picture>
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

    <!-- Empty state -->
    <div class="blog-empty-state" *ngIf="filteredPosts.length === 0">
      <p class="text-muted">No posts found for the selected topics.</p>
      <button class="filter-clear-link" (click)="clearFilters()">Clear filters</button>
    </div>

  </div>
</section>

<section class="section text-center" *ngIf="posts.length === 0">
  <div class="container">
    <p class="text-muted">{{ 'blog.no_posts' | translate }}</p>
  </div>
</section>
```

- [ ] **Step 2: Verify the app compiles**

Run: `npx ng build --configuration development 2>&1 | tail -5`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/blog/blog.component.html
git commit -m "feat: add filter bar and sort controls to blog template"
```

---

### Task 3: Add filter bar CSS

**Files:**
- Modify: `src/app/components/blog/blog.component.css`

- [ ] **Step 1: Append filter/sort styles to the CSS file**

Add the following to the end of `src/app/components/blog/blog.component.css`:

```css
/* ── Filter & Sort Bar ── */

.blog-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex: 1;
}

.filter-dropdown-wrapper {
  position: relative;
}

.filter-dropdown-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: var(--text-dark);
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-dropdown-btn:hover {
  border-color: var(--primary-color);
}

.filter-dropdown-icon {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.filter-badge {
  background: var(--accent-color);
  color: var(--primary-color);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.45rem;
  border-radius: 10px;
  min-width: 1.2rem;
  text-align: center;
}

.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 10;
}

.filter-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.15s;
  margin: 0;
}

.filter-dropdown-item:hover {
  background: var(--bg-warm, #f8f7f4);
}

.filter-dropdown-item input[type="checkbox"] {
  accent-color: var(--primary-color);
  cursor: pointer;
}

.filter-dropdown-label {
  text-transform: capitalize;
}

.filter-dropdown-footer {
  border-top: 1px solid #eee;
  margin-top: 0.25rem;
  padding: 0.4rem 1rem 0.2rem;
}

.filter-clear-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
}

.filter-clear-btn:hover {
  color: var(--primary-color);
}

/* ── Filter Chips ── */

.filter-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  background: var(--primary-color);
  color: white;
  border-radius: 1rem;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.filter-chip-remove {
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 0.1rem;
}

.filter-chip-remove:hover {
  color: white;
}

/* ── Sort Control ── */

.sort-control {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.sort-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.sort-select {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.8rem;
  background: white;
  color: var(--text-dark);
  cursor: pointer;
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* ── Empty State ── */

.blog-empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.blog-empty-state p {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.filter-clear-link {
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}

.filter-clear-link:hover {
  color: var(--primary-color);
}

/* ── Responsive ── */

@media (max-width: 768px) {
  .blog-filter-bar {
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-controls {
    width: 100%;
  }

  .sort-control {
    width: 100%;
  }
}
```

- [ ] **Step 2: Verify the app compiles**

Run: `npx ng build --configuration development 2>&1 | tail -5`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/blog/blog.component.css
git commit -m "feat: add filter bar and sort control styles"
```

---

### Task 4: Full build and visual verification

- [ ] **Step 1: Run production build**

Run: `npx ng build 2>&1 | tail -10`

Expected: Build succeeds with no errors.

- [ ] **Step 2: Serve and verify visually**

Run: `npx ng serve`

Open `http://localhost:4200/blog` and verify:
- Filter dropdown opens/closes on click
- Clicking outside or pressing Escape closes the dropdown
- Selecting tags shows chips and filters the card grid
- Deselecting via chip × or dropdown checkbox works
- "Clear all" in dropdown and "Clear filters" in empty state work
- Sort dropdown switches between newest/oldest
- URL updates with `?tags=...&sort=...` params
- Loading `/blog?tags=banking&sort=oldest` applies filters on page load
- Loading `/blog?tags=nonexistent` silently ignores the bad tag
- Mobile layout stacks filter and sort controls

- [ ] **Step 3: Deploy and commit**

```bash
npm run deploy
git add docs/ src/app/components/blog/
git commit -m "feat: add blog tag filtering and date sorting

Dropdown multi-select filter with chips, newest/oldest sort,
URL query param sync for bookmarkable filtered views."
```
