import { Component, OnInit } from '@angular/core';
import { DisclaimerService } from 'src/app/components/disclaimer/disclaimer.service';
import { EmailService } from 'src/app/contact/services/email.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  headerClass = "base-color"
  constructor(private disclaimerService: DisclaimerService, private emailService: EmailService){}

  ngOnInit(): void {
    this.disclaimerService.openDisclaimer().subscribe( ()=>{
      this.headerClass += " sticky-top";
      this.emailService.sendTestEmail();
    });
  }
}
