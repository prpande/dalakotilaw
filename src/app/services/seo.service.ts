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
