import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'carousel-slides');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const BASE = 'http://localhost:3000/carousel.html';
const TOTAL = 8;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

for (let i = 1; i <= TOTAL; i++) {
  await page.goto(`${BASE}?slide=${i}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  const path = join(outDir, `slide-${i}.png`);
  await page.screenshot({ path, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  console.log(`Saved: ${path}`);
}

await browser.close();
console.log(`\nAll ${TOTAL} slides saved to: ${outDir}`);
