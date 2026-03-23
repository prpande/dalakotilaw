# Dalakoti Law Website Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign and populate the Dalakoti Law website with real content, responsive layouts, bilingual infrastructure, and a secure contact form.

**Architecture:** Angular 16 SPA with Angular Material components and Bootstrap 5 grid. Content served via i18n JSON files through a custom translate pipe. Contact form submits to Web3Forms API. Deployed to GitHub Pages via the `docs/` folder.

**Tech Stack:** Angular 16.2, Angular Material 16.2, Bootstrap 5.3, TypeScript 5.1, Web3Forms API

**Spec:** `docs/superpowers/specs/2026-03-23-dalakotilaw-redesign-design.md`

---

## File Structure

### New files to create

```
src/environments/environment.ts              — Environment config (Web3Forms key)
src/environments/environment.prod.ts         — Production environment config
src/app/services/translation.service.ts      — Translation service (loads i18n JSON, manages language)
src/app/pipes/translate.pipe.ts              — Translate pipe for templates
src/app/shared/shared.module.ts              — SharedModule exporting TranslatePipe (usable by all modules)
src/app/services/contact.service.ts          — Web3Forms contact form service
src/app/components/faqs/faqs.component.ts    — FAQs page component
src/app/components/faqs/faqs.component.html  — FAQs page template
src/app/components/faqs/faqs.component.css   — FAQs page styles
src/app/components/language-select/language-select.component.ts   — Language selection dialog
src/app/components/language-select/language-select.component.html — Language selection template
src/app/components/language-select/language-select.component.css  — Language selection styles
src/assets/i18n/en.json                      — English content strings
src/assets/i18n/hi.json                      — Hindi content strings (stub with keys, English fallback)
src/assets/images/hero-placeholder.jpg       — Hero background image placeholder
src/assets/CNAME                             — Domain file (preserved in builds)
```

### Existing files to modify

```
src/index.html                                          — Remove SMTP.js script
src/styles.css                                          — Add global section styles, CSS variables
src/app/app.module.ts                                   — Add HttpClientModule, new components, Material modules
src/app/app-routing.module.ts                           — Add FAQs route, anchorScrolling config
src/app/app.component.html                              — Remove card wrapper, full-width layout
src/app/app.component.css                               — Clean up
src/app/components/home/home.component.ts               — Add practice area data, navigation
src/app/components/home/home.component.html             — Hero + cards + about blurb + CTA
src/app/components/home/home.component.css              — Hero, card grid, section styles
src/app/components/about/about.component.html           — Premium bio content
src/app/components/about/about.component.css            — About page layout styles
src/app/components/practices/practices.component.ts     — Practice area data, fragment handling
src/app/components/practices/practices.component.html   — Accordion layout
src/app/components/practices/practices.component.css    — Accordion styles
src/app/components/contact/contact.component.ts         — Contact form logic with Web3Forms
src/app/components/contact/contact.component.html       — Form + office details two-column layout
src/app/components/contact/contact.component.css        — Contact page styles
src/app/components/blog/blog.component.html             — "Coming Soon" placeholder
src/app/components/blog/blog.component.css              — Placeholder styles
src/app/header/header/header.component.ts               — Remove EmailService, add language toggle
src/app/header/header/header.component.html             — Add FAQs nav link, language toggle button
src/app/header/header/header.component.css              — Language toggle styles
src/app/footer/footer/footer.component.html             — Update copyright year, add nav links
src/app/footer/footer/footer.component.css              — Minor footer style tweaks
package.json                                            — Add deploy script
angular.json                                            — Add CNAME to assets
```

### Files to delete

```
src/app/contact/services/email.service.ts       — Insecure SMTP credentials
src/app/contact/services/email.service.spec.ts  — Associated test file
src/app/contact/contact-form/                   — Unused orphan component (entire directory)
src/app/contact/contact.module.ts               — Unused module
```

---

## Task 1: Project Infrastructure & Cleanup

**Goal:** Set up environment files, deploy script, CNAME preservation, SPA routing fix, and remove insecure email code.

**Files:**
- Create: `src/environments/environment.ts`, `src/environments/environment.prod.ts`, `src/assets/CNAME`
- Modify: `package.json`, `angular.json`, `src/index.html`, `src/app/app.module.ts`, `src/app/app-routing.module.ts`, `src/app/app.component.html`, `src/app/header/header/header.component.ts`, `src/app/header/header.module.ts`
- Delete: `src/app/contact/services/email.service.ts`, `src/app/contact/contact-form/` (directory), `src/app/contact/contact.module.ts`

- [ ] **Step 1: Create environment files**

Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  web3formsAccessKey: 'b443d2b5-284c-4d17-bebc-84a4e8aa945b'
};
```

Create `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  web3formsAccessKey: 'b443d2b5-284c-4d17-bebc-84a4e8aa945b'
};
```

- [ ] **Step 2: Add CNAME to src/assets, configure angular.json, add fileReplacements**

Create `src/assets/CNAME` with content:
```
dalakotilaw.com
```

In `angular.json`, add the CNAME glob to the `assets` array under `architect.build.options`:
```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  { "glob": "CNAME", "input": "src/assets", "output": "/" }
]
```

Also in `angular.json`, add `fileReplacements` to `configurations.production` (required for environment file swapping in Angular 16):
```json
"production": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ],
  "budgets": [...]
}
```

- [ ] **Step 3: Add deploy script to package.json**

Add to `scripts` in `package.json`:
```json
"deploy": "ng build && shx cp -r dist/dalakotilaw/* docs/ && shx cp docs/index.html docs/404.html"
```

Also run: `npm install --save-dev shx` (cross-platform shell commands for npm scripts on Windows).

- [ ] **Step 4: Configure Angular router for anchor scrolling**

Modify `src/app/app-routing.module.ts` — change the `RouterModule.forRoot` call:
```typescript
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
```

- [ ] **Step 5: Remove SMTP.js from index.html**

In `src/index.html`, delete **only** this line:
```html
<script src="https://smtpjs.com/v3/smtp.js"></script>
```

**Important:** Preserve the Font Awesome kit script (`https://kit.fontawesome.com/fa34f5704b.js`) — it is used throughout the site for icons.

- [ ] **Step 6: Remove insecure email service and orphaned contact module**

Delete these files/directories:
- `src/app/contact/services/email.service.ts`
- `src/app/contact/services/email.service.spec.ts`
- `src/app/contact/contact-form/` (entire directory)
- `src/app/contact/contact.module.ts`

- [ ] **Step 7: Remove EmailService from header component**

Modify `src/app/header/header/header.component.ts` — remove the EmailService import and the `sendTestEmail()` call:
```typescript
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
```

- [ ] **Step 8: Add HttpClientModule to app.module.ts**

In `src/app/app.module.ts`, add:
```typescript
import { HttpClientModule } from '@angular/common/http';
```
And add `HttpClientModule` to the `imports` array.

- [ ] **Step 9: Update app.component.html for full-width layout**

Replace the current wrapper that constrains content in a card:
```html
<div class="bg-body-tertiary fullvh">
  <app-header></app-header>
  <main>
    <router-outlet></router-outlet>
  </main>
  <app-footer></app-footer>
</div>
```

- [ ] **Step 10: Verify the app compiles**

Run: `ng serve`
Expected: App compiles without errors, loads in browser, disclaimer still works. No SMTP.js console errors.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: project infrastructure setup and security cleanup

