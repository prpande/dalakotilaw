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
      queryParams['tags'] = [...this.selectedTags].sort().join(',');
    } else {
      queryParams['tags'] = null;
    }

    if (this.sortOrder === 'oldest') {
      queryParams['sort'] = 'oldest';
    } else {
      queryParams['sort'] = null;
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
