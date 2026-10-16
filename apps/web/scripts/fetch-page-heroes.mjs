/**
 * Downloads / refreshes page hero images.
 * Note: about.jpg uses local WINAJES gallery mechanical-2 (MEP piping).
 * Run: node scripts/fetch-page-heroes.mjs
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'page-heroes');
const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');
const heroDir = path.join(__dirname, '..', 'public', 'images', 'hero');

const remote = [
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
];

await fs.mkdir(outDir, { recursive: true });

await fs.copyFile(path.join(galleryDir, 'mechanical-2.jpg'), path.join(outDir, 'about.jpg'));
console.log('✓ about.jpg (local MEP piping)');

await fs.copyFile(path.join(heroDir, 'hero-4.jpg'), path.join(outDir, 'performance.jpg'));
console.log('✓ performance.jpg (local factory welding)');

for (const image of remote) {
  const dest = path.join(outDir, image.file);
  const res = await fetch(image.url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Failed ${image.file}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  console.log(`✓ ${image.file} (${(buf.length / 1024).toFixed(0)} KB) — ${image.credit}`);
}

console.log('\nPage hero images saved to public/images/page-heroes/');
