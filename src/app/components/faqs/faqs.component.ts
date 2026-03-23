import { Component } from '@angular/core';

interface FaqItem { questionKey: string; answerKey: string; }
interface FaqCategory { titleKey: string; items: FaqItem[]; }

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent {
  categories: FaqCategory[] = [
    { titleKey: 'faqs.general.title', items: Array.from({ length: 5 }, (_, i) => ({ questionKey: `faqs.general.q${i+1}`, answerKey: `faqs.general.a${i+1}` })) },
    { titleKey: 'faqs.fees.title', items: Array.from({ length: 4 }, (_, i) => ({ questionKey: `faqs.fees.q${i+1}`, answerKey: `faqs.fees.a${i+1}` })) },
    { titleKey: 'faqs.process.title', items: Array.from({ length: 4 }, (_, i) => ({ questionKey: `faqs.process.q${i+1}`, answerKey: `faqs.process.a${i+1}` })) },
    { titleKey: 'faqs.rights.title', items: Array.from({ length: 3 }, (_, i) => ({ questionKey: `faqs.rights.q${i+1}`, answerKey: `faqs.rights.a${i+1}` })) },
    { titleKey: 'faqs.practical.title', items: Array.from({ length: 4 }, (_, i) => ({ questionKey: `faqs.practical.q${i+1}`, answerKey: `faqs.practical.a${i+1}` })) },
    { titleKey: 'faqs.specific.title', items: Array.from({ length: 12 }, (_, i) => ({ questionKey: `faqs.specific.q${i+1}`, answerKey: `faqs.specific.a${i+1}` })) }
  ];
}
