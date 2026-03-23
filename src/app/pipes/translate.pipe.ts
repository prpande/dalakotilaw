import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription: Subscription;

  constructor(private translationService: TranslationService, private cdr: ChangeDetectorRef) {
    this.subscription = this.translationService.lang$.subscribe(() => { this.cdr.markForCheck(); });
  }

  transform(key: string): string { return this.translationService.translate(key); }

  ngOnDestroy(): void { this.subscription.unsubscribe(); }
}
