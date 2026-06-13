/**
 * Downloads about page hero image (MEP / engineering themed).
 * Run: node scripts/fetch-about-images.mjs
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'about');

const images = [
  {
    file: 'about-hero.jpg',
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1920&q=85',
    credit: 'Unsplash — MEP plant engineering team',
  },
];

await fs.mkdir(outDir, { recursive: true });

for (const image of images) {
  const dest = path.join(outDir, image.file);
  const res = await fetch(image.url);
  if (!res.ok) throw new Error(`Failed ${image.file}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  console.log(`✓ ${image.file} (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log('\nAbout page images saved to public/images/about/');
