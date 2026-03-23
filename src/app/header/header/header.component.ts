import { Component, OnInit } from '@angular/core';
import { DisclaimerService } from 'src/app/components/disclaimer/disclaimer.service';
import { DisclaimerCheckService } from 'src/app/services/disclaimer-check.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  headerClass = "base-color";
  constructor(
    private disclaimerCheckSvc: DisclaimerCheckService,
    private disclaimerService: DisclaimerService
  ) {}

  ngOnInit(): void {
    if (!this.disclaimerCheckSvc.DidShowDisclaimer) {
      this.disclaimerService.openDisclaimer().subscribe(() => {
        this.headerClass += " sticky-top";
      });
    }
  }
}
