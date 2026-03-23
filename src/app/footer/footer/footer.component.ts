import { Component } from '@angular/core';
import { DisclaimerService } from 'src/app/components/disclaimer/disclaimer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(private disclaimerService: DisclaimerService) {}

  openDisclaimer(): void {
    this.disclaimerService.openDisclaimer();
  }
}