- Add environment files with Web3Forms config
- Add deploy script with 404.html SPA routing fix
- Configure anchorScrolling in router
- Remove insecure SMTP.js and email service
- Remove orphaned contact module
- Add CNAME to src/assets for build preservation
- Add HttpClientModule
- Update app layout to full-width"
```

---

## Task 2: Translation Infrastructure

**Goal:** Build the i18n system — TranslationService, translate pipe, language selection dialog, English JSON, and Hindi JSON stub.

**Files:**
- Create: `src/app/services/translation.service.ts`, `src/app/pipes/translate.pipe.ts`, `src/app/components/language-select/language-select.component.ts`, `src/app/components/language-select/language-select.component.html`, `src/app/components/language-select/language-select.component.css`, `src/assets/i18n/en.json`, `src/assets/i18n/hi.json`
- Modify: `src/app/app.module.ts`, `src/app/header/header/header.component.ts`, `src/app/header/header/header.component.html`, `src/app/header/header/header.component.css`, `src/app/header/header.module.ts`

- [ ] **Step 1: Create TranslationService**

Create `src/app/services/translation.service.ts` (this is the complete final version with English fallback support):
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private englishBase: Record<string, string> = {};
  private translations: Record<string, string> = {};
  private currentLang = new BehaviorSubject<string>(this.getSavedLanguage());
  lang$ = this.currentLang.asObservable();

  constructor(private http: HttpClient) {
    this.loadTranslations(this.currentLang.value);
  }

  private getSavedLanguage(): string {
    return localStorage.getItem('preferred-language') || 'en';
  }

  get currentLanguage(): string {
    return this.currentLang.value;
  }

  hasChosenLanguage(): boolean {
    return localStorage.getItem('preferred-language') !== null;
  }

  setLanguage(lang: string): void {
    localStorage.setItem('preferred-language', lang);
    this.currentLang.next(lang);
    this.loadTranslations(lang);
  }

  private loadTranslations(lang: string): void {
    if (lang === 'en') {
      this.http.get<Record<string, string>>('assets/i18n/en.json').subscribe({
        next: (data) => {
          this.englishBase = data;
          this.translations = { ...data };
          this.currentLang.next(lang);
        }
      });
    } else if (Object.keys(this.englishBase).length === 0) {
      // Load English base first, then overlay target language
      this.http.get<Record<string, string>>('assets/i18n/en.json').subscribe({
        next: (enData) => {
          this.englishBase = enData;
          this.loadLanguageOverlay(lang);
        }
      });
    } else {
      this.loadLanguageOverlay(lang);
    }
  }

  private loadLanguageOverlay(lang: string): void {
    this.http.get<Record<string, string>>(`assets/i18n/${lang}.json`).subscribe({
      next: (data) => {
        this.translations = { ...this.englishBase, ...data };
        this.currentLang.next(lang);
      },
      error: () => {
        this.translations = { ...this.englishBase };
        this.currentLang.next('en');
      }
    });
  }

  translate(key: string): string {
    return this.translations[key] || key;
  }
}
```

- [ ] **Step 2: Create translate pipe**

Create `src/app/pipes/translate.pipe.ts`:
```typescript
import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription: Subscription;

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscription = this.translationService.lang$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(key: string): string {
    return this.translationService.translate(key);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
```

- [ ] **Step 3: Create language selection dialog component**

Create `src/app/components/language-select/language-select.component.ts`:
```typescript
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.css']
})
export class LanguageSelectComponent {
  constructor(
    private dialogRef: MatDialogRef<LanguageSelectComponent>,
    private translationService: TranslationService
  ) {}

  selectLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
    this.dialogRef.close(lang);
  }
}
```

Create `src/app/components/language-select/language-select.component.html`:
```html
<div class="language-dialog p-4">
  <h2 class="text-center mb-2">Choose Your Language</h2>
  <p class="text-center mb-1">भाषा चुनें</p>
  <div class="d-flex justify-content-center gap-3 mt-4">
    <button mat-raised-button color="primary" (click)="selectLanguage('en')" class="lang-btn">
      English
    </button>
    <button mat-raised-button color="primary" (click)="selectLanguage('hi')" class="lang-btn">
      हिन्दी
    </button>
  </div>
</div>
```

Create `src/app/components/language-select/language-select.component.css`:
```css
.language-dialog h2 {
  font-size: 1.5rem;
  font-weight: 500;
}

.lang-btn {
  min-width: 120px;
  font-size: 1.1rem;
  padding: 0.5rem 1.5rem;
}
```

- [ ] **Step 4: Create English i18n JSON**

