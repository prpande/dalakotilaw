import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerService } from 'src/app/components/disclaimer/disclaimer.service';
import { DisclaimerCheckService } from 'src/app/services/disclaimer-check.service';
import { TranslationService } from 'src/app/services/translation.service';
import { LanguageSelectComponent } from 'src/app/components/language-select/language-select.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
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
}
