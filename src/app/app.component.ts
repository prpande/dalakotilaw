import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DisclaimerService } from './components/disclaimer/disclaimer.service';
import { TranslationService } from './services/translation.service';
import { SeoService } from './services/seo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Dalakoti Law';
  whatsappUrl = '';
  whatsappBottom = '2rem';
  private phone = '918755501957';
  private langSub!: Subscription;
  private messages: Record<string, string> = {
    en: 'Hello, I would like to enquire about your legal services.',
    hi: 'नमस्ते, मैं आपकी विधिक सेवाओं के बारे में जानकारी लेना चाहता/चाहती हूँ।'
  };

  constructor(private translationService: TranslationService, private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.init();
    this.updateUrl();
    this.langSub = this.translationService.lang$.subscribe(() => this.updateUrl());
    document.addEventListener('contextmenu', e => {
      if (e.target instanceof HTMLImageElement) e.preventDefault();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const footer = document.querySelector('app-footer');
    if (footer) {
      const footerTop = footer.getBoundingClientRect().top;
      const buttonSpace = 56 + 32; // button height + desired gap
      const overlap = window.innerHeight - footerTop;
      if (overlap > 0) {
        this.whatsappBottom = (overlap + buttonSpace) + 'px';
      } else {
        this.whatsappBottom = '2rem';
      }
    }
  }

  private updateUrl(): void {
    const lang = this.translationService.currentLanguage;
    const msg = encodeURIComponent(this.messages[lang] || this.messages['en']);
    this.whatsappUrl = `https://wa.me/${this.phone}?text=${msg}`;
  }
}