Create `src/assets/i18n/en.json` with all site content extracted from `info/` files. Structure:
```json
{
  "nav.home": "Home",
  "nav.about": "About",
  "nav.practices": "Practices",
  "nav.faqs": "FAQs",
  "nav.blog": "Blog",
  "nav.contact": "Contact",

  "home.hero.subtitle": "Chamber of",
  "home.hero.title": "Aditi Dalakoti",
  "home.hero.tagline": "Focused legal counsel across banking, recovery, property, civil, criminal, and service law matters.",
  "home.hero.cta": "Schedule a Consultation",

  "home.practices.title": "Areas of Practice",

  "home.about.text": "Aditi Dalakoti is an advocate with international legal training and a practice focused on banking, civil, criminal, property, and service law matters. She advises and represents banks, institutions, and private clients in matters involving title scrutiny, loan and mortgage documentation, recovery proceedings, cheque dishonour cases, disciplinary proceedings, and civil and criminal disputes.",
  "home.about.text2": "Having practiced in the San Francisco Bay Area before returning to India, she brings a rigorous, documentation-driven, and practical approach to legal representation. Her work is marked by careful preparation, strategic drafting, and a strong understanding of both litigation and institutional processes.",
  "home.about.text3": "Aditi is enrolled with the Bar Council of India, the Bar Council of Uttarakhand, and the California Bar. She holds a Juris Doctor from the University of San Francisco School of Law, an LL.M. in Human Rights from the Indian Law Institute, New Delhi, and an LL.B. (Honours) from Guru Gobind Singh Indraprastha University.",
  "home.about.cta": "Learn More",

  "home.cta.title": "Need Legal Assistance?",
  "home.cta.text": "Schedule a consultation to discuss your legal matter with clarity and confidence.",
  "home.cta.button": "Get in Touch",

  "about.title": "About",
  "about.bio.p1": "Aditi Dalakoti is an advocate whose practice reflects depth, precision, and trusted counsel across banking, property, civil, criminal, and service law matters. With professional experience spanning both India and the San Francisco Bay Area, she brings together international legal exposure and grounded courtroom insight to deliver representation that is strategic, meticulous, and client-focused.",
  "about.bio.p2": "Her practice is particularly distinguished in banking and financial matters, including title scrutiny, loan and mortgage documentation, recovery and cheque dishonour proceedings, disciplinary matters involving banking professionals, and complex documentation-sensitive disputes. She also advises and represents clients in civil, criminal, and property matters with a strong emphasis on preparation, legal clarity, and effective advocacy.",
  "about.bio.p3": "Known for a refined and detail-oriented approach, Aditi works closely with institutions and individuals who value careful legal analysis, strong drafting, and discreet, dependable representation. Her chambers are built on the principles of professional integrity, thoughtful strategy, and a deep commitment to protecting client interests with clarity and confidence.",
  "about.qualifications.title": "Qualifications & Enrollment",
  "about.qualifications.bar": "Enrolled with the Bar Council of India, the Bar Council of Uttarakhand, and the California Bar.",
  "about.qualifications.jd": "Juris Doctor — University of San Francisco School of Law",
  "about.qualifications.llm": "LL.M. in Human Rights — Indian Law Institute, New Delhi",
  "about.qualifications.llb": "LL.B. (Honours) — Guru Gobind Singh Indraprastha University",

  "practices.title": "Areas of Practice",
  "practices.subtitle": "Focused legal counsel across banking, recovery, property, civil, criminal, and service law matters, delivered with precision, preparation, and strategic clarity.",

  "practices.banking.title": "Banking & Financial Matters",
  "practices.banking.subtitle": "Advisory and representation for banks, institutions, and private clients",
  "practices.banking.summary": "Legal support in banking transactions, documentation, disputes, compliance-sensitive matters, and financial risk issues.",
  "practices.banking.cta": "Explore Banking Matters",
  "practices.banking.detail.1.title": "Disciplinary & Service Law Matters",
  "practices.banking.detail.1.text": "Assisting banking professionals and employees in responding to internal disciplinary proceedings, service-related disputes, and regulatory or institutional actions. The work includes drafting replies to show cause notices, charge sheets, written statements of defence, inquiry-related submissions, and, where required, representation before constitutional courts and other appropriate forums.",
  "practices.banking.detail.2.title": "Banking Documentation & Institutional Advisory",
  "practices.banking.detail.2.text": "Advising banks and financial institutions on legal issues arising from loan documentation, internal procedure, compliance-sensitive matters, and documentation-linked decision making. This includes scrutiny of records, assessment of legal risk, and support in matters where banking practice and legal process intersect closely.",
  "practices.banking.detail.3.title": "NPA, Recovery & Enforcement Advisory",
  "practices.banking.detail.3.text": "Advising on the legal course of action once loan accounts turn non-performing, including recall strategy, recovery proceedings, enforcement-related action, and connected litigation. The work is documentation-driven and focused on practical legal solutions for banks and financial institutions.",
  "practices.banking.detail.4.title": "Cheque Dishonour & Recovery Matters",
  "practices.banking.detail.4.text": "Representing clients in cheque dishonour proceedings and allied recovery actions. This includes statutory proceedings, civil recovery strategy, and legal action for enforcement of financial liabilities.",

  "practices.recovery.title": "Recovery, SARFAESI & Cheque Dishonour",
  "practices.recovery.subtitle": "Enforcement, recovery, and financial dispute resolution",
  "practices.recovery.summary": "Representation in recovery proceedings, SARFAESI-related matters, cheque dishonour cases, and allied lending disputes.",
  "practices.recovery.cta": "View Recovery Services",

  "practices.disciplinary.title": "Disciplinary & Service Law Matters",
  "practices.disciplinary.subtitle": "Defence in internal proceedings and service-related disputes",
  "practices.disciplinary.summary": "Assistance with show cause notices, charge sheets, inquiry defence, service issues, and related legal challenges.",
  "practices.disciplinary.cta": "Learn More",

  "practices.property.title": "Property, Title Search & Documentation",
  "practices.property.subtitle": "Title scrutiny, documentation, and property-linked legal support",
  "practices.property.summary": "Detailed title review, due diligence, document scrutiny, and strategic assistance in property transactions and disputes.",
  "practices.property.cta": "Explore Property Services",
  "practices.property.detail.1.title": "Title Scrutiny & Due Diligence",
  "practices.property.detail.1.text": "Conducting careful title scrutiny and legal due diligence in relation to immovable property, particularly in matters linked to mortgage creation, loan approvals, and institutional lending. The work includes title-chain examination, review of supporting records, and identification of legal defects or risk areas.",
  "practices.property.detail.2.title": "Property Documentation & Disputes",
  "practices.property.detail.2.text": "Advising on property-linked documentation and representing clients in disputes involving title, possession, transfer documents, and related civil issues. Particular emphasis is placed on documentary clarity and the legal sustainability of title and transaction records.",

  "practices.civil.title": "Civil Litigation",
  "practices.civil.subtitle": "Strategic representation in contested civil matters",
  "practices.civil.summary": "Thoughtful legal drafting and courtroom representation in civil disputes requiring clarity, structure, and careful preparation.",
  "practices.civil.cta": "View Civil Practice",
  "practices.civil.detail.1.title": "Civil & Contractual Disputes",
  "practices.civil.detail.1.text": "Advising and representing clients in civil disputes involving contractual obligations, documentation issues, property-linked claims, recovery matters, and related litigation. The approach is focused on precise drafting, procedural clarity, and practical litigation strategy.",
  "practices.civil.detail.2.title": "Recovery Suits & Enforcement of Obligations",
  "practices.civil.detail.2.text": "Representing clients in civil proceedings for recovery of dues and enforcement of legal and contractual obligations, particularly where documentary records form the foundation of the claim.",

  "practices.criminal.title": "Criminal Defence & Complaint Matters",
  "practices.criminal.subtitle": "Effective defence in criminal and complaint-based proceedings",
  "practices.criminal.summary": "Representation in FIR-based matters, complaint cases, discharge applications, and other criminal defence proceedings.",
  "practices.criminal.cta": "Explore Criminal Defence",
  "practices.criminal.detail.1.title": "Complaint Cases, FIR Matters & Defence Strategy",
  "practices.criminal.detail.1.text": "Representing clients in criminal matters arising out of complaints, FIRs, financial allegations, and documentation-sensitive disputes. The work includes defence strategy, bail-related proceedings, discharge applications, and other pre-trial and trial-stage legal remedies.",
  "practices.criminal.detail.2.title": "Criminal Proceedings with Civil or Banking Overlap",
  "practices.criminal.detail.2.text": "Advising in matters where criminal allegations arise alongside banking, employment, property, or civil disputes, requiring careful analysis of records, procedural safeguards, and the distinction between civil wrongs, disciplinary issues, and criminal liability.",

  "contact.title": "Contact",
  "contact.form.name": "Full Name",
  "contact.form.email": "Email Address",
  "contact.form.phone": "Phone Number (optional)",
  "contact.form.subject": "Subject",
  "contact.form.message": "Your Message",
  "contact.form.submit": "Send Message",
  "contact.form.sending": "Sending...",
  "contact.form.success": "Your message has been sent successfully. We will get back to you shortly.",
  "contact.form.error": "Something went wrong. Please try again.",
  "contact.office.title": "Office",
  "contact.office.address.line1": "Office 1, Dalakoti Niwas",
  "contact.office.address.line2": "Pilikothi, Kaladhungi Road",
  "contact.office.address.line3": "Haldwani, Uttarakhand",
  "contact.office.address.line4": "India - 263139",
  "contact.office.phone": "+91-8755501957",
  "contact.office.email": "dalakoti.aditi@outlook.com",

  "faqs.title": "Frequently Asked Questions",

  "faqs.general.title": "General Information",
  "faqs.general.q1": "What areas of law do you handle?",
  "faqs.general.a1": "I handle a range of matters with a particular focus on banking and financial matters, recovery and cheque dishonour cases, disciplinary and service law matters, property and title scrutiny, civil litigation, criminal defence, and documentation-related legal advisory work.",
  "faqs.general.q2": "How do I know if I need a lawyer?",
  "faqs.general.a2": "You should consider seeking legal advice as early as possible if you have received a legal notice, FIR, summons, charge sheet, show cause notice, recovery notice, loan recall notice, disciplinary communication, or if a dispute involving money, property, or documentation is beginning to escalate. Early legal advice often helps prevent avoidable mistakes and strengthens your position.",
  "faqs.general.q3": "What are your qualifications and experience?",
  "faqs.general.a3": "I am enrolled with the Bar Council of India, the Bar Council of Uttarakhand, and the California Bar. My legal training includes a Juris Doctor from the University of San Francisco School of Law, an LL.M. in Human Rights from the Indian Law Institute, New Delhi, and an LL.B. (Honours) from Guru Gobind Singh Indraprastha University. My work has included practice in both India and California, along with experience in litigation, property-related issues, banking matters, and institutional legal advisory.",
  "faqs.general.q4": "What is your consultation process?",
  "faqs.general.a4": "A consultation typically begins with a review of the facts, documents, timeline, and immediate legal concerns. Based on the nature of the matter, I assess the legal position, identify immediate next steps, and advise on possible remedies, risks, and strategy. Further engagement depends on the complexity and requirements of the matter.",
  "faqs.general.q5": "What information should I bring to the first consultation?",
  "faqs.general.a5": "Please bring all documents relevant to your matter. Depending on the case, this may include notices, agreements, title papers, loan documents, FIRs, charge sheets, court papers, inquiry documents, email or WhatsApp correspondence, prior legal opinions, and a clear timeline of events.",

  "faqs.fees.title": "Legal Fees and Costs",
  "faqs.fees.q1": "How do you charge for your services?",
  "faqs.fees.a1": "Fees depend on the nature of the matter, the urgency involved, the amount of documentation to be reviewed, the court or forum involved, and the scope of representation required. In some matters, fees may be structured consultation-wise, stage-wise, hearing-wise, or for complete drafting and representation.",
  "faqs.fees.q2": "Are there costs apart from legal fees?",
  "faqs.fees.a2": "Yes. Depending on the matter, there may be additional costs such as court fees, filing expenses, clerkage, process fees, certified copy charges, travel expenses, typing or compilation costs, and other out-of-pocket expenses connected with the proceedings.",
  "faqs.fees.q3": "Do you offer payment plans?",
  "faqs.fees.a3": "In appropriate matters, fee structuring may be discussed depending on the scope and duration of the work. Any such arrangement is considered on a case-by-case basis.",
  "faqs.fees.q4": "How can I estimate the likely cost of my case?",
  "faqs.fees.a4": "The overall cost depends on the type of matter, the number of hearings, the forum involved, the volume of documents, urgency, and whether the work is limited to advice or extends to full representation. A clearer estimate can usually be given after reviewing the papers.",

  "faqs.process.title": "Case Process",
  "faqs.process.q1": "How long will my case take?",
  "faqs.process.a1": "Timelines vary depending on the type of matter, the court or authority involved, procedural stages, and the conduct of the parties. Some matters can be addressed quickly at the notice, reply, or interim stage, while others may take substantially longer if they proceed through full hearings or trial.",
  "faqs.process.q2": "What should I expect during the legal process?",
  "faqs.process.a2": "The process usually involves an initial document review, legal assessment, drafting of notices or replies where required, filing before the appropriate forum, interim hearings, evidence or inquiry stages where applicable, and final arguments or disposal. The exact path depends on the kind of matter involved.",
  "faqs.process.q3": "How often will I receive updates on my case?",
  "faqs.process.a3": "Clients are typically updated at key stages of the matter, including after important hearings, filings, developments, or strategic decisions. The frequency of updates depends on the pace of proceedings and the nature of the matter.",
  "faqs.process.q4": "Will my case go to trial?",
  "faqs.process.a4": "Not every case proceeds to full trial. Some matters are resolved at the notice stage, through settlement, by interim relief, or at preliminary stages such as discharge, quashing, or procedural challenge. Others do proceed to full evidence and final adjudication.",

  "faqs.rights.title": "Legal Rights and Confidentiality",
  "faqs.rights.q1": "How is my information handled?",
  "faqs.rights.a1": "Information shared by clients is treated with professional confidentiality and used only for the purpose of legal advice, drafting, strategy, and representation, subject to applicable legal and professional obligations.",
  "faqs.rights.q2": "What rights do I have during legal proceedings?",
  "faqs.rights.a2": "Your rights depend on the nature of the proceedings, but they generally include the right to legal representation, the right to be heard, the right to receive and respond to material relied upon against you, and the right to pursue remedies available in law.",
  "faqs.rights.q3": "What should I do if I have been arrested or fear arrest?",
  "faqs.rights.a3": "You should seek legal advice immediately. Avoid making unnecessary statements, preserve all relevant documents and communications, and share the full factual background with your lawyer at the earliest. Timely legal action can be critical in criminal matters.",

  "faqs.practical.title": "Practical Questions",
  "faqs.practical.q1": "Do you represent clients outside your immediate city or district?",
  "faqs.practical.a1": "Depending on the nature of the matter, representation and advisory work may be undertaken in matters outside the immediate local area, especially where the work is documentation-heavy, advisory in nature, or before forums where appearance and filing can be coordinated appropriately.",
  "faqs.practical.q2": "Do you handle both litigation and legal advisory work?",
  "faqs.practical.a2": "Yes. Depending on the matter, work may involve only legal advice and drafting, or it may extend to full representation before the relevant court, tribunal, authority, or inquiry forum.",
  "faqs.practical.q3": "Can you assist with legal documents and document review?",
  "faqs.practical.a3": "Yes. Assistance can be provided in reviewing notices, agreements, loan documents, title papers, inquiry papers, pleadings, replies, and other legal records. In suitable matters, drafting support may also be provided.",
  "faqs.practical.q4": "Can I contact you before a dispute becomes a court case?",
  "faqs.practical.a4": "Yes. In many matters, early advice is useful before formal litigation begins, especially when a notice has been received, documentation needs to be reviewed, or a legal response must be prepared carefully.",

  "faqs.specific.title": "Practice-Specific Questions",
  "faqs.specific.q1": "Do you handle banking and financial matters?",
  "faqs.specific.a1": "Yes. Banking and financial matters form an important part of the practice, including documentation review, title scrutiny, recovery-related disputes, cheque dishonour matters, and advisory work connected with loan and institutional records.",
  "faqs.specific.q2": "Can you assist in cheque dishonour or recovery matters?",
  "faqs.specific.a2": "Yes. Assistance can be provided in cheque dishonour matters, recovery-related strategy, notices, pleadings, and connected litigation depending on the facts and available documentation.",
  "faqs.specific.q3": "Do you advise on loan recall, NPA, and recovery-related issues?",
  "faqs.specific.a3": "Yes. Advice may be provided on documentation, legal notices, recovery options, connected disputes, and the legal implications arising once an account has become stressed or non-performing.",
  "faqs.specific.q4": "Can you help with title scrutiny and property due diligence?",
  "faqs.specific.a4": "Yes. Property title review and documentation scrutiny can be undertaken, especially where the matter involves ownership history, title-chain examination, mortgage-related issues, or transaction risk.",
  "faqs.specific.q5": "Do you handle property disputes as well as property documentation?",
  "faqs.specific.a5": "Yes. Assistance may be provided both in documentation-focused work such as title and legal scrutiny, and in disputes relating to title, possession, transfer documents, and related civil issues.",
  "faqs.specific.q6": "Do you assist banking professionals in disciplinary proceedings?",
  "faqs.specific.a6": "Yes. Assistance can be provided in matters involving show cause notices, charge sheets, written statements of defence, inquiry-related responses, and related service law issues.",
  "faqs.specific.q7": "Can you represent employees or officers in service-related disputes?",
  "faqs.specific.a7": "Yes. Where appropriate, assistance may be provided in service and disciplinary matters arising from employment-related action, including strategic advice, drafting, and litigation support.",
  "faqs.specific.q8": "Do you handle criminal matters arising out of financial, property, or employment disputes?",
  "faqs.specific.a8": "Yes. Some criminal matters arise alongside banking, property, civil, or employment disputes. In such cases, careful examination of records and procedural strategy becomes especially important.",
  "faqs.specific.q9": "Can you help if the case appears civil in nature but criminal allegations have also been made?",
  "faqs.specific.a9": "Yes. In appropriate matters, legal assistance can be provided to assess whether the dispute is essentially civil, contractual, service-related, or whether criminal liability is actually made out on the facts and record.",
  "faqs.specific.q10": "Do you provide legal training or institutional sessions?",
  "faqs.specific.a10": "Yes. Subject to availability and suitability, legal training or guidance sessions may be conducted in areas such as loan documentation, legal process awareness, workplace compliance, or related institutional legal issues.",
  "faqs.specific.q11": "Do you advise on POSH or workplace compliance matters?",
  "faqs.specific.a11": "Yes. Advisory and training-oriented support may be provided in relation to workplace process compliance and POSH-related legal issues.",
  "faqs.specific.q12": "Is every matter accepted for representation?",
  "faqs.specific.a12": "No. Representation depends on the nature of the matter, the documents available, conflict checks, urgency, forum, and whether the case is suitable for engagement after preliminary assessment.",

  "blog.title": "Blog",
  "blog.coming_soon": "Coming Soon",
  "blog.message": "We are working on bringing you insightful articles on legal topics. Please check back later.",

  "footer.copyright": "2026 Chamber of Aditi Dalakoti. All rights reserved.",
  "footer.disclaimer": "Disclaimer"
}
```

