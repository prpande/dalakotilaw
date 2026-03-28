# Blog Sorting and Filtering Design

**Date:** 2026-03-28
**Scope:** Blog listing page (`/blog`) only

## Problem

With 15 blog posts (and growing) across 6 topic tags, the blog page has no way to filter by topic or change sort order. Visitors must scroll through all posts to find relevant content.

## Solution

Add a dropdown multi-select tag filter and sort control above the blog card grid. All filtering and sorting happens client-side. Filter/sort state is reflected in URL query parameters for bookmarkability.

## 1. Filter/Sort UI

### Filter Dropdown

A "Filter by topic" button that opens a checklist dropdown:
- Each tag appears as a checkbox row in the dropdown
- Badge on the button shows count of active filters (hidden when 0)
- Selected tags appear as removable chips next to the button (click the × to remove)
- "Clear all" link at the bottom of the dropdown when filters are active
- Dropdown closes on click outside
- Tags are derived dynamically from loaded posts — not hardcoded. New tags appear automatically when posts use them.

### Sort Dropdown

A native `<select>` with two options:
- "Newest first" (default) — descending by date
- "Oldest first" — ascending by date

### Styling

- Active filter chips use `var(--primary-color)` (`#1a2744`) background with white text
- Chip × button and badge use `var(--accent-color)` (`#fcc900`)
- Inactive/outline elements use the existing card border style
- Dropdown background white with subtle box-shadow, consistent with site's card styling

### Responsive Layout

- **Desktop:** Filter dropdown and chips left-aligned, sort dropdown right-aligned, all on one row
- **Mobile:** Filter dropdown full-width on top row, sort dropdown below. Chips wrap naturally between them.

## 2. Filtering & Sorting Logic

All filtering happens client-side in `BlogComponent` — no API calls needed since all posts are loaded from `index.json`.

- **Filter:** When tags are selected, show posts where the post's `tags` array has at least one tag in common with the selected tags (union/OR logic). When no tags are selected, show all posts.
- **Sort:** Compare post `date` strings lexicographically. Dates are ISO 8601 format (`YYYY-MM-DD`) which sorts correctly as strings. "Newest first" = descending, "Oldest first" = ascending. Default: newest first.
- **Pipeline:** Filter first, then sort. The component maintains a `filteredPosts: BlogPost[]` array derived from `posts` whenever filter or sort state changes.
- **Empty state:** If no posts match the selected tags, show "No posts found for the selected topics." message centered in the grid area.

## 3. URL Query Parameters

Filter/sort state synced to the URL via Angular's `Router`:

- **Format:** `/blog?tags=banking,recovery&sort=oldest`
- **`tags` param:** Comma-separated tag values from `index.json`, used directly as URL parameter values. Tags are lowercase single words (e.g., `banking`, `recovery`). If multi-word tags are added in future, they should use hyphens (e.g., `corporate-law`). Omitted when no filters are active (clean default URL).
- **`sort` param:** Value `oldest` when oldest-first is active. Omitted when newest-first (the default).
- **On page load:** Read query params from `ActivatedRoute.queryParamMap`. Validate tags against `allTags` — silently discard unknown tags and update the URL to remove them. If `sort` param has an invalid value, fall back to `'newest'` and strip the invalid param.
- **On filter/sort change:** Update URL via `router.navigate` with `replaceUrl: true` to avoid polluting browser history with every filter click.

## 4. Component Changes

### BlogComponent (`blog.component.ts`)

New state:
- `selectedTags: Set<string>` — currently active tag filters
- `sortOrder: 'newest' | 'oldest'` — current sort direction (default: `'newest'`)
- `filteredPosts: BlogPost[]` — derived from `posts` after filter + sort
- `allTags: string[]` — unique tags extracted from all posts, sorted alphabetically, populated once when posts load
- `dropdownOpen: boolean` — controls dropdown visibility

New constructor injections:
- `ActivatedRoute` — to read query params on load
- `Router` — to update query params on filter/sort change

New methods:
- `toggleTag(tag: string)` — add/remove tag from `selectedTags`, refilter, update URL (used by both dropdown checkboxes and chip × buttons)
- `clearFilters()` — clear all tags, refilter, update URL
- `setSortOrder(order: string)` — update sort, refilter, update URL
- `toggleDropdown()` — open/close the filter dropdown
- `applyFilters()` — private method that filters and sorts `posts` into `filteredPosts`
- `syncToUrl()` — private method that writes current state to query params
- `readFromUrl()` — private method called after posts load (inside the `getPosts` subscribe callback) to hydrate state from query params. Must run after `allTags` is populated so it can validate URL tags.

### BlogComponent Template (`blog.component.html`)

- Add filter/sort controls section between page header and card grid
- Card grid `*ngFor` iterates `filteredPosts` instead of `posts`
- Add empty state `*ngIf` when `filteredPosts.length === 0`
- Click-outside to close: use a transparent overlay `div` behind the dropdown (simpler than `@HostListener`, avoids event propagation issues)
- Escape key closes the dropdown via `@HostListener('document:keydown.escape')`

### BlogComponent CSS (`blog.component.css`)

New styles for:
- `.blog-filter-bar` — flex container for filter + sort controls
- `.filter-dropdown-btn` — the "Filter by topic" trigger button
- `.filter-badge` — count badge on the button
- `.filter-dropdown` — the checklist dropdown panel
- `.filter-chip` — removable tag chips (uses `--primary-color` background)
- `.filter-chip-remove` — × button on chips (uses `--accent-color`)
- `.sort-select` — sort dropdown styling
- `.blog-empty-state` — no-results message
- Responsive breakpoint at `768px` (`md`), consistent with the card grid's `col-md-6` breakpoint

## 5. Dependencies

- `ActivatedRoute` and `Router` from `@angular/router` (already imported in the module)
- No new packages or dependencies required

## Out of Scope

- Text search / full-text filtering
- Pagination
- Filter persistence across sessions (beyond URL)
- Filtering on the home page's "latest 3 posts" section
- Tag management UI (tags come from post frontmatter)
