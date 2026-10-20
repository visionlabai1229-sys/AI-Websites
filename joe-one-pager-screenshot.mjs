import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'temporary screenshots');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, 'joe-one-pager.png');

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000/joe-one-pager.html', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
await browser.close();

console.log(`Saved: ${outPath}`);
