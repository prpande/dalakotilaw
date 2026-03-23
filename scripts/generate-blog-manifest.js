const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '..', 'docs', 'blog', 'posts');
const OUTPUT = path.join(__dirname, '..', 'docs', 'blog', 'index.json');
const REQUIRED_FIELDS = ['slug', 'date', 'title', 'summary', 'image'];

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.writeFileSync(OUTPUT, '[]');
    console.log('No posts directory found. Wrote empty manifest.');
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const grouped = {};

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);

    const missing = REQUIRED_FIELDS.filter(f => !data[f]);
    if (missing.length > 0) {
      console.warn(`WARNING: Skipping ${file} — missing fields: ${missing.join(', ')}`);
      continue;
    }

    const langMatch = file.match(/\.(\w+)\.md$/);
    const lang = langMatch ? langMatch[1] : 'en';
    const slug = data.slug;

    if (!grouped[slug]) {
      grouped[slug] = {
        slug,
        date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : String(data.date),
        image: data.image,
        tags: data.tags || [],
      };
    }

    grouped[slug][lang] = {
      title: data.title,
      summary: data.summary,
    };
  }

  const manifest = Object.values(grouped)
    .filter(entry => entry.en) // must have at least English
    .sort((a, b) => b.date.localeCompare(a.date));

  fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2));
  console.log(`Generated manifest with ${manifest.length} post(s).`);
}

main();
