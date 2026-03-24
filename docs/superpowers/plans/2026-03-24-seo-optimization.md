# SEO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve search visibility for dalakotilaw.com by adding dynamic meta tags, structured data, sitemap, robots.txt, and heading fixes.

**Architecture:** A new `SeoService` hooks into Angular's router to set per-page titles, descriptions, keywords, OG/Twitter tags, and canonical URLs. Static JSON-LD schemas go in `index.html`. A Node.js script auto-generates `sitemap.xml` during CI. All SEO text is bilingual via translation keys.

**Tech Stack:** Angular 16 (Title, Meta services), JSON-LD, Node.js script for sitemap generation, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-03-24-seo-optimization-design.md`

---

### Task 1: Add SEO Translation Keys

**Files:**
- Modify: `src/assets/i18n/en.json`
- Modify: `src/assets/i18n/hi.json`

- [ ] **Step 1: Add English SEO keys to `en.json`**

Add these keys (place them after the existing `whatsapp.message` key, before the closing `}`):

```json
  "seo.home.title": "Dalakoti Law | Advocate in Haldwani, Uttarakhand",
  "seo.home.description": "Dalakoti Law — Advocate Aditi Dalakoti offers legal services in banking, recovery, SARFAESI, disciplinary, property & civil matters in Haldwani, Uttarakhand.",
  "seo.home.keywords": "advocate Haldwani, lawyer Uttarakhand, banking lawyer, SARFAESI lawyer, property advocate, disciplinary action lawyer, cheque dishonour, NPA recovery, civil litigation, criminal defence",
  "seo.about.title": "About Aditi Dalakoti | Advocate, Haldwani",
  "seo.about.description": "Aditi Dalakoti is an advocate in Haldwani with international legal training, practising in banking, property, civil, criminal and service law matters.",
  "seo.about.keywords": "Aditi Dalakoti, advocate Haldwani, banking law, California Bar, international legal experience, property lawyer Uttarakhand",
  "seo.practices.title": "Areas of Practice | Banking, Recovery, SARFAESI, Disciplinary Law",
  "seo.practices.description": "Legal services in banking & financial matters, SARFAESI recovery, cheque dishonour, disciplinary defence, property title scrutiny and civil litigation.",
  "seo.practices.keywords": "SARFAESI lawyer, cheque dishonour advocate, NPA recovery, title scrutiny, show cause notice lawyer, disciplinary proceedings, bank recovery, service law",
  "seo.contact.title": "Contact Dalakoti Law | Advocate in Haldwani, Uttarakhand",
  "seo.contact.description": "Contact Advocate Aditi Dalakoti at Dalakoti Law, Haldwani, Uttarakhand for legal consultation in banking, property, and disciplinary matters.",
  "seo.contact.keywords": "legal consultation Haldwani, advocate contact, lawyer Uttarakhand, banking law consultation",
  "seo.faqs.title": "FAQs | Legal Services in Banking, Property & Service Law",
  "seo.faqs.description": "Frequently asked questions about legal services at Dalakoti Law — banking, recovery, property, disciplinary proceedings, and consultations.",
  "seo.faqs.keywords": "legal FAQ, banking law questions, disciplinary proceedings FAQ, property law questions, lawyer consultation",
  "seo.blog.title": "Blog | Legal Insights on Banking, Recovery & Disciplinary Matters",
  "seo.blog.description": "Legal insights and articles on banking law, recovery proceedings, disciplinary actions, property documentation and more from Dalakoti Law.",
  "seo.blog.keywords": "legal blog, banking law articles, recovery insights, disciplinary action articles, property law blog"
