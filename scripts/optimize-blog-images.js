const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const IMAGES_DIR = path.resolve(__dirname, '..', 'docs', 'blog', 'images');
const MANIFEST_PATH = path.join(IMAGES_DIR, '.optimized.json');

const MAX_WIDTH = 1200;
const JPG_QUALITY = 75;
const WEBP_QUALITY = 75;
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const RESIZE_OPTIONS = { width: MAX_WIDTH, withoutEnlargement: true };

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function fileHash(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(data).digest('hex');
}

async function optimizeImage(filePath, manifest) {
  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath, ext);
  const jpgPath = path.join(IMAGES_DIR, `${baseName}.jpg`);
  const webpPath = path.join(IMAGES_DIR, `${baseName}.webp`);

  const hash = fileHash(filePath);
  if (manifest[baseName] === hash) {
    console.log(`  Skipping ${path.basename(filePath)} (unchanged)`);
    return;
  }

  console.log(`  Processing ${path.basename(filePath)}...`);
  const originalSize = fs.statSync(filePath).size;

  // Read source into buffer so sharp doesn't hold a file handle open.
  // On Windows, an open handle prevents writing back to the same path.
  const sourceBuffer = fs.readFileSync(filePath);

  const image = sharp(sourceBuffer).resize(RESIZE_OPTIONS);

  // Generate JPG
  const jpgBuffer = await image
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: JPG_QUALITY })
    .toBuffer();

  // Keep smaller version for JPG (only when source is already JPG)
  if (ext === '.jpg' || ext === '.jpeg') {
    if (jpgBuffer.length < originalSize) {
      fs.writeFileSync(jpgPath, jpgBuffer);
      console.log(`    JPG: ${(originalSize / 1024).toFixed(0)} KB -> ${(jpgBuffer.length / 1024).toFixed(0)} KB`);
    } else {
      console.log(`    JPG: kept original (${(originalSize / 1024).toFixed(0)} KB, optimized was larger)`);
    }
  } else {
    // Source is PNG — always write the JPG replacement
    fs.writeFileSync(jpgPath, jpgBuffer);
    console.log(`    JPG: ${(originalSize / 1024).toFixed(0)} KB (PNG) -> ${(jpgBuffer.length / 1024).toFixed(0)} KB`);
  }

  // Generate WebP
  const webpBuffer = await sharp(sourceBuffer)
    .resize(RESIZE_OPTIONS)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  fs.writeFileSync(webpPath, webpBuffer);
  console.log(`    WebP: ${(webpBuffer.length / 1024).toFixed(0)} KB`);

  // Delete original PNG (now replaced by JPG)
  if (ext === '.png') {
    fs.unlinkSync(filePath);
    console.log(`    Deleted original PNG`);
  }

  // Update manifest with hash of the current JPG on disk.
  // For JPG sources where the original was kept (optimized was larger), jpgPath and
  // filePath are the same file, so this hash still correctly matches on re-run.
  manifest[baseName] = fileHash(jpgPath);
}

async function main() {
  console.log('Optimizing blog images...');

  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('No blog images directory found. Skipping.');
    return;
  }

  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .map(f => path.join(IMAGES_DIR, f));

  if (files.length === 0) {
    console.log('No images to optimize.');
    return;
  }

  const manifest = loadManifest();

  for (const file of files) {
    try {
      await optimizeImage(file, manifest);
    } catch (err) {
      console.warn(`  WARNING: Failed to optimize ${path.basename(file)}: ${err.message}`);
    }
  }

  saveManifest(manifest);
  console.log('Done.');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
