/**
 * Downloads / refreshes page hero images.
 * Run: node scripts/fetch-page-heroes.mjs
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'page-heroes');

const remote = [
  {
    file: 'about-hero.jpg',
    url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=85',
    credit: 'Industrial welding / craftsmanship',
  },
  {
    file: 'team.jpg',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=85',
    credit: 'Construction team on site',
  },
  {
    file: 'services.jpg',
    url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1920&q=85',
    credit: 'Electrical / technical services',
  },
  {
    file: 'projects.jpg',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=85',
    credit: 'Active construction site works',
  },
  {
    file: 'clients.jpg',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=85',
    credit: 'Corporate partnership / skyline',
  },
  {
    file: 'gallery-site.jpg',
    url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=85',
    credit: 'Site metalwork sparks / field gallery',
  },
  {
    file: 'performance-hero.jpg',
    url: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1920&q=85',
    credit: 'High-rise construction / project performance',
  },
];

await fs.mkdir(outDir, { recursive: true });

for (const image of remote) {
  const dest = path.join(outDir, image.file);
  const res = await fetch(image.url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Failed ${image.file}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  console.log(`✓ ${image.file} (${(buf.length / 1024).toFixed(0)} KB) — ${image.credit}`);
}

console.log('\nPage hero images saved to public/images/page-heroes/');
