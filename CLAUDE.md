# Dalakoti Law Website

## Overview

Law firm website for Dalakoti Law (dalakotilaw.com). Built with Angular 16, deployed to GitHub Pages.

## Tech Stack

- **Framework:** Angular 16.2.0
- **UI:** Angular Material 16.2.14 + Bootstrap 5.3.3
- **Language:** TypeScript 5.1.3
- **Deployment:** GitHub Pages via `docs/` folder on `master` branch

## Commands

- `npm install` — install dependencies
- `ng serve` — dev server at localhost:4200
- `ng build` — production build to `dist/dalakotilaw/`
- `ng test` — run Karma/Jasmine tests

## Deployment

1. `ng build` produces output in `dist/dalakotilaw/`
2. Copy build output to `docs/` folder
3. Copy `index.html` as `404.html` in `docs/` (enables SPA routing on GitHub Pages)
4. Preserve `CNAME` file in `docs/` (points to dalakotilaw.com)
5. Commit and push to `master`

## Directory Structure

- `src/app/components/` — page components (home, about, blog, contact, practices, disclaimer)
- `src/app/header/` — header module
- `src/app/footer/` — footer module
- `src/app/contact/` — contact feature module with form and email service
- `src/app/services/` — application services
- `src/assets/` — static assets (images, fonts)
- `info/` — content source files (markdown) for page content
- `docs/` — built output served by GitHub Pages (do NOT edit directly)

## Conventions

- Angular Material for UI components (dialogs, expansion panels, form fields)
- Bootstrap 5 for grid layout and responsive breakpoints
- Feature modules for distinct areas (header, footer, contact)
- Component-scoped CSS files
- Content authored in `info/*.md`, extracted into components or i18n JSON at build time

## Bilingual Support (Planned)

- English/Hindi via `translate` pipe and JSON files at `assets/i18n/`
- `TranslationService` loads language JSON, stores preference in localStorage
- Language toggle in header, first-visit popup for language selection

## Important Notes

- **No secrets in client code.** The old SMTP.js integration exposed credentials — being replaced with Formspree.
- **CNAME preservation.** The `docs/CNAME` file must survive builds. Keep a copy in `src/assets/`.
- **SPA routing.** `docs/404.html` must be a copy of `index.html` for client-side routing to work on GitHub Pages.
- **Design spec.** Current redesign spec at `docs/superpowers/specs/2026-03-23-dalakotilaw-redesign-design.md`.
