// Exports linkedin-banner.html as a 1584x396 PNG.
// Usage (from outputs/website/): bash run.sh node linkedin-banner-screenshot.mjs [label] [--guides]
//   --guides  renders the avatar overlap mock + alignment lines into "temporary screenshots/"
//             (gitignored) so guide renders never mix with real exports.
import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const guides = args.includes('--guides');
const label = args.filter(a => !a.startsWith('--'))[0] || '';

const outDir = guides ? join(__dirname, 'temporary screenshots') : join(__dirname, 'linkedin-banner');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// Auto-increment output filename
const prefix = guides ? 'linkedin-banner-guides-' : 'linkedin-banner-';
const nums = readdirSync(outDir)
  .map(f => f.startsWith(prefix) ? parseInt(f.slice(prefix.length)) : NaN)
  .filter(n => !Number.isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = `${prefix}${next}${label ? '-' + label : ''}.png`;
const outPath = join(outDir, filename);

const url = 'http://localhost:3000/linkedin-banner.html' + (guides ? '?guides=1' : '');

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1584, height: 396, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1584, height: 396 } });
await browser.close();

console.log(`Saved: ${outPath}`);
