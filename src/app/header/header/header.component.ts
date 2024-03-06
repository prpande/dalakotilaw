import { Component, OnInit } from '@angular/core';
import { DisclaimerService } from 'src/app/components/disclaimer/disclaimer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  headerClass = "base-color"
  constructor(private disclaimerService: DisclaimerService){}

  ngOnInit(): void {
    this.disclaimerService.openDisclaimer().subscribe( ()=>{
      this.headerClass += " sticky-top";
    });
  }
}
