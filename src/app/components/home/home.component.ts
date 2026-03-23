import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface PracticeArea {
  id: string;
  titleKey: string;
  summaryKey: string;
  ctaKey: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  practiceAreas: PracticeArea[] = [
    { id: 'banking', titleKey: 'practices.banking.title', summaryKey: 'practices.banking.summary', ctaKey: 'practices.banking.cta', icon: 'fa-solid fa-building-columns' },
    { id: 'recovery', titleKey: 'practices.recovery.title', summaryKey: 'practices.recovery.summary', ctaKey: 'practices.recovery.cta', icon: 'fa-solid fa-scale-balanced' },
    { id: 'disciplinary', titleKey: 'practices.disciplinary.title', summaryKey: 'practices.disciplinary.summary', ctaKey: 'practices.disciplinary.cta', icon: 'fa-solid fa-gavel' },
    { id: 'property', titleKey: 'practices.property.title', summaryKey: 'practices.property.summary', ctaKey: 'practices.property.cta', icon: 'fa-solid fa-house-chimney' },
    { id: 'civil', titleKey: 'practices.civil.title', summaryKey: 'practices.civil.summary', ctaKey: 'practices.civil.cta', icon: 'fa-solid fa-file-contract' },
    { id: 'criminal', titleKey: 'practices.criminal.title', summaryKey: 'practices.criminal.summary', ctaKey: 'practices.criminal.cta', icon: 'fa-solid fa-shield-halved' }
  ];

  constructor(private router: Router) {}

  navigateToPractice(id: string): void {
    this.router.navigate(['/practices'], { fragment: id });
  }
}
