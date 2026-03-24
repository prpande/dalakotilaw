# SEO Optimization Design — Dalakoti Law

**Date:** 2026-03-24
**Status:** Approved
**Goal:** Improve search visibility for dalakotilaw.com, especially for banking, disciplinary actions, SARFAESI, and location-based legal queries.

---

## 1. SeoService — Dynamic Per-Route Meta Tags

### What
A new Angular service (`SeoService`) that updates page title, meta description, keywords, Open Graph tags, Twitter Card tags, and canonical URL on every route change.

### How
- Uses Angular's `Title` and `Meta` services.
- Subscribes to `Router.events` and `TranslationService.lang$` to update on navigation and language change.
- Route SEO config stored as a map keyed by route path, with translation keys for bilingual descriptions.
- Blog post routes (`/blog/:slug`) pull title/description dynamically from the blog post data.

### Route SEO Config

| Route | Title Pattern | Keywords Focus |
|-------|--------------|----------------|
| `/home` | Dalakoti Law \| Advocate in Haldwani, Uttarakhand | banking lawyer, property advocate, disciplinary action, Haldwani, Uttarakhand |
| `/about` | About Aditi Dalakoti \| Advocate, Haldwani | advocate Haldwani, international legal experience, banking law, California Bar |
| `/practices` | Areas of Practice \| Banking, Recovery, SARFAESI, Disciplinary Law | SARFAESI lawyer, cheque dishonour, NPA, title scrutiny, show cause notice |
| `/contact` | Contact Dalakoti Law \| Advocate in Haldwani, Uttarakhand | legal consultation, advocate Haldwani, Uttarakhand lawyer |
| `/faqs` | FAQs \| Legal Services in Banking, Property & Service Law | legal FAQ, banking law questions, disciplinary proceedings |
| `/blog` | Blog \| Legal Insights on Banking, Recovery & Disciplinary Matters | legal blog, banking law articles, recovery insights |
| `/blog/:slug` | {Post Title} \| Dalakoti Law Blog | dynamic from post metadata |

### Meta Descriptions (English examples, 120-160 chars each)
- **Home:** "Dalakoti Law — Advocate Aditi Dalakoti offers legal services in banking, recovery, SARFAESI, disciplinary, property & civil matters in Haldwani, Uttarakhand."
- **About:** "Aditi Dalakoti is an advocate in Haldwani with international legal training, practising in banking, property, civil, criminal and service law matters."
- **Practices:** "Legal services in banking & financial matters, SARFAESI recovery, cheque dishonour, disciplinary defence, property title scrutiny and civil litigation."
- **Contact:** "Contact Advocate Aditi Dalakoti at Dalakoti Law, Haldwani, Uttarakhand for legal consultation in banking, property, and disciplinary matters."
- **FAQs:** "Frequently asked questions about legal services at Dalakoti Law — banking, recovery, property, disciplinary proceedings, and consultations."
- **Blog:** "Legal insights and articles on banking law, recovery proceedings, disciplinary actions, property documentation and more from Dalakoti Law."

All descriptions will have Hindi equivalents stored in `hi.json`.

### Open Graph & Twitter Tags (per page)
- `og:title`, `og:description`, `og:url`, `og:type` (website), `og:image` (site logo or post image for blog), `og:locale` (en_IN / hi_IN)
- `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`

### Canonical URL
- Set `<link rel="canonical">` per route to `https://dalakotilaw.com/{path}`

---

## 2. Structured Data (JSON-LD)

### Static schemas in `index.html`

**LegalService (LocalBusiness subtype):**
```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Dalakoti Law",
  "alternateName": "Chamber of Aditi Dalakoti",
  "url": "https://dalakotilaw.com",
  "telephone": "+91-8755501957",
  "email": "dalakoti.aditi@outlook.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Pilikothi Chauraha, Kaladhungi Road",
    "addressLocality": "Haldwani",
    "addressRegion": "Uttarakhand",
    "postalCode": "263139",
    "addressCountry": "IN"
  },
  "areaServed": ["Haldwani", "Uttarakhand", "India"],
  "priceRange": "$$",
  "knowsAbout": [
    "Banking Law", "SARFAESI Act", "Cheque Dishonour",
    "Disciplinary Proceedings", "Property Law", "Title Scrutiny",
    "Civil Litigation", "Criminal Defence", "Service Law",
    "NPA Recovery", "Loan Documentation"
  ]
}
```

