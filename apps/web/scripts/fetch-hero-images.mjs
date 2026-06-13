/**
 * Downloads main hero slide images (engineering / MEP / electrical / piping).
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
    url: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1920&q=85',
    credit: 'Unsplash — manufacturing plant piping / mechanical',
  },
  {
    file: 'hero-slide-3.jpg',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1920&q=85',
    credit: 'Unsplash — MEP HVAC ductwork',
  },
  {
    file: 'hero-slide-4.jpg',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1920&q=85',
    credit: 'Unsplash — electrical engineering / panel',
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
