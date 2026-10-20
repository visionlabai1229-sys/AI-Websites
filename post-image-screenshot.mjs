import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'post-slides');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// Auto-increment output filename
const files = readdirSync(outDir);
const nums = files.map(f => parseInt(f.match(/^post-(\d+)/)?.[1])).filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;
const label = process.argv[2] || '';
const filename = label ? `post-${next}-${label}.png` : `post-${next}.png`;
const outPath = join(outDir, filename);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000/post-image.html', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
await browser.close();

console.log(`Saved: ${outPath}`);