- [ ] **Step 5: Create Hindi i18n JSON stub**

Create `src/assets/i18n/hi.json` — copy the `en.json` structure but populate only navigation keys and a few key labels with Hindi. The rest remain as English fallback until full translations are provided:
```json
{
  "nav.home": "होम",
  "nav.about": "परिचय",
  "nav.practices": "प्रैक्टिस क्षेत्र",
  "nav.faqs": "अक्सर पूछे जाने वाले प्रश्न",
  "nav.blog": "ब्लॉग",
  "nav.contact": "संपर्क"
}
```

(All other keys fall back to English via the translation service when not found in Hindi JSON.)

- [ ] **Step 6: Create SharedModule for TranslatePipe**

Create `src/app/shared/shared.module.ts`:
```typescript
import { NgModule } from '@angular/core';
import { TranslatePipe } from '../pipes/translate.pipe';

@NgModule({
  declarations: [TranslatePipe],
  exports: [TranslatePipe]
})
export class SharedModule { }
```

This allows any module (AppModule, HeaderModule, etc.) to use the translate pipe by importing `SharedModule`.

- [ ] **Step 7: Register new components and SharedModule in app.module.ts**

Add to `src/app/app.module.ts`:
```typescript
import { SharedModule } from './shared/shared.module';
import { LanguageSelectComponent } from './components/language-select/language-select.component';
```
Add `LanguageSelectComponent` to `declarations`. Add `SharedModule` to `imports`.