**Person:**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Aditi Dalakoti",
  "jobTitle": "Advocate",
  "worksFor": { "@type": "LegalService", "name": "Dalakoti Law" },
  "alumniOf": [
    "University of San Francisco School of Law",
    "Indian Law Institute, New Delhi",
    "Guru Gobind Singh Indraprastha University"
  ],
  "memberOf": [
    "Bar Council of India",
    "Bar Council of Uttarakhand",
    "California Bar"
  ],
  "url": "https://dalakotilaw.com/about"
}
```

### Dynamic schema via SeoService

**FAQPage** — injected only on `/faqs` route. Generated from the FAQ translation keys. Structure:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "question text",
      "acceptedAnswer": { "@type": "Answer", "text": "answer text" }
    }
  ]
}
```

The SeoService will create/remove a `<script type="application/ld+json">` element in the document head for route-specific schemas. On `/faqs`, it injects FAQPage. On `/blog/:slug`, it could inject BlogPosting schema (stretch goal).

---

## 3. Static Files

### sitemap.xml — Auto-generated in build-deploy workflow

A script (`scripts/generate-sitemap.js`) runs during the GitHub Actions build-deploy workflow. It:
1. Lists all static routes: `/`, `/home`, `/about`, `/practices`, `/contact`, `/faqs`, `/blog`
2. Reads `docs/blog/index.json` (the blog manifest) to get all blog post slugs
3. Generates `docs/sitemap.xml` with `<lastmod>` dates and priorities:
   - Home: priority 1.0
   - Practices: 0.9
   - About, Contact, FAQs: 0.8
   - Blog index: 0.8
   - Blog posts: 0.7

### robots.txt — Static in `src/assets/`

```
User-agent: *
Allow: /
Sitemap: https://dalakotilaw.com/sitemap.xml
```

Added to the `assets` array in `angular.json` so it copies to the build output.

---

## 4. Heading Hierarchy Fixes

### Home page
- Add a visually hidden `h1`: "Dalakoti Law — Advocate in Haldwani, Uttarakhand"
- CSS class `.sr-only` (screen-reader only) to hide it visually but keep it accessible to crawlers
- Change blog card titles from `h6` to `h3`, with CSS override to preserve current visual size (`font-size: 0.95rem; font-weight: 600`)

### Other pages
- No changes needed — About, Practices, Blog, Contact, FAQs all have proper `h1` tags already

---

## 5. Translation Keys for SEO

New keys added to both `en.json` and `hi.json`:

```
seo.home.title
seo.home.description
seo.about.title
seo.about.description
seo.practices.title
seo.practices.description
seo.contact.title
seo.contact.description
seo.faqs.title
seo.faqs.description
seo.blog.title
seo.blog.description
seo.home.keywords
seo.practices.keywords
(etc.)
```

These are consumed by `SeoService` and switch automatically when the language toggles.

---

## 6. Files Created/Modified

### New files:
- `src/app/services/seo.service.ts` — dynamic meta tag management
- `src/assets/robots.txt` — crawler directives
- `scripts/generate-sitemap.js` — sitemap generator for CI

### Modified files:
- `src/index.html` — JSON-LD structured data (LegalService, Person)
- `src/assets/i18n/en.json` — SEO translation keys
- `src/assets/i18n/hi.json` — SEO translation keys (Hindi)
- `src/app/app.module.ts` — import SeoService
- `src/app/components/home/home.component.html` — h1 addition, h6→h3
- `src/app/components/home/home.component.css` — .sr-only class, h3 size override
- `.github/workflows/build-deploy.yml` — add sitemap generation step
- `angular.json` — add robots.txt to assets

---

## Out of Scope (future work)
- Server-side rendering (Angular Universal) for better non-Google crawler support
- Google Search Console setup (manual, requires domain verification)
- Hreflang tags for bilingual SEO (separate project)
- BlogPosting JSON-LD schema per blog post
- Performance optimization (Core Web Vitals)
