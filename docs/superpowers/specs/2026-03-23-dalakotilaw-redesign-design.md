# Dalakoti Law Website Redesign — Design Spec

**Date:** 2026-03-23
**Status:** Draft
**Site:** dalakotilaw.com (GitHub Pages, deployed via `docs/` folder)

---

## 1. Overview

Redesign and content population of the Dalakoti Law website — a law firm site built with Angular 16, deployed to GitHub Pages. The site serves potential clients seeking legal representation in banking, civil, criminal, property, and service law matters in India.

### Goals

- Populate all pages with real content (replacing Lorem ipsum placeholders)
- Redesign page layouts with a spacious, sectioned approach
- Add new pages (FAQs)
- Make the site fully responsive (mobile + desktop)
- Plan for bilingual support (English/Hindi) with language toggle
- Replace insecure email integration with Formspree
- Create a CLAUDE.md project configuration file

### Non-Goals (deferred)

- Final color palette and font selection (easy to change later via CSS variables)
- Blog content (placeholder only)
- Hindi content authoring (structure and toggle will be built; translations added later)

---

## 2. Technology Stack

- **Framework:** Angular 16.2.0
- **UI:** Angular Material 16.2.14 + Bootstrap 5.3.3
- **Language:** TypeScript 5.1.3
- **Deployment:** GitHub Pages via `docs/` folder on `master` branch
- **Domain:** dalakotilaw.com (CNAME in `docs/`)
- **Contact Form Backend:** Web3Forms (free tier, 250 submissions/month)

---

## 3. Site Structure & Routing

| Route | Component | Status |
|---|---|---|
| `/home` | HomeComponent | Redesign + content |
| `/about` | AboutComponent | Redesign + content |
| `/practices` | PracticesComponent | Redesign + content |
| `/contact` | ContactComponent | Redesign + content + Formspree |
| `/faqs` | FaqsComponent | **New page** |
| `/blog` | BlogComponent | "Coming Soon" placeholder |
| `**` | Redirect to `/home` | Keep as-is |

**Disclaimer modal** remains unchanged — shown on first visit via DisclaimerService.

### SPA Routing on GitHub Pages

GitHub Pages does not natively support SPA routing — navigating directly to `/about` returns a 404. To fix this:
- Copy `index.html` as `404.html` in the `docs/` folder during the build/deploy step
- GitHub Pages serves `404.html` for unknown paths, which loads the Angular app and the router takes over
- This is the standard, well-proven approach for Angular/React SPAs on GitHub Pages

Additionally, configure `anchorScrolling: 'enabled'` in the Angular router to support fragment-based deep linking (e.g., `/practices#banking`).

---

## 4. Page Designs

### 4.1 Home Page

**Layout (top to bottom):**

1. **Hero Section**
   - Full-width background image (placeholder photo for now, easily swappable)
   - Overlay with firm name, tagline, and primary CTA button ("Schedule a Consultation")
   - Text should be legible over the image (dark overlay or text shadow)

2. **Practice Area Cards**
   - 6 cards in a responsive grid (3 columns desktop, 2 tablet, 1 mobile)
   - Each card shows: practice area name, one-line description, CTA text
   - Clicking a card navigates to `/practices` with a fragment identifier that opens the corresponding accordion (e.g., `/practices#banking`)

3. **About Blurb**
   - Short homepage version of the bio (from `info/AboutMe.md` section 1)
   - "Learn More" link to `/about`

4. **CTA Section**
   - Full-width section encouraging consultation
   - Button linking to `/contact`

**Content source:** `info/AboutMe.md` (shorter homepage version), `info/practice.md` (card data)

### 4.2 About Page

**Layout:**

1. **Header section** with page title
2. **Bio section** — premium luxury-tone version (from `info/AboutMe.md` section 2)
   - Professional, authoritative tone
   - Could include a placeholder headshot area
3. **Qualifications section** — bar enrollments and education (extracted from bio)

**Content source:** `info/AboutMe.md` (premium luxury-tone version)

### 4.3 Practices Page

**Layout:**

