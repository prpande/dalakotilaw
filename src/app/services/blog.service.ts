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

  getImageUrl(filename: string, format: 'jpg' | 'webp' = 'jpg'): string {
    const baseName = filename.replace(/\.(jpg|jpeg|png)$/i, '');
    return `${this.imagesPath}/${baseName}.${format}`;
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