- [ ] **Step 8: Add language toggle to header (with translated nav labels)**

Update `src/app/header/header/header.component.ts` — add TranslationService and language dialog:
```typescript
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
```

Update `src/app/header/header/header.component.html` — add FAQs nav link and language toggle button. After the Contact nav item, before the closing `</ul>`:
```html
<li class="nav-item">
    <a routerLink="/faqs" class="nav-link base-color">FAQs</a>
</li>
<li class="nav-item">
    <button class="btn nav-link base-color lang-toggle" (click)="toggleLanguage()">
        {{ translationService.currentLanguage === 'en' ? 'HI' : 'EN' }}
    </button>
</li>
```

Add to `src/app/header/header/header.component.css`:
```css
.lang-toggle {
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 4px;
    padding: 0.25rem 0.75rem;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    background: transparent;
}

.lang-toggle:hover {
    border-color: white;
    background: rgba(255,255,255,0.1);
}
```

- [ ] **Step 9: Import MatDialogModule and SharedModule in HeaderModule**

Update `src/app/header/header.module.ts`:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, RouterModule, MatDialogModule, MatButtonModule, SharedModule],
  exports: [HeaderComponent]
})
export class HeaderModule { }
```

- [ ] **Step 10: Verify translation system works**

Run: `ng serve`
Expected: App compiles, language toggle visible in header, clicking it switches language (nav labels should change for Hindi keys). Language selection dialog should appear after disclaimer on first visit.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: add bilingual translation infrastructure

- TranslationService with English base + language overlay fallback
- TranslatePipe for template string resolution
- Language selection dialog (post-disclaimer on first visit)
- Language toggle button in header
- Full English i18n JSON with all site content
- Hindi i18n JSON stub (nav labels only, rest falls back to English)"
```

---

## Task 3: Global Styles & Layout Foundation

**Goal:** Establish CSS variables, section spacing utilities, and responsive foundation for all pages.

**Files:**
- Modify: `src/styles.css`, `src/app/app.component.css`

- [ ] **Step 1: Add global CSS variables and section utilities**

Add to `src/styles.css` (append after existing content):
```css
/* Section layout utilities */
.section {
  padding: 4rem 0;
}

.section-sm {
  padding: 2rem 0;
}

.section-dark {
  background-color: #f8f9fa;
}

.section-primary {
  background-color: var(--primary-color);
  color: #f5f5f5;
}

.page-header {
  padding: 3rem 0 2rem;
  text-align: center;
}

.page-header h1 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  color: #666;
  max-width: 700px;
  margin: 0 auto;
}

/* Card hover effect */
.practice-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  height: 100%;
}

.practice-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

/* Responsive container padding */
@media (max-width: 576px) {
  .section {
    padding: 2.5rem 0;
  }
  .page-header {
    padding: 2rem 0 1.5rem;
  }
}
```

- [ ] **Step 2: Clean up app.component.css**

Replace `src/app/app.component.css`:
```css
main {
  min-height: calc(100vh - 200px);
}
```

- [ ] **Step 3: Verify styles load**

Run: `ng serve`
Expected: App runs, layout looks clean without the old card wrapper around content.

- [ ] **Step 4: Commit**

```bash
git add src/styles.css src/app/app.component.css
git commit -m "style: add global section utilities and responsive foundation"
```

---

## Task 4: Home Page

**Goal:** Build the home page with hero section, practice area cards, about blurb, and CTA section.

**Files:**
- Modify: `src/app/components/home/home.component.ts`, `src/app/components/home/home.component.html`, `src/app/components/home/home.component.css`
- Create: `src/assets/images/hero-placeholder.jpg` (user provides)

- [ ] **Step 1: Add practice area data and navigation to home component**

Replace `src/app/components/home/home.component.ts`:
```typescript
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
```

- [ ] **Step 2: Build home page template**

Replace `src/app/components/home/home.component.html`:
```html
<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-overlay">
    <div class="container text-center">
      <p class="hero-subtitle">{{ 'home.hero.subtitle' | translate }}</p>
      <h1 class="hero-title oxanium">{{ 'home.hero.title' | translate }}</h1>
      <p class="hero-tagline">{{ 'home.hero.tagline' | translate }}</p>
      <a routerLink="/contact" class="btn btn-lg hero-cta mt-3">
        {{ 'home.hero.cta' | translate }}
      </a>
    </div>
  </div>
</section>

<!-- Practice Area Cards -->
<section class="section">
  <div class="container">
    <h2 class="text-center mb-4">{{ 'home.practices.title' | translate }}</h2>
    <div class="row g-4">
      <div *ngFor="let area of practiceAreas" class="col-12 col-md-6 col-lg-4">
        <div class="card practice-card p-4" (click)="navigateToPractice(area.id)">
          <div class="card-body text-center">
            <span [class]="area.icon + ' practice-icon mb-3'"></span>
            <h5 class="card-title">{{ area.titleKey | translate }}</h5>
            <p class="card-text text-muted">{{ area.summaryKey | translate }}</p>
            <span class="practice-cta">{{ area.ctaKey | translate }} &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- About Blurb -->
<section class="section section-dark">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h2 class="text-center mb-4">{{ 'nav.about' | translate }}</h2>
        <p>{{ 'home.about.text' | translate }}</p>
        <p>{{ 'home.about.text2' | translate }}</p>
        <p>{{ 'home.about.text3' | translate }}</p>
        <div class="text-center mt-4">
          <a routerLink="/about" class="btn btn-outline-primary">{{ 'home.about.cta' | translate }}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="section section-primary text-center">
  <div class="container">
    <h2 class="mb-3">{{ 'home.cta.title' | translate }}</h2>
    <p class="mb-4">{{ 'home.cta.text' | translate }}</p>
    <a routerLink="/contact" class="btn btn-lg btn-light">{{ 'home.cta.button' | translate }}</a>
  </div>
</section>
```