1. **Header section** with title "Areas of Practice" and subtitle from `info/practice.md`
2. **Accordion section** — 6 expandable panels, one per practice area
   - Each panel header: practice area name + subtitle
   - Each panel body: full description text (subtitle + detailed description + CTA link). The practices page shows richer content than the home page cards, which only show the one-line summary.
   - Panels are deep-linkable via URL fragment (e.g., `/practices#banking`)
   - When navigated from a home page card, the corresponding accordion opens automatically
   - Uses Angular Material `mat-expansion-panel`

**Practice Areas:**
1. Banking & Financial Matters
2. Recovery, SARFAESI & Cheque Dishonour
3. Disciplinary & Service Law Matters
4. Property, Title Search & Documentation
5. Civil Litigation
6. Criminal Defence & Complaint Matters

**Content source:** `info/practice.md`

### 4.4 Contact Page

**Layout:**

1. **Header section** with page title
2. **Two-column layout** (stacks on mobile):
   - **Left column:** Contact form (Web3Forms integration)
     - Fields: Name, Email, Phone (optional), Subject, Message
     - Submit button
     - Success/error feedback messages
   - **Right column:** Office details
     - Address
     - Phone number
     - Email address
     - Embedded Google Maps iframe (or placeholder)
3. **Note:** Replace current SMTP.js integration entirely with Web3Forms POST

**Security remediation:** Remove hardcoded SMTP credentials from `email.service.ts` and the SMTP.js script dependency. Also remove the `emailService.sendTestEmail()` call in `header.component.ts` that fires on first visit — this coupling must be cleaned up as part of the Formspree migration.

### 4.5 FAQs Page (New)

**Layout:**

1. **Header section** with page title
2. **Category sections** — 6 categories, each with a heading and accordion questions beneath:
   - General Information (5 questions)
   - Legal Fees and Costs (4 questions)
   - Case Process (4 questions)
   - Legal Rights and Confidentiality (3 questions)
   - Practical Questions (4 questions)
   - Practice-Specific Questions (12 questions)
3. Each question is a `mat-expansion-panel` that reveals the answer on click

**Content source:** `info/faqs.md`

### 4.6 Blog Page (Placeholder)

**Layout:**

- Simple centered "Coming Soon" message
- Brief text explaining blog content is on the way
- Optional: link back to home

### 4.7 Disclaimer Modal

**No changes.** Keep current implementation — this is a route-less `MatDialog` triggered by `DisclaimerService` (not a routed page). It remains as-is.

### 4.8 First-Visit Flow (Disclaimer + Language Selection)

On first visit, the user encounters two popups in sequence:
1. **Disclaimer modal** (existing) — must be accepted before proceeding
2. **Language selection popup** — appears after disclaimer is accepted, asks user to choose English or Hindi
   - Default to English if dismissed without choosing
   - Both preferences stored in localStorage independently
   - Returning visitors who have accepted the disclaimer but not chosen a language (e.g., after partial localStorage clear) see only the language popup

---

## 5. Header & Navigation

**Desktop:**
- Sticky header with firm name/logo on the left
- Navigation links on the right: Home, About, Practices, FAQs, Blog, Contact
- Language toggle button (EN/HI) — see Section 7

**Mobile:**
- Hamburger menu icon replacing nav links
- Slide-out or dropdown menu with the same links
- Language toggle accessible within the mobile menu

---

## 6. Footer

**Keep existing footer structure.** Update if needed to include:
- Firm name and tagline
- Key navigation links
- Contact information summary
- Disclaimer/legal notice link

---

## 7. Bilingual Support (English/Hindi)

### Architecture

- **Language toggle** in the header (button showing "EN" or "HI")
- **First-visit popup** — similar to disclaimer modal, asks user to choose preferred language
  - Stores preference in localStorage
  - Can be changed anytime via the header toggle
- **Content strategy:** All translatable strings stored in a translation service or JSON files per language
  - `assets/i18n/en.json` — English strings
  - `assets/i18n/hi.json` — Hindi strings
- **Implementation:** A `TranslationService` that loads the appropriate JSON and provides translated strings via a `translate` pipe (e.g., `{{ 'home.hero.title' | translate }}`). The service loads the selected language JSON via `HttpClient` and caches it.
- **Scope for now:** Build the infrastructure (service, pipe, toggle, popup, JSON structure). Populate English content. Hindi translations to be added later.

