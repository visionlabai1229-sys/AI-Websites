import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://localhost:3000';

const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
  ],
});
const context = browser.defaultBrowserContext();
await context.overridePermissions(url, ['microphone']);

const page = await browser.newPage();
page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
page.on('pageerror', err => console.log('PAGEERROR:', err.message));
page.on('requestfailed', req => console.log('REQFAILED:', req.url(), req.failure()?.errorText));
page.on('response', async res => {
  if (res.url().includes('create-web-call') || res.url().includes('retell')) {
    console.log('RESPONSE:', res.status(), res.url());
    if (res.url().includes('create-web-call')) {
      try { console.log('BODY:', await res.text()); } catch(e) { console.log('BODY ERR', e.message); }
    }
  }
});

await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

await page.click('#demo-btn');

// wait to see what happens
await new Promise(r => setTimeout(r, 15000));

const title = await page.$eval('#demo-btn', el => el.title);
console.log('BUTTON TITLE AFTER CLICK:', title);

await browser.close();
