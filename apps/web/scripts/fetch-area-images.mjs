/**
 * Downloads business-area panel images (one per service category).
 * Run: node scripts/fetch-area-images.mjs
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'areas');

/** Order matches businessAreaKeys in lib/data.ts */
const areas = [
  {
    file: 'mechanical.jpg',
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&h=900&q=85',
  },
  {
    file: 'hvac.jpg',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&h=900&q=85',
  },
  {
    file: 'electrical.jpg',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&h=900&q=85',
  },
  {
    file: 'fire.jpg',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&h=900&q=85',
  },
  {
    file: 'water.jpg',
    url: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=1600&h=900&q=85',
  },
  {
    file: 'it.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&h=900&q=85',
  },
  {
    file: 'design.jpg',
    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1600&h=900&q=85',
  },
];

await fs.mkdir(outDir, { recursive: true });

for (const area of areas) {
  const dest = path.join(outDir, area.file);
  const res = await fetch(area.url);
  if (!res.ok) throw new Error(`Failed ${area.file}: ${res.status} ${area.url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  console.log(`✓ ${area.file} (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log('\nBusiness area images saved to public/images/areas/');
