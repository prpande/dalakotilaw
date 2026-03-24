const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://dalakotilaw.com';
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const BLOG_MANIFEST = path.join(DOCS_DIR, 'blog', 'index.json');
const OUTPUT = path.join(DOCS_DIR, 'sitemap.xml');

const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { path: '/',          priority: '1.0', changefreq: 'weekly' },
  { path: '/home',      priority: '1.0', changefreq: 'weekly' },
  { path: '/about',     priority: '0.8', changefreq: 'monthly' },
  { path: '/practices', priority: '0.9', changefreq: 'monthly' },
  { path: '/contact',   priority: '0.8', changefreq: 'monthly' },
  { path: '/faqs',      priority: '0.8', changefreq: 'monthly' },
  { path: '/blog',      priority: '0.8', changefreq: 'weekly' },
];

function main() {
  const urls = staticRoutes.map(route => `
  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`);

  if (fs.existsSync(BLOG_MANIFEST)) {
    const manifest = JSON.parse(fs.readFileSync(BLOG_MANIFEST, 'utf-8'));
    for (const post of manifest) {
      urls.push(`
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>
`;

  fs.writeFileSync(OUTPUT, sitemap);
  console.log(`Generated sitemap with ${urls.length} URL(s).`);
}

main();