- [ ] **Step 3: Add home page styles**

Replace `src/app/components/home/home.component.css`:
```css
/* Hero */
.hero-section {
  background: url('/assets/images/hero-placeholder.jpg') center/cover no-repeat;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.hero-overlay {
  width: 100%;
  padding: 4rem 0;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.3rem);
  letter-spacing: 0.1rem;
  margin-bottom: 0.25rem;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: bold;
  font-variant: small-caps;
  letter-spacing: 0.15rem;
  margin-bottom: 1rem;
}

.hero-tagline {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
}

.hero-cta {
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  padding: 0.75rem 2rem;
}

.hero-cta:hover {
  background-color: #e91e63;
  color: #fff;
}

/* Practice Cards */
.practice-icon {
  font-size: 2rem;
  color: var(--primary-color);
  display: block;
}

.practice-cta {
  color: var(--primary-color);
  font-weight: 500;
  font-size: 0.9rem;
}

@media (max-width: 576px) {
  .hero-section {
    min-height: 50vh;
  }
  .hero-overlay {
    padding: 3rem 0;
  }
}
```

- [ ] **Step 4: Add a placeholder hero image**

Note for implementer: The user will provide a placeholder image at `src/assets/images/hero-placeholder.jpg`. If not yet available, create a minimal placeholder or use a solid gradient fallback. Add this CSS fallback to `.hero-section`:
```css
background-color: #2c3e50; /* fallback if image not available */
```

- [ ] **Step 5: Verify home page renders**

Run: `ng serve`, navigate to `/home`.
Expected: Hero section with overlay text, 6 practice cards in responsive grid, about blurb, CTA section. Clicking a card navigates to `/practices#banking` (etc.).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement home page with hero, practice cards, about blurb, and CTA"
```

---

## Task 5: Practices Page

**Goal:** Build the practices page with accordion layout, deep-linkable via URL fragments.

**Files:**
- Modify: `src/app/app.module.ts` (add MatExpansionModule), `src/app/components/practices/practices.component.ts`, `src/app/components/practices/practices.component.html`, `src/app/components/practices/practices.component.css`

- [ ] **Step 1: Add MatExpansionModule to app.module.ts**

In `src/app/app.module.ts`:
```typescript
import { MatExpansionModule } from '@angular/material/expansion';
```
Add `MatExpansionModule` to `imports`.

- [ ] **Step 2: Build practices component with fragment handling**

Replace `src/app/components/practices/practices.component.ts`:
```typescript
import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatExpansionPanel } from '@angular/material/expansion';

interface PracticeDetail {
  titleKey: string;
  textKey: string;
}

interface PracticeArea {
  id: string;
  titleKey: string;
  subtitleKey: string;
  summaryKey: string;
  details: PracticeDetail[];
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
      id: 'banking',
      titleKey: 'practices.banking.title',
      subtitleKey: 'practices.banking.subtitle',
      summaryKey: 'practices.banking.summary',
      details: [
        { titleKey: 'practices.banking.detail.1.title', textKey: 'practices.banking.detail.1.text' },
        { titleKey: 'practices.banking.detail.2.title', textKey: 'practices.banking.detail.2.text' },
        { titleKey: 'practices.banking.detail.3.title', textKey: 'practices.banking.detail.3.text' },
        { titleKey: 'practices.banking.detail.4.title', textKey: 'practices.banking.detail.4.text' }
      ]
    },
    {
      id: 'recovery',
      titleKey: 'practices.recovery.title',
      subtitleKey: 'practices.recovery.subtitle',
      summaryKey: 'practices.recovery.summary',
      details: []
    },
    {
      id: 'disciplinary',
      titleKey: 'practices.disciplinary.title',
      subtitleKey: 'practices.disciplinary.subtitle',
      summaryKey: 'practices.disciplinary.summary',
      details: []
    },
    {
      id: 'property',
      titleKey: 'practices.property.title',
      subtitleKey: 'practices.property.subtitle',
      summaryKey: 'practices.property.summary',
      details: [
        { titleKey: 'practices.property.detail.1.title', textKey: 'practices.property.detail.1.text' },
        { titleKey: 'practices.property.detail.2.title', textKey: 'practices.property.detail.2.text' }
      ]
    },
    {
      id: 'civil',
      titleKey: 'practices.civil.title',
      subtitleKey: 'practices.civil.subtitle',
      summaryKey: 'practices.civil.summary',
      details: [
        { titleKey: 'practices.civil.detail.1.title', textKey: 'practices.civil.detail.1.text' },
        { titleKey: 'practices.civil.detail.2.title', textKey: 'practices.civil.detail.2.text' }
      ]
    },
    {
      id: 'criminal',
      titleKey: 'practices.criminal.title',
      subtitleKey: 'practices.criminal.subtitle',
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

  ngAfterViewInit(): void {
    this.openFragmentPanel();
  }

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
```

- [ ] **Step 3: Build practices template**

Replace `src/app/components/practices/practices.component.html`:
```html
<div class="page-header">
  <div class="container">
    <h1>{{ 'practices.title' | translate }}</h1>
    <p>{{ 'practices.subtitle' | translate }}</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <mat-accordion multi>
      <mat-expansion-panel *ngFor="let area of practiceAreas" [id]="area.id" class="mb-3">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <strong>{{ area.titleKey | translate }}</strong>
          </mat-panel-title>
          <mat-panel-description class="d-none d-md-block">
            {{ area.subtitleKey | translate }}
          </mat-panel-description>
        </mat-expansion-panel-header>

        <p class="practice-summary">{{ area.summaryKey | translate }}</p>

        <div *ngIf="area.details.length > 0" class="practice-details mt-3">
          <div *ngFor="let detail of area.details" class="detail-item mb-3">
            <h6>{{ detail.titleKey | translate }}</h6>
            <p>{{ detail.textKey | translate }}</p>
          </div>
        </div>
      </mat-expansion-panel>
    </mat-accordion>
  </div>
</section>
```

- [ ] **Step 4: Add practices page styles**

Replace `src/app/components/practices/practices.component.css`:
```css
.practice-summary {
  font-size: 1.05rem;
  color: #444;
}

.detail-item h6 {
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.detail-item p {
  color: #555;
  line-height: 1.7;
}
```

- [ ] **Step 5: Verify practices page**

Run: `ng serve`, navigate to `/practices`. Also navigate from home page card.
Expected: All 6 accordions render with content. Clicking a home page card opens the correct accordion and scrolls to it.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement practices page with accordion layout and deep linking"
```

---

## Task 6: About Page

**Goal:** Populate the about page with premium bio content and qualifications.

**Files:**
- Modify: `src/app/components/about/about.component.html`, `src/app/components/about/about.component.css`

- [ ] **Step 1: Build about page template**

Replace `src/app/components/about/about.component.html`:
```html
<div class="page-header">
  <div class="container">
    <h1>{{ 'about.title' | translate }}</h1>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="bio-section">
          <p class="bio-text">{{ 'about.bio.p1' | translate }}</p>
          <p class="bio-text">{{ 'about.bio.p2' | translate }}</p>
          <p class="bio-text">{{ 'about.bio.p3' | translate }}</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-dark">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h2 class="mb-4">{{ 'about.qualifications.title' | translate }}</h2>
        <p class="mb-3">{{ 'about.qualifications.bar' | translate }}</p>
        <ul class="qualifications-list">
          <li>{{ 'about.qualifications.jd' | translate }}</li>
          <li>{{ 'about.qualifications.llm' | translate }}</li>
          <li>{{ 'about.qualifications.llb' | translate }}</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add about page styles**

Replace `src/app/components/about/about.component.css`:
```css
.bio-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #444;
  margin-bottom: 1.25rem;
}

.qualifications-list {
  list-style: none;
  padding: 0;
}

.qualifications-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1rem;
  color: #555;
}

