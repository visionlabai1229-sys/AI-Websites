import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, 'temporary screenshots');

if (!existsSync(screenshotsDir)) mkdirSync(screenshotsDir, { recursive: true });

// Auto-increment screenshot number
function nextIndex(label) {
  const files = existsSync(screenshotsDir) ? readdirSync(screenshotsDir) : [];
  const nums = files
    .map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1]))
    .filter(Boolean);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return label
    ? join(screenshotsDir, `screenshot-${next}-${label}.png`)
    : join(screenshotsDir, `screenshot-${next}.png`);
}

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const outPath = nextIndex(label);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

// Let animations settle
await new Promise(r => setTimeout(r, 1500));

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outPath}`);