### Content ingestion strategy

Content from `info/*.md` files will be **extracted into the i18n JSON files** (`assets/i18n/en.json`, `assets/i18n/hi.json`) as structured keys. This is a one-time manual extraction during implementation — the markdown files serve as the content source of truth during development, but at runtime the app reads from the JSON files. This approach:
- Unifies all content under the translation system
- Makes bilingual support automatic once Hindi JSON is populated
- Avoids runtime markdown parsing dependencies
- Keeps the Angular templates clean with pipe-based string references

### Content that needs translation

- All page content (bios, practice descriptions, FAQs)
- Navigation labels
- UI text (buttons, form labels, placeholders, CTAs)
- Disclaimer modal text

---

## 8. Responsive Design

### Breakpoints

Follow Bootstrap 5 breakpoints already in the project:
- **xs:** < 576px (phones)
- **sm:** >= 576px
- **md:** >= 768px (tablets)
- **lg:** >= 992px (small desktops)
- **xl:** >= 1200px (large desktops)

### Key responsive behaviors

- **Header:** Full nav → hamburger menu below `md`
- **Hero:** Text scales down, image covers viewport width
- **Practice cards:** 3-col → 2-col → 1-col
- **Contact page:** Two columns → stacked single column below `md`
- **Accordions:** Full-width at all breakpoints (naturally responsive)
- **General:** Generous padding on desktop, tighter but still spacious on mobile

---

## 9. Contact Form — Web3Forms Integration

### Why Web3Forms

- Free tier: 250 submissions/month
- No backend required (works with static GitHub Pages hosting)
- Simple access key (not a secret credential — safe for client-side use)
- Spam filtering included
- Simple fetch POST to `https://api.web3forms.com/submit`

### Implementation

1. Add `HttpClientModule` to `app.module.ts` (required for Web3Forms POST and translation JSON loading)
2. Replace current `EmailService` with a `ContactService` that POSTs to `https://api.web3forms.com/submit` with access key and form data
3. Remove SMTP.js script from `index.html`, delete `email.service.ts`, and remove the `sendTestEmail()` call from `header.component.ts`
4. Handle form states: idle, submitting (loading spinner/disabled button), success message, error message with retry option
5. Store the Web3Forms access key in an environment file (`environment.ts`) for easy configurability

### Contact form validation

- **Name:** Required, min 2 characters
- **Email:** Required, valid email format
- **Phone:** Optional, no strict validation
- **Subject:** Required
- **Message:** Required, min 10 characters

---

## 10. Build & Deployment

### Current workflow

1. `ng build` produces output in `dist/dalakotilaw/`
2. Copy/move build output to `docs/` folder
3. Commit and push to `master`
4. GitHub Pages serves from `docs/`

### Improvement

Add an npm deploy script that builds, copies output, and preserves critical files:
```
"deploy": "ng build && cp -r dist/dalakotilaw/* docs/ && cp docs/index.html docs/404.html"
```
- Keep `CNAME` in `src/assets/` so it's included in the build output automatically
- The `404.html` copy enables SPA routing on GitHub Pages (see Section 3)
- Do NOT change `outputPath` to `docs/` directly — `ng build` with `--delete-output-path` (default) would wipe CNAME and other files

---

## 11. CLAUDE.md Configuration

Create a `CLAUDE.md` at the project root with:

- Project overview (Angular 16 law firm site, GitHub Pages deployment)
- Build commands (`npm install`, `ng serve`, `ng build`)
- Deployment workflow (build → docs/ → push to master)
- Directory structure overview
- Key conventions (Angular Material for UI components, Bootstrap for grid/responsive)
- Content source location (`info/` folder)
- Bilingual architecture summary
- Important notes (e.g., CNAME preservation, no secrets in client code)

---

## 12. Out of Scope

- SEO optimization (can be addressed in a follow-up)
- Analytics integration
- Blog content and CMS
- Hindi content authoring (infrastructure only)
- Custom domain SSL configuration
- Automated CI/CD pipeline
- Performance optimization beyond default Angular build
