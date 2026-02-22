import puppeteer from 'puppeteer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, readdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, 'temporary screenshots');
if (!existsSync(screenshotsDir)) mkdirSync(screenshotsDir, { recursive: true });

function nextIndex() {
  const files = existsSync(screenshotsDir) ? readdirSync(screenshotsDir) : [];
  const nums = files.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1])).filter(Boolean);
  return nums.length ? Math.max(...nums) + 1 : 1;
}

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));

const labels = ['hero','horizons','transport','energy','space','ai','infracore','vision','partners','team','contact'];
let idx = nextIndex();

for (let i = 0; i < labels.length; i++) {
  // Click the i-th dot
  await page.evaluate((dotIdx) => {
    const dots = document.querySelectorAll('.dot');
    if (dots[dotIdx]) dots[dotIdx].click();
  }, i);
  await new Promise(r => setTimeout(r, 800));
  const path = join(screenshotsDir, `screenshot-${idx}-${labels[i]}.png`);
  await page.screenshot({ path });
  console.log(`Saved: screenshot-${idx}-${labels[i]}.png`);
  idx++;
}

await browser.close();