.qualifications-list li:last-child {
  border-bottom: none;
}
```

- [ ] **Step 3: Verify about page**

Run: `ng serve`, navigate to `/about`.
Expected: Premium bio text with qualifications section below.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/about/
git commit -m "feat: implement about page with premium bio and qualifications"
```

---

## Task 7: FAQs Page

**Goal:** Create the new FAQs page with 6 categories and accordion questions.

**Files:**
- Create: `src/app/components/faqs/faqs.component.ts`, `src/app/components/faqs/faqs.component.html`, `src/app/components/faqs/faqs.component.css`
- Modify: `src/app/app.module.ts` (declare FaqsComponent), `src/app/app-routing.module.ts` (add route)

- [ ] **Step 1: Create FAQs component**

Create `src/app/components/faqs/faqs.component.ts`:
```typescript
import { Component } from '@angular/core';

interface FaqItem {
  questionKey: string;
  answerKey: string;
}

interface FaqCategory {
  titleKey: string;
  items: FaqItem[];
}

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent {
  categories: FaqCategory[] = [
    {
      titleKey: 'faqs.general.title',
      items: Array.from({ length: 5 }, (_, i) => ({
        questionKey: `faqs.general.q${i + 1}`,
        answerKey: `faqs.general.a${i + 1}`
      }))
    },
    {
      titleKey: 'faqs.fees.title',
      items: Array.from({ length: 4 }, (_, i) => ({
        questionKey: `faqs.fees.q${i + 1}`,
        answerKey: `faqs.fees.a${i + 1}`
      }))
    },
    {
      titleKey: 'faqs.process.title',
      items: Array.from({ length: 4 }, (_, i) => ({
        questionKey: `faqs.process.q${i + 1}`,
        answerKey: `faqs.process.a${i + 1}`
      }))
    },
    {
      titleKey: 'faqs.rights.title',
      items: Array.from({ length: 3 }, (_, i) => ({
        questionKey: `faqs.rights.q${i + 1}`,
        answerKey: `faqs.rights.a${i + 1}`
      }))
    },
    {
      titleKey: 'faqs.practical.title',
      items: Array.from({ length: 4 }, (_, i) => ({
        questionKey: `faqs.practical.q${i + 1}`,
        answerKey: `faqs.practical.a${i + 1}`
      }))
    },
    {
      titleKey: 'faqs.specific.title',
      items: Array.from({ length: 12 }, (_, i) => ({
        questionKey: `faqs.specific.q${i + 1}`,
        answerKey: `faqs.specific.a${i + 1}`
      }))
    }
  ];
}
```

- [ ] **Step 2: Create FAQs template**

Create `src/app/components/faqs/faqs.component.html`:
```html
<div class="page-header">
  <div class="container">
    <h1>{{ 'faqs.title' | translate }}</h1>
  </div>
</div>

<section class="section">
  <div class="container">
    <div *ngFor="let category of categories" class="faq-category mb-5">
      <h3 class="category-title mb-3">{{ category.titleKey | translate }}</h3>
      <mat-accordion>
        <mat-expansion-panel *ngFor="let item of category.items" class="mb-2">
          <mat-expansion-panel-header>
            <mat-panel-title>
              {{ item.questionKey | translate }}
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p class="faq-answer">{{ item.answerKey | translate }}</p>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create FAQs styles**

Create `src/app/components/faqs/faqs.component.css`:
```css
.category-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--primary-color);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color);
  display: inline-block;
}

.faq-answer {
  line-height: 1.7;
  color: #555;
}
```

- [ ] **Step 4: Register FaqsComponent in app.module.ts and add route**

In `src/app/app.module.ts`, add:
```typescript
import { FaqsComponent } from './components/faqs/faqs.component';
```
Add `FaqsComponent` to `declarations`.

In `src/app/app-routing.module.ts`, add the route (before the wildcard):
```typescript
import { FaqsComponent } from './components/faqs/faqs.component';
```
Add to routes array:
```typescript
{
  path: "faqs",
  component: FaqsComponent
},
```

- [ ] **Step 5: Verify FAQs page**

Run: `ng serve`, navigate to `/faqs`.
Expected: 6 category sections with accordion questions. All 32 questions render with answers.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement FAQs page with 6 categories and 32 accordion questions"
```

---

## Task 8: Contact Page with Web3Forms

**Goal:** Build the contact page with form (Web3Forms), office details, and Google Maps embed.

**Files:**
- Create: `src/app/services/contact.service.ts`
- Modify: `src/app/components/contact/contact.component.ts`, `src/app/components/contact/contact.component.html`, `src/app/components/contact/contact.component.css`, `src/app/app.module.ts` (add ReactiveFormsModule, MatInputModule, MatFormFieldModule)

- [ ] **Step 1: Create ContactService**

Create `src/app/services/contact.service.ts`:
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Web3FormsResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private endpoint = 'https://api.web3forms.com/submit';

  constructor(private http: HttpClient) {}

  submitForm(data: { name: string; email: string; phone?: string; subject: string; message: string }): Observable<Web3FormsResponse> {
    const formData = {
      access_key: environment.web3formsAccessKey,
      ...data
    };
    return this.http.post<Web3FormsResponse>(this.endpoint, formData);
  }
}
```

- [ ] **Step 2: Add Material form modules to app.module.ts**

In `src/app/app.module.ts`:
```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
```
Add `ReactiveFormsModule`, `MatInputModule`, `MatFormFieldModule` to `imports`.

- [ ] **Step 3: Build contact component**

Replace `src/app/components/contact/contact.component.ts`:
```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  formState: 'idle' | 'submitting' | 'success' | 'error' = 'idle';

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) return;

    this.formState = 'submitting';
    this.contactService.submitForm(this.contactForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.formState = 'success';
          this.contactForm.reset();
        } else {
          this.formState = 'error';
        }
      },
      error: () => {
        this.formState = 'error';
      }
    });
  }

  resetForm(): void {
    this.formState = 'idle';
  }
}
```

- [ ] **Step 4: Build contact template**

Replace `src/app/components/contact/contact.component.html`:
```html
<div class="page-header">
  <div class="container">
    <h1>{{ 'contact.title' | translate }}</h1>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="row g-5">
      <!-- Contact Form -->
      <div class="col-12 col-md-7">
        <div *ngIf="formState === 'success'" class="alert alert-success">
          {{ 'contact.form.success' | translate }}
          <button class="btn btn-sm btn-outline-success ms-3" (click)="resetForm()">Send Another</button>
        </div>

        <div *ngIf="formState === 'error'" class="alert alert-danger">
          {{ 'contact.form.error' | translate }}
          <button class="btn btn-sm btn-outline-danger ms-3" (click)="resetForm()">Try Again</button>
        </div>

        <form *ngIf="formState === 'idle' || formState === 'submitting'"
              [formGroup]="contactForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="w-100 mb-2">
            <mat-label>{{ 'contact.form.name' | translate }}</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100 mb-2">
            <mat-label>{{ 'contact.form.email' | translate }}</mat-label>
            <input matInput formControlName="email" type="email">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100 mb-2">
            <mat-label>{{ 'contact.form.phone' | translate }}</mat-label>
            <input matInput formControlName="phone" type="tel">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100 mb-2">
            <mat-label>{{ 'contact.form.subject' | translate }}</mat-label>
            <input matInput formControlName="subject">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100 mb-2">
            <mat-label>{{ 'contact.form.message' | translate }}</mat-label>
            <textarea matInput formControlName="message" rows="5"></textarea>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit"
                  [disabled]="contactForm.invalid || formState === 'submitting'" class="submit-btn">
            {{ formState === 'submitting' ? ('contact.form.sending' | translate) : ('contact.form.submit' | translate) }}
          </button>
        </form>
      </div>

      <!-- Office Details -->
      <div class="col-12 col-md-5">
        <h3 class="mb-3">{{ 'contact.office.title' | translate }}</h3>
        <div class="office-details mb-4">
          <div class="detail-item mb-3">
            <span class="fa-solid fa-location-dot text-danger me-2"></span>
            <div>
              <p class="mb-0">{{ 'contact.office.address.line1' | translate }}</p>
              <p class="mb-0">{{ 'contact.office.address.line2' | translate }}</p>
              <p class="mb-0">{{ 'contact.office.address.line3' | translate }}</p>
              <p class="mb-0">{{ 'contact.office.address.line4' | translate }}</p>
            </div>
          </div>
          <div class="detail-item mb-3">
            <span class="fa-solid fa-phone me-2"></span>
            <span>{{ 'contact.office.phone' | translate }}</span>
          </div>
          <div class="detail-item mb-3">
            <span class="fa-solid fa-envelope me-2"></span>
            <span>{{ 'contact.office.email' | translate }}</span>
          </div>
        </div>

        <!-- Google Maps Embed -->
        <div class="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3484.5!2d79.5186!3d29.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDEzJzA1LjkiTiA3OcKwMzEnMDYuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%" height="300" style="border:0; border-radius: 8px;" allowfullscreen="" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </div>
  </div>
