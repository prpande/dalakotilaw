import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private englishBase: Record<string, string> = {};
  private translations: Record<string, string> = {};
  private currentLang = new BehaviorSubject<string>(this.getSavedLanguage());
  lang$ = this.currentLang.asObservable();

  constructor(private http: HttpClient) {
    this.loadTranslations(this.currentLang.value);
  }

  private getSavedLanguage(): string {
    return localStorage.getItem('preferred-language') || 'en';
  }

  get currentLanguage(): string { return this.currentLang.value; }

  hasChosenLanguage(): boolean {
    return localStorage.getItem('preferred-language') !== null;
  }

  setLanguage(lang: string): void {
    localStorage.setItem('preferred-language', lang);
    this.currentLang.next(lang);
    this.loadTranslations(lang);
  }

  private loadTranslations(lang: string): void {
    if (lang === 'en') {
      this.http.get<Record<string, string>>('assets/i18n/en.json').subscribe({
        next: (data) => {
          this.englishBase = data;
          this.translations = { ...data };
          this.currentLang.next(lang);
        }
      });
    } else if (Object.keys(this.englishBase).length === 0) {
      this.http.get<Record<string, string>>('assets/i18n/en.json').subscribe({
        next: (enData) => {
          this.englishBase = enData;
          this.loadLanguageOverlay(lang);
        }
      });
    } else {
      this.loadLanguageOverlay(lang);
    }
  }

  private loadLanguageOverlay(lang: string): void {
    this.http.get<Record<string, string>>(`assets/i18n/${lang}.json`).subscribe({
      next: (data) => {
        this.translations = { ...this.englishBase, ...data };
        this.currentLang.next(lang);
      },
      error: () => {
        this.translations = { ...this.englishBase };
        this.currentLang.next('en');
      }
    });
  }

  translate(key: string): string {
    return this.translations[key] || key;
  }
}
