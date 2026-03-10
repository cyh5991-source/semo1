import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROMIUM = '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome';

const adNames = [
  '01_배우자재산',
  '02_자동차',
  '03_90일연체_신용회복',
  '04_사업자',
  '05_새출발기금',
  '06_안되는사람_기준',
  '07_카드값',
  '08_회생회복새출발_비교',
  '09_내상황_자가진단',
  '10_압류전_확인',
];

async function main() {
  const outDir = path.join(__dirname, 'ads');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1200, deviceScaleFactor: 1 });

  const htmlPath = path.join(__dirname, 'meta-ads.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for images to load
  await new Promise(r => setTimeout(r, 3000));

  const cards = await page.$$('.ad-card');
  console.log(`Found ${cards.length} ad cards`);

  for (let i = 0; i < cards.length; i++) {
    const filename = `${adNames[i]}.png`;
    const filepath = path.join(outDir, filename);
    await cards[i].screenshot({ path: filepath, type: 'png' });
    console.log(`✓ Saved: ${filename}`);
  }

  await browser.close();
  console.log(`\nDone! ${cards.length} images saved to ./ads/`);
}

main().catch(console.error);
