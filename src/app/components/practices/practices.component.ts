import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatExpansionPanel } from '@angular/material/expansion';

interface PracticeDetail { titleKey: string; textKey: string; }
interface PracticeArea {
  id: string; titleKey: string; subtitleKey: string; summaryKey: string; details: PracticeDetail[];
}

@Component({
  selector: 'app-practices',
  templateUrl: './practices.component.html',
  styleUrls: ['./practices.component.css']
})
export class PracticesComponent implements OnInit, AfterViewInit {
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  private fragmentToOpen: string | null = null;

  practiceAreas: PracticeArea[] = [
    {
      id: 'banking', titleKey: 'practices.banking.title', subtitleKey: 'practices.banking.subtitle',
      summaryKey: 'practices.banking.summary',
      details: [
        { titleKey: 'practices.banking.detail.1.title', textKey: 'practices.banking.detail.1.text' },
        { titleKey: 'practices.banking.detail.2.title', textKey: 'practices.banking.detail.2.text' },
        { titleKey: 'practices.banking.detail.3.title', textKey: 'practices.banking.detail.3.text' },
        { titleKey: 'practices.banking.detail.4.title', textKey: 'practices.banking.detail.4.text' }
      ]
    },
    { id: 'recovery', titleKey: 'practices.recovery.title', subtitleKey: 'practices.recovery.subtitle', summaryKey: 'practices.recovery.summary', details: [] },
    { id: 'disciplinary', titleKey: 'practices.disciplinary.title', subtitleKey: 'practices.disciplinary.subtitle', summaryKey: 'practices.disciplinary.summary', details: [] },
    {
      id: 'property', titleKey: 'practices.property.title', subtitleKey: 'practices.property.subtitle',
      summaryKey: 'practices.property.summary',
      details: [
        { titleKey: 'practices.property.detail.1.title', textKey: 'practices.property.detail.1.text' },
        { titleKey: 'practices.property.detail.2.title', textKey: 'practices.property.detail.2.text' }
      ]
    },
    {
      id: 'civil', titleKey: 'practices.civil.title', subtitleKey: 'practices.civil.subtitle',
      summaryKey: 'practices.civil.summary',
      details: [
        { titleKey: 'practices.civil.detail.1.title', textKey: 'practices.civil.detail.1.text' },
        { titleKey: 'practices.civil.detail.2.title', textKey: 'practices.civil.detail.2.text' }
      ]
    },
    {
      id: 'criminal', titleKey: 'practices.criminal.title', subtitleKey: 'practices.criminal.subtitle',
      summaryKey: 'practices.criminal.summary',
      details: [
        { titleKey: 'practices.criminal.detail.1.title', textKey: 'practices.criminal.detail.1.text' },
        { titleKey: 'practices.criminal.detail.2.title', textKey: 'practices.criminal.detail.2.text' }
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      this.fragmentToOpen = fragment;
      this.openFragmentPanel();
    });
  }

  ngAfterViewInit(): void { this.openFragmentPanel(); }

  private openFragmentPanel(): void {
    if (!this.fragmentToOpen || !this.panels) return;
    const index = this.practiceAreas.findIndex(a => a.id === this.fragmentToOpen);
    if (index >= 0) {
      const panelArray = this.panels.toArray();
      if (panelArray[index]) {
        setTimeout(() => {
          panelArray[index].open();
          document.getElementById(this.fragmentToOpen!)?.scrollIntoView({ behavior: 'smooth' });
        });
      }
    }
  }
}