```

- [ ] **Step 2: Add Hindi SEO keys to `hi.json`**

Add corresponding Hindi keys:

```json
  "seo.home.title": "डालाकोटी लॉ | अधिवक्ता, हल्द्वानी, उत्तराखंड",
  "seo.home.description": "डालाकोटी लॉ — अधिवक्ता अदिति डालाकोटी बैंकिंग, वसूली, SARFAESI, अनुशासनात्मक, संपत्ति एवं दीवानी मामलों में विधिक सेवाएँ प्रदान करती हैं।",
  "seo.home.keywords": "अधिवक्ता हल्द्वानी, वकील उत्तराखंड, बैंकिंग वकील, SARFAESI वकील, संपत्ति अधिवक्ता, अनुशासनात्मक कार्रवाई वकील",
  "seo.about.title": "अदिति डालाकोटी | अधिवक्ता, हल्द्वानी",
  "seo.about.description": "अदिति डालाकोटी हल्द्वानी में अंतरराष्ट्रीय विधिक प्रशिक्षण प्राप्त अधिवक्ता हैं, जो बैंकिंग, संपत्ति, दीवानी, आपराधिक एवं सेवा विधि में प्रैक्टिस करती हैं।",
  "seo.about.keywords": "अदिति डालाकोटी, अधिवक्ता हल्द्वानी, बैंकिंग विधि, संपत्ति वकील उत्तराखंड",
  "seo.practices.title": "प्रैक्टिस क्षेत्र | बैंकिंग, वसूली, SARFAESI, अनुशासनात्मक विधि",
  "seo.practices.description": "बैंकिंग एवं वित्तीय मामलों, SARFAESI वसूली, चेक अनादरण, अनुशासनात्मक बचाव, संपत्ति टाइटल स्क्रूटिनी एवं दीवानी वाद में विधिक सेवाएँ।",
  "seo.practices.keywords": "SARFAESI वकील, चेक अनादरण अधिवक्ता, NPA वसूली, टाइटल स्क्रूटिनी, शो कॉज नोटिस वकील, अनुशासनात्मक कार्यवाही",
  "seo.contact.title": "संपर्क करें | डालाकोटी लॉ, हल्द्वानी, उत्तराखंड",
  "seo.contact.description": "बैंकिंग, संपत्ति एवं अनुशासनात्मक मामलों में विधिक परामर्श हेतु अधिवक्ता अदिति डालाकोटी से संपर्क करें।",
  "seo.contact.keywords": "विधिक परामर्श हल्द्वानी, अधिवक्ता संपर्क, वकील उत्तराखंड",
  "seo.faqs.title": "अक्सर पूछे जाने वाले प्रश्न | बैंकिंग, संपत्ति एवं सेवा विधि",
  "seo.faqs.description": "डालाकोटी लॉ की विधिक सेवाओं के बारे में अक्सर पूछे जाने वाले प्रश्न — बैंकिंग, वसूली, संपत्ति, अनुशासनात्मक कार्यवाही।",
  "seo.faqs.keywords": "विधिक प्रश्न, बैंकिंग विधि प्रश्न, अनुशासनात्मक कार्यवाही, संपत्ति विधि प्रश्न",
  "seo.blog.title": "ब्लॉग | बैंकिंग, वसूली एवं अनुशासनात्मक मामलों पर विधिक लेख",
  "seo.blog.description": "डालाकोटी लॉ से बैंकिंग विधि, वसूली कार्यवाही, अनुशासनात्मक कार्रवाई, संपत्ति दस्तावेज़ीकरण पर विधिक लेख एवं जानकारी।",
  "seo.blog.keywords": "विधिक ब्लॉग, बैंकिंग विधि लेख, वसूली, अनुशासनात्मक कार्रवाई लेख"
```

- [ ] **Step 3: Commit**

```bash
git add src/assets/i18n/en.json src/assets/i18n/hi.json
git commit -m "feat(seo): add bilingual SEO translation keys for all routes"
```

---

### Task 2: Create SeoService

**Files:**
- Create: `src/app/services/seo.service.ts`

- [ ] **Step 1: Create the SeoService**

Create `src/app/services/seo.service.ts` with the following content:

```typescript
import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';
import { TranslationService } from './translation.service';

interface RouteSeoConfig {
  titleKey: string;
  descriptionKey: string;
  keywordsKey: string;
  ogImage?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly baseUrl = 'https://dalakotilaw.com';
  private readonly defaultImage = 'https://dalakotilaw.com/assets/icon.png';
  private currentPath = '';

  private routeConfig: Record<string, RouteSeoConfig> = {
    '/home': {
      titleKey: 'seo.home.title',
      descriptionKey: 'seo.home.description',
      keywordsKey: 'seo.home.keywords'
    },
    '/about': {
      titleKey: 'seo.about.title',
      descriptionKey: 'seo.about.description',
      keywordsKey: 'seo.about.keywords'
    },
    '/practices': {
      titleKey: 'seo.practices.title',
      descriptionKey: 'seo.practices.description',
      keywordsKey: 'seo.practices.keywords'
    },
    '/contact': {
      titleKey: 'seo.contact.title',
      descriptionKey: 'seo.contact.description',
      keywordsKey: 'seo.contact.keywords'
    },
    '/faqs': {
      titleKey: 'seo.faqs.title',
      descriptionKey: 'seo.faqs.description',
      keywordsKey: 'seo.faqs.keywords'
    },
    '/blog': {
      titleKey: 'seo.blog.title',
      descriptionKey: 'seo.blog.description',
      keywordsKey: 'seo.blog.keywords'
    }
  };

