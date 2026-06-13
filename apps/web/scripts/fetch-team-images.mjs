/**
 * Downloads team page hero image (MEP / construction engineering team).
 * Run: node scripts/fetch-team-images.mjs
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'team');

const images = [
  {
    file: 'team-hero.jpg',
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1920&q=85',
    credit: 'Unsplash — MEP engineers collaborating on site',
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

console.log('\nTeam page images saved to public/images/team/');
