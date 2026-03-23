import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.css']
})
export class LanguageSelectComponent {
  constructor(private dialogRef: MatDialogRef<LanguageSelectComponent>, private translationService: TranslationService) {}
  selectLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
    this.dialogRef.close(lang);
  }
}
