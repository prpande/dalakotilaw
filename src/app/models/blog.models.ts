import { SafeHtml } from '@angular/platform-browser';

export interface BlogPost {
  slug: string;
  date: string;
  image: string;
  tags: string[];
  en: { title: string; summary: string };
  hi?: { title: string; summary: string };
}

export interface BlogArticle {
  post: BlogPost;
  htmlContent: SafeHtml;
  lang: string;
}
