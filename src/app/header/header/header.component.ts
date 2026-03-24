import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerService } from 'src/app/components/disclaimer/disclaimer.service';
import { DisclaimerCheckService } from 'src/app/services/disclaimer-check.service';
import { TranslationService } from 'src/app/services/translation.service';
import { LanguageSelectComponent } from 'src/app/components/language-select/language-select.component';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('navbarCollapse', { static: false }) navbarCollapse!: ElementRef;
  headerClass = "base-color";

  constructor(
    private disclaimerCheckSvc: DisclaimerCheckService,
    private disclaimerService: DisclaimerService,
    private dialog: MatDialog,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    if (!this.disclaimerCheckSvc.DidShowDisclaimer) {
      this.disclaimerService.openDisclaimer().subscribe(() => {
        this.headerClass += " sticky-top";
        if (!this.translationService.hasChosenLanguage()) {
          this.openLanguageDialog();
        }
      });
    } else {
      this.headerClass += " sticky-top";
    }
  }

  openLanguageDialog(): void {
    this.dialog.open(LanguageSelectComponent, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: false
    });
  }

  toggleLanguage(): void {
    const newLang = this.translationService.currentLanguage === 'en' ? 'hi' : 'en';
    this.translationService.setLanguage(newLang);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.navbarCollapse?.nativeElement?.classList.contains('show')) {
      const collapse = bootstrap.Collapse.getInstance(this.navbarCollapse.nativeElement);
      if (collapse) {
        collapse.hide();
      }
    }
  }
}
