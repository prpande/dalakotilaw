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
  private postsSub!: Subscription;

  constructor(
    private blogService: BlogService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.postsSub = this.blogService.getPosts().subscribe(posts => this.posts = posts);
    this.langSub = this.translationService.lang$.subscribe(
      lang => this.currentLang = lang
    );
  }

  ngOnDestroy(): void {
    this.postsSub?.unsubscribe();
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

  getImageUrl(post: BlogPost, format?: 'jpg' | 'webp'): string {
    return this.blogService.getImageUrl(post.image, format);
  }
}
