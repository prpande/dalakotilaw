# Dalakoti Law

Official website for **Dalakoti Law** ([dalakotilaw.com](https://dalakotilaw.com)) — the online presence of Chamber of Aditi Dalakoti.

## Tech Stack

- **Framework:** Angular 16
- **UI:** Angular Material + Bootstrap 5
- **Language:** TypeScript
- **Deployment:** GitHub Pages

## Getting Started

```bash
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## Build & Deploy

```bash
ng build
```

Build output goes to `dist/dalakotilaw/`. To deploy:

1. Copy build output to `docs/`
2. Copy `docs/index.html` to `docs/404.html` (enables SPA routing on GitHub Pages)
3. Ensure `docs/CNAME` exists with `dalakotilaw.com`
4. Commit and push to `master`

## Project Structure

```
src/
├── app/
│   ├── components/     # Page components (home, about, blog, contact, practices, disclaimer)
│   ├── header/         # Header module
│   ├── footer/         # Footer module
│   ├── contact/        # Contact feature module
│   └── services/       # Application services
├── assets/
│   ├── i18n/           # Translation files (en.json, hi.json)
│   ├── images/         # Static images
│   └── fonts/          # Custom fonts
info/                   # Markdown content source files
docs/                   # Built output served by GitHub Pages (do not edit directly)
```

## Testing

```bash
ng test
```

Runs unit tests via Karma/Jasmine.