  constructor(
    private titleService: Title,
    private meta: Meta,
    private router: Router,
    private translationService: TranslationService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  init(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentPath = event.urlAfterRedirects || event.url;
      this.updateMeta();
    });

    this.translationService.lang$.subscribe(() => {
      if (this.currentPath) {
        this.updateMeta();
      }
    });
  }

  updateForBlogPost(title: string, summary: string, image?: string): void {
    const fullTitle = `${title} | Dalakoti Law Blog`;
    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: summary });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: summary });
    this.meta.updateTag({ property: 'og:url', content: `${this.baseUrl}${this.currentPath}` });
    this.meta.updateTag({ property: 'og:image', content: image || this.defaultImage });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: summary });
    this.meta.updateTag({ name: 'twitter:image', content: image || this.defaultImage });
    this.updateCanonical(`${this.baseUrl}${this.currentPath}`);
  }

  setFaqSchema(faqs: { question: string; answer: string }[]): void {
    this.removeJsonLd('faq-schema');
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': { '@type': 'Answer', 'text': faq.answer }
      }))
    };
    this.addJsonLd(schema, 'faq-schema');
  }

  removeFaqSchema(): void {
    this.removeJsonLd('faq-schema');
  }

  private updateMeta(): void {
    const path = this.normalizePath(this.currentPath);
    const config = this.routeConfig[path];

    if (!config) return;

    const title = this.translationService.translate(config.titleKey);
    const description = this.translationService.translate(config.descriptionKey);
    const keywords = this.translationService.translate(config.keywordsKey);
    const locale = this.translationService.currentLanguage === 'hi' ? 'hi_IN' : 'en_IN';
    const url = `${this.baseUrl}${path}`;

    this.titleService.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image', content: this.defaultImage });
    this.meta.updateTag({ property: 'og:locale', content: locale });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: this.defaultImage });

    this.updateCanonical(url);

    if (path !== '/faqs') {
      this.removeFaqSchema();
    }
  }

  private normalizePath(url: string): string {
    const path = url.split('?')[0].split('#')[0];
    if (path === '/' || path === '') return '/home';
    if (path.startsWith('/blog/')) return '/blog/:slug';
    return path;
  }

  private updateCanonical(url: string): void {
    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private addJsonLd(schema: object, id: string): void {
    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', id);
    script.textContent = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  private removeJsonLd(id: string): void {
    const existing = this.document.getElementById(id);
    if (existing) existing.remove();
  }
}
```

- [ ] **Step 2: Initialize SeoService in AppComponent**

In `src/app/app.component.ts`, import and call `seoService.init()` in the constructor:

Add import:
```typescript
import { SeoService } from './services/seo.service';
```

Add to constructor parameters:
```typescript
private seoService: SeoService
```

Add to `ngOnInit`:
```typescript
this.seoService.init();
```

- [ ] **Step 3: Build to verify no errors**

Run: `npx ng build 2>&1 | tail -5`
Expected: Build succeeds with no errors (existing dompurify warning is fine)

- [ ] **Step 4: Commit**

```bash
git add src/app/services/seo.service.ts src/app/app.component.ts
git commit -m "feat(seo): create SeoService with dynamic meta tags, OG, Twitter, canonical"
```

---

### Task 3: Integrate FAQPage Schema on /faqs Route

**Files:**
- Modify: `src/app/components/faqs/faqs.component.ts`

- [ ] **Step 1: Inject SeoService and TranslationService into FaqsComponent**

Update `src/app/components/faqs/faqs.component.ts`:

Add imports:
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SeoService } from 'src/app/services/seo.service';
import { TranslationService } from 'src/app/services/translation.service';
```

Change class to implement `OnInit, OnDestroy` and add:

```typescript
export class FaqsComponent implements OnInit, OnDestroy {
  private langSub!: Subscription;

  // ... existing categories array stays the same ...

  constructor(
    private seoService: SeoService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.updateFaqSchema();
    this.langSub = this.translationService.lang$.subscribe(() => this.updateFaqSchema());
  }

  ngOnDestroy(): void {
    this.seoService.removeFaqSchema();
    this.langSub?.unsubscribe();
  }

  private updateFaqSchema(): void {
    const faqs: { question: string; answer: string }[] = [];
    for (const cat of this.categories) {
      for (const item of cat.items) {
        faqs.push({
          question: this.translationService.translate(item.questionKey),
          answer: this.translationService.translate(item.answerKey)
        });
      }
    }
    this.seoService.setFaqSchema(faqs);
  }
}
```

- [ ] **Step 2: Build to verify**

Run: `npx ng build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/components/faqs/faqs.component.ts
git commit -m "feat(seo): inject FAQPage JSON-LD schema on /faqs route"
```

---

### Task 4: Integrate Blog Post SEO in BlogPostComponent

**Files:**
- Modify: `src/app/components/blog-post/blog-post.component.ts`

- [ ] **Step 1: Read the current BlogPostComponent**

Read `src/app/components/blog-post/blog-post.component.ts` to understand its structure — it loads post data from the blog service. Find where the post data is available after loading.

- [ ] **Step 2: Inject SeoService and call updateForBlogPost**

Import `SeoService` and inject it in the constructor. After the blog post data loads (in the existing subscription or method that sets the article), call:

```typescript
this.seoService.updateForBlogPost(
  title,    // the post title string
  summary,  // the post summary string
  imageUrl  // optional: full URL to post image
);
```

The exact integration point depends on the component's current data loading pattern — adapt to the existing code.

- [ ] **Step 3: Build to verify**

Run: `npx ng build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/app/components/blog-post/blog-post.component.ts
git commit -m "feat(seo): add dynamic meta tags for blog post pages"
```

---

### Task 5: Add JSON-LD Structured Data to index.html

**Files:**
- Modify: `src/index.html`

- [ ] **Step 1: Add LegalService and Person schemas**

In `src/index.html`, add the following just before the closing `</head>` tag:

```html
  <!-- Structured Data -->
  <script type="application/ld+json">
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
  </script>
  <script type="application/ld+json">
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
  </script>
```

- [ ] **Step 2: Add default meta tags**

In `src/index.html`, add these meta tags after the viewport meta tag (they will be overridden dynamically by SeoService per route, but serve as defaults for initial load / non-JS crawlers):

```html
  <meta name="description" content="Dalakoti Law — Advocate Aditi Dalakoti offers legal services in banking, recovery, SARFAESI, disciplinary, property & civil matters in Haldwani, Uttarakhand.">
  <meta name="keywords" content="advocate Haldwani, lawyer Uttarakhand, banking lawyer, SARFAESI lawyer, property advocate, disciplinary action lawyer, cheque dishonour, NPA recovery">
  <meta property="og:title" content="Dalakoti Law | Advocate in Haldwani, Uttarakhand">
  <meta property="og:description" content="Dalakoti Law — Advocate Aditi Dalakoti offers legal services in banking, recovery, SARFAESI, disciplinary, property & civil matters in Haldwani, Uttarakhand.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://dalakotilaw.com">
  <meta property="og:image" content="https://dalakotilaw.com/assets/icon.png">
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Dalakoti Law | Advocate in Haldwani, Uttarakhand">
  <meta name="twitter:description" content="Dalakoti Law — Advocate Aditi Dalakoti offers legal services in banking, recovery, SARFAESI, disciplinary, property & civil matters in Haldwani, Uttarakhand.">
  <meta name="twitter:image" content="https://dalakotilaw.com/assets/icon.png">
```

- [ ] **Step 3: Commit**

```bash
git add src/index.html
git commit -m "feat(seo): add JSON-LD structured data and default meta tags to index.html"
```

---

### Task 6: Create robots.txt and Update angular.json

**Files:**
- Create: `src/assets/robots.txt`
- Modify: `angular.json`

- [ ] **Step 1: Create robots.txt**

Create `src/assets/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://dalakotilaw.com/sitemap.xml
```

- [ ] **Step 2: Add robots.txt to angular.json assets**

In `angular.json`, in the `assets` array (around line 23-29), add a new entry to copy robots.txt to the root:

```json
{ "glob": "robots.txt", "input": "src/assets", "output": "/" }
```

Add it after the existing CNAME entry.

- [ ] **Step 3: Build to verify robots.txt is copied**

Run: `npx ng build && cat dist/dalakotilaw/robots.txt`
Expected: Shows the robots.txt content

- [ ] **Step 4: Commit**

```bash
git add src/assets/robots.txt angular.json
git commit -m "feat(seo): add robots.txt with sitemap reference"
```

---

### Task 7: Create Sitemap Generator Script

**Files:**
- Create: `scripts/generate-sitemap.js`

- [ ] **Step 1: Create the sitemap generator**

Create `scripts/generate-sitemap.js`:

```javascript
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://dalakotilaw.com';
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const BLOG_MANIFEST = path.join(DOCS_DIR, 'blog', 'index.json');
const OUTPUT = path.join(DOCS_DIR, 'sitemap.xml');

const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { path: '/',          priority: '1.0', changefreq: 'weekly' },
  { path: '/home',      priority: '1.0', changefreq: 'weekly' },
  { path: '/about',     priority: '0.8', changefreq: 'monthly' },
  { path: '/practices', priority: '0.9', changefreq: 'monthly' },
  { path: '/contact',   priority: '0.8', changefreq: 'monthly' },
  { path: '/faqs',      priority: '0.8', changefreq: 'monthly' },
  { path: '/blog',      priority: '0.8', changefreq: 'weekly' },
];

function main() {
  const urls = staticRoutes.map(route => `
  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`);

  // Add blog posts from manifest
  if (fs.existsSync(BLOG_MANIFEST)) {
    const manifest = JSON.parse(fs.readFileSync(BLOG_MANIFEST, 'utf-8'));
    for (const post of manifest) {
      urls.push(`
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>
`;

  fs.writeFileSync(OUTPUT, sitemap);
  console.log(`Generated sitemap with ${urls.length} URL(s).`);
}

main();
```

- [ ] **Step 2: Test locally**

Run: `node scripts/generate-sitemap.js && cat docs/sitemap.xml | head -20`
Expected: Valid XML sitemap with static routes and blog post URLs

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-sitemap.js
git commit -m "feat(seo): add sitemap generator script"
```

---

### Task 8: Add Sitemap Generation to CI Workflow

**Files:**
- Modify: `.github/workflows/build-deploy.yml`

- [ ] **Step 1: Add sitemap generation step**

In `.github/workflows/build-deploy.yml`, add a new step after the "Prepare docs folder" step and before the "Commit and push" step:

```yaml
      - name: Generate sitemap
        run: node scripts/generate-sitemap.js
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/build-deploy.yml
git commit -m "ci: add sitemap generation to build-deploy workflow"
```

---

### Task 9: Fix Home Page Heading Hierarchy

**Files:**
- Modify: `src/app/components/home/home.component.html`
- Modify: `src/app/components/home/home.component.css`

- [ ] **Step 1: Add visually hidden h1 to home page**

In `src/app/components/home/home.component.html`, add an h1 inside the hero section, right after `<div class="container text-center">`:

```html
      <h1 class="sr-only">Dalakoti Law — Advocate in Haldwani, Uttarakhand</h1>
```

- [ ] **Step 2: Change blog card h6 to h3**

In `src/app/components/home/home.component.html`, change line 43:

From: `<h6 class="blog-card-sm-title">`
To: `<h3 class="blog-card-sm-title">`

- [ ] **Step 3: Add sr-only CSS class**

In `src/app/components/home/home.component.css`, add:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

The `blog-card-sm-title` class already has `font-size: 0.95rem` and `font-weight: 600` defined, so changing from h6 to h3 won't affect the visual appearance — the class overrides the browser defaults.

- [ ] **Step 4: Build and verify visually**

Run: `npx ng build 2>&1 | tail -5`
Expected: Build succeeds. The home page should look identical — h1 is hidden, blog titles same size.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/home/home.component.html src/app/components/home/home.component.css
git commit -m "fix(seo): add hidden h1 to home page and fix blog title heading hierarchy"
```

---

### Task 10: Final Build, Generate Sitemap, and Push

**Files:**
- Modify: `docs/` (via build)

- [ ] **Step 1: Run full build**

Run: `npx ng build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 2: Generate sitemap locally**

Run: `node scripts/generate-sitemap.js`
Expected: "Generated sitemap with N URL(s)."

- [ ] **Step 3: Verify robots.txt in build**

Run: `cat dist/dalakotilaw/robots.txt`
Expected: Shows robots.txt content

- [ ] **Step 4: Push all commits**

Run: `git push`

The build-deploy workflow will automatically update `docs/`, generate the sitemap, and deploy.

- [ ] **Step 5: Verify deployed files**

After the workflow completes, verify:
- `https://dalakotilaw.com/robots.txt` returns the robots.txt content
- `https://dalakotilaw.com/sitemap.xml` returns the sitemap XML
- View page source of any page to confirm JSON-LD and meta tags are present
