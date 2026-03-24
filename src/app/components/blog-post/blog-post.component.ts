import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { TranslationService } from '../../services/translation.service';
import { SeoService } from '../../services/seo.service';
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
    private translationService: TranslationService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      combineLatest([this.route.paramMap, this.translationService.lang$]).subscribe(
        ([params, lang]) => {
          this.slug = params.get('slug') || '';
          if (this.slug) {
            this.loadArticle(lang);
          }
        }
      )
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
        const postLang = article.lang;
        const postData = (postLang === 'hi' && article.post.hi) ? article.post.hi : article.post.en;
        const title = postData.title;
        const summary = postData.summary;
        const imageUrl = article.post.image ? this.blogService.getImageUrl(article.post.image) : undefined;
        this.seoService.updateForBlogPost(title, summary, imageUrl);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
