// Local release QA only. No real PHP execution, SMTP acceptance or delivery simulation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const publicRoot = path.resolve(process.env.WASHBAR_RELEASE_PUBLIC || 'release-output/production/public');
const evidence = path.resolve(process.env.WASHBAR_QA_EVIDENCE || '/private/tmp/washbar-launch02-browser');
const iconCache = process.env.WASHBAR_LUCIDE_CACHE || '/private/tmp/washbar-protected-qa-lucide.min.js';
const manifest = JSON.parse(fs.readFileSync(path.join(publicRoot, '../manifest.json'), 'utf8'));
assert.equal(manifest.environment, 'production');
fs.mkdirSync(evidence, { recursive: true });
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const server = http.createServer((request, response) => {
  let name;
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.startsWith('/v4-enquiry-test/')) pathname = pathname.slice('/v4-enquiry-test'.length);
    name = path.resolve(publicRoot, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
  } catch { response.writeHead(400).end(); return; }
  const relative = path.relative(publicRoot, name);
  const type = mime[path.extname(name)];
  if (relative.startsWith('..') || !type || relative.startsWith('api/')) {
    response.writeHead(404).end(); return;
  }
  fs.readFile(name, (error, body) => {
    if (error) { response.writeHead(404).end(); return; }
    response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' }).end(body);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  const results = [];
  try {
    for (const width of [320, 390, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await context.route('https://unpkg.com/**', route => route.fulfill({ contentType: 'application/javascript', path: iconCache }));
      await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
      await context.route('**/api/enquiry-config.php', route => route.fulfill({ contentType: 'application/json', body: '{"available":true}' }));
      await context.route('**/api/enquiry.php', () => { throw new Error('Unexpected email POST during render/journey QA.'); });
      for (const route of manifest.routes) {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
        page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
        const url = origin + '/' + route.replace(/index\.html$/, '');
        const response = await page.goto(url, { waitUntil: 'load' });
        assert.equal(response.status(), 200);
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route} overflow at ${width}`);
        assert.deepEqual(await page.locator('#primary-menu a').allTextContents(),
          ['Services', 'Reviews', 'Commercial', 'Our Story', 'Blog', 'Franchise', 'Locations', 'Contact']);
        assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'index,follow');
        await page.screenshot({ path: path.join(evidence, `${route.replaceAll('/', '-')}-${width}.png`) });
        const toggle = page.locator('.menu-toggle');
        if (await toggle.isVisible()) {
          await toggle.click();
          assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
          await page.keyboard.press('Escape');
          assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
          assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
        }
        if (route.startsWith('locations/')) {
          const opener = page.locator('button.store-photo-main');
          await opener.click();
          const dialog = page.getByRole('dialog');
          await dialog.waitFor({ state: 'visible' });
          const previous = await dialog.locator('.gallery-counter').innerText();
          await page.keyboard.press('ArrowRight');
          assert.notEqual(await dialog.locator('.gallery-counter').innerText(), previous);
          await page.keyboard.press('Escape');
          await dialog.waitFor({ state: 'hidden' });
          assert.equal(await opener.evaluate(el => el === document.activeElement), true);
        }
        if (route === 'index.html') {
          await page.waitForFunction(() => !document.querySelector('[data-enquiry-submit]').disabled);
          for (const [fragment, type] of [['#contact-commercial', 'Commercial laundry'],
            ['#contact-franchise', 'Franchise enquiry'], ['#contact-community', 'Community partnership']]) {
            await page.locator(`a.button[href="${fragment}"]`).click();
            assert.equal(await page.locator('#enquiry-type').inputValue(), type);
          }
          const sticky = page.locator('.mobile-cta-bar a[href="#enquiry"]');
          if (await sticky.isVisible()) {
            await sticky.click();
          } else {
            await page.goto(origin + '/#enquiry', { waitUntil: 'load' });
          }
          assert.equal(await page.locator('#enquiry-type').inputValue(), 'General enquiry');
          assert.equal(await page.locator('[data-enquiry-submit]').evaluate(el => el.getBoundingClientRect().height >= 44), true);
          await page.locator('#enquiry-form').screenshot({ path: path.join(evidence, `enquiry-${width}.png`) });
        }
        if (route.includes('airbnb-laundry-turnover-guide')) {
          await page.getByRole('link', { name: 'Enquire about commercial laundry', exact: true }).click();
          await page.waitForURL('**/index.html#contact-commercial');
          await page.waitForFunction(() => document.querySelector('#enquiry-type')?.value === 'Commercial laundry');
          assert.equal(await page.locator('#enquiry-type').inputValue(), 'Commercial laundry');
        }
        assert.deepEqual(errors, [], `${route} at ${width}`);
        results.push({ route, width, rendering: 'pass', navigation: 'pass', overflow: false, consoleErrors: errors });
        await page.close();
      }
      await context.close();
      process.stdout.write(`Passed 13 routes at ${width}px.\n`);
    }
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    for (const route of manifest.routes) {
      const page = await noJS.newPage();
      await page.route('https://unpkg.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
      await page.goto(origin + '/' + route, { waitUntil: 'load' });
      assert.equal(await page.locator('h1').isVisible(), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (route === 'index.html') {
        assert.equal(await page.locator('[data-enquiry-submit]').isDisabled(), true);
        assert.equal(await page.locator('noscript').isVisible(), true);
        assert.equal(await page.locator('.enquiry-fallback a').getAttribute('href'), 'tel:+61430455920');
      }
      await page.close();
    }
    await noJS.close();
    fs.writeFileSync(path.join(evidence, 'report.json'), JSON.stringify({ results, noJSRoutes: 13,
      reducedMotion: true, smtpTested: false, productionDeployed: false }, null, 2));
    process.stdout.write(`Release browser QA passed: ${results.length} route/viewports, 13 no-JS routes. No SMTP submission.\n`);
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; server.close(); });
