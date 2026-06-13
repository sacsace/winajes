/**
 * Downloads main hero slide images (engineering / MEP themed).
 * Source: Unsplash (free to use). Run: node scripts/fetch-hero-images.mjs
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'hero');

/** Slide order matches home.hero.slides in messages */
const slides = [
  {
    file: 'hero-slide-1.jpg',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=85',
    credit: 'Unsplash — industrial engineering',
  },
  {
    file: 'hero-slide-2.jpg',
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1920&q=85',
    credit: 'Unsplash — MEP / plant engineering',
  },
  {
    file: 'hero-slide-3.jpg',
    url: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1920&q=85',
    credit: 'Unsplash — manufacturing plant',
  },
  {
    file: 'hero-slide-4.jpg',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=85',
    credit: 'Unsplash — construction site',
  },
];

await fs.mkdir(outDir, { recursive: true });

for (const slide of slides) {
  const dest = path.join(outDir, slide.file);
  const res = await fetch(slide.url);
  if (!res.ok) throw new Error(`Failed ${slide.file}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  console.log(`✓ ${slide.file} (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log('\nHero slide images saved to public/images/hero/');
