import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { TranslationService } from '../../services/translation.service';
import { BlogPost } from '../../models/blog.models';

interface PracticeArea {
  id: string;
  titleKey: string;
  summaryKey: string;
  ctaKey: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  practiceAreas: PracticeArea[] = [
    { id: 'banking', titleKey: 'practices.banking.title', summaryKey: 'practices.banking.summary', ctaKey: 'practices.banking.cta', icon: 'fa-solid fa-building-columns' },
    { id: 'recovery', titleKey: 'practices.recovery.title', summaryKey: 'practices.recovery.summary', ctaKey: 'practices.recovery.cta', icon: 'fa-solid fa-scale-balanced' },
    { id: 'disciplinary', titleKey: 'practices.disciplinary.title', summaryKey: 'practices.disciplinary.summary', ctaKey: 'practices.disciplinary.cta', icon: 'fa-solid fa-gavel' },
    { id: 'property', titleKey: 'practices.property.title', summaryKey: 'practices.property.summary', ctaKey: 'practices.property.cta', icon: 'fa-solid fa-house-chimney' },
    { id: 'civil', titleKey: 'practices.civil.title', summaryKey: 'practices.civil.summary', ctaKey: 'practices.civil.cta', icon: 'fa-solid fa-file-contract' },
    { id: 'criminal', titleKey: 'practices.criminal.title', summaryKey: 'practices.criminal.summary', ctaKey: 'practices.criminal.cta', icon: 'fa-solid fa-shield-halved' }
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

  getPostImageUrl(post: BlogPost, format?: 'jpg' | 'webp'): string {
    return this.blogService.getImageUrl(post.image, format);
  }
}