</section>
```

Note for implementer: Replace the Google Maps embed `src` URL with the actual embed URL from the Google Maps link already in the footer: `https://maps.app.goo.gl/M4t5vNnNkSK7KEFK6`. Generate the proper embed URL from Google Maps.

- [ ] **Step 5: Add contact page styles**

Replace `src/app/components/contact/contact.component.css`:
```css
.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.detail-item span:first-child {
  color: var(--primary-color);
  min-width: 1.25rem;
  padding-top: 0.2rem;
}

.submit-btn {
  padding: 0.5rem 2rem;
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

- [ ] **Step 6: Verify contact page**

Run: `ng serve`, navigate to `/contact`.
Expected: Form with 5 fields, office details on the right (stacked on mobile), map embed. Submit the form and verify Web3Forms integration works (sends to the registered email).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: implement contact page with Web3Forms and office details"
```

---

## Task 9: Blog Placeholder & Footer Updates

**Goal:** Update blog page to "Coming Soon" and refresh the footer.

**Files:**
- Modify: `src/app/components/blog/blog.component.html`, `src/app/components/blog/blog.component.css`, `src/app/footer/footer/footer.component.html`

- [ ] **Step 1: Build blog placeholder**

Replace `src/app/components/blog/blog.component.html`:
```html
<div class="page-header">
  <div class="container">
    <h1>{{ 'blog.title' | translate }}</h1>
  </div>
</div>

<section class="section text-center">
  <div class="container">
    <div class="coming-soon">
      <span class="fa-solid fa-pen-nib coming-icon mb-4"></span>
      <h2>{{ 'blog.coming_soon' | translate }}</h2>
      <p class="text-muted mt-3">{{ 'blog.message' | translate }}</p>
      <a routerLink="/home" class="btn btn-outline-primary mt-4">Back to Home</a>
    </div>
  </div>
</section>
```

Replace `src/app/components/blog/blog.component.css`:
```css
.coming-soon {
  padding: 3rem 0;
}

.coming-icon {
  font-size: 3rem;
  color: var(--primary-color);
  display: block;
}
```

- [ ] **Step 2: Update footer copyright year and add nav links**

Update `src/app/footer/footer/footer.component.html` — in the desktop copyright section, change `2025` to `2026`. In the mobile section, change `2024` to `2026`. Update the "Disclaimer | Site Map" text to be functional links where possible.

- [ ] **Step 3: Verify**

Run: `ng serve`. Check blog page shows "Coming Soon". Check footer has updated year.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add blog coming soon placeholder and update footer"
```

---

## Task 10: Header Navigation Update

**Goal:** Ensure header nav order matches spec: Home, About, Practices, FAQs, Blog, Contact.

**Files:**
- Modify: `src/app/header/header/header.component.html`

- [ ] **Step 1: Reorder nav links**

Update the nav links in `src/app/header/header/header.component.html` to match this order:
```html
<ul class="navbar-nav ms-auto">
    <li class="nav-item">
        <a routerLink="/home" class="nav-link base-color">{{ 'nav.home' | translate }}</a>
    </li>
    <li class="nav-item">
        <a routerLink="/about" class="nav-link base-color">{{ 'nav.about' | translate }}</a>
    </li>
    <li class="nav-item">
        <a routerLink="/practices" class="nav-link base-color">{{ 'nav.practices' | translate }}</a>
    </li>
    <li class="nav-item">
        <a routerLink="/faqs" class="nav-link base-color">{{ 'nav.faqs' | translate }}</a>
    </li>
    <li class="nav-item">
        <a routerLink="/blog" class="nav-link base-color">{{ 'nav.blog' | translate }}</a>
    </li>
    <li class="nav-item">
        <a routerLink="/contact" class="nav-link base-color">{{ 'nav.contact' | translate }}</a>
    </li>
    <li class="nav-item">
        <button class="btn nav-link base-color lang-toggle" (click)="toggleLanguage()">
            {{ translationService.currentLanguage === 'en' ? 'HI' : 'EN' }}
        </button>
    </li>
</ul>
```

- [ ] **Step 2: Verify nav order and responsiveness**

Run: `ng serve`. Check desktop nav shows correct order. Resize to mobile and verify hamburger menu works with all links.

- [ ] **Step 3: Commit**

```bash
git add src/app/header/
git commit -m "style: reorder navigation links to match spec"
```

---

## Task 11: Build, Deploy, and Verify

**Goal:** Build for production, deploy to docs/, and verify the site works.

**Files:**
- Modify: `docs/` (build output)

- [ ] **Step 1: Run production build**

Run: `npm run deploy`
Expected: Build succeeds, files copied to `docs/`, `404.html` created.

- [ ] **Step 2: Verify docs/ folder contents**

Check that `docs/` contains: `index.html`, `404.html`, `CNAME`, built JS/CSS bundles, assets folder with `i18n/`, `images/`, `fonts/`.

- [ ] **Step 3: Test locally with a static server**

Run: `npx serve docs`
Navigate to `http://localhost:3000`. Test:
- All pages load correctly
- Direct URL navigation works (e.g., `/about` — 404.html redirect)
- Practice area deep linking from home cards
- Contact form submission
- Language toggle
- Mobile responsiveness (use browser dev tools)
- Disclaimer modal on first visit

- [ ] **Step 4: Commit the build output**

```bash
git add docs/
git commit -m "build: production build for deployment"
```

---

## Summary

| Task | Description | Dependencies |
|------|-------------|--------------|
| 1 | Project infrastructure & security cleanup | None |
| 2 | Translation infrastructure (i18n) | Task 1 |
| 3 | Global styles & layout foundation | Task 1 |
| 4 | Home page | Tasks 2, 3 |
| 5 | Practices page | Tasks 2, 3 |
| 6 | About page | Tasks 2, 3 |
| 7 | FAQs page | Tasks 2, 3 |
| 8 | Contact page with Web3Forms | Tasks 2, 3 |
| 9 | Blog placeholder & footer updates | Task 2 |
| 10 | Header navigation update | Task 2 |
| 11 | Build, deploy, verify | All above |

Tasks 4-10 can be executed in parallel after Tasks 1-3 are complete. **Note:** Tasks 5, 7, and 8 all modify `app.module.ts` (adding Material modules, FaqsComponent, ReactiveFormsModule). If run in parallel by different agents, consolidate `app.module.ts` changes afterward to avoid merge conflicts.

**CLAUDE.md:** Already created at project root during the brainstorming phase. Update it after implementation if any conventions or commands change.
