// Failure-only browser fixtures. No SMTP connection or email acceptance simulation.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.WASHBAR_TEST_ORIGIN || 'http://127.0.0.1:4190';
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname),
  'Failure fixtures are restricted to a local QA server.');

async function setup(browser, { width = 390, available = true, path = '/', readinessFailure = null } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  const requests = [];
  const readinessURLs = [];
  const submissionURLs = [];
  const errors = [];
  let result = { status: 503, code: 'delivery_uncertain' };
  let readinessRequests = 0;
  let readinessGate = null;
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://unpkg.com/**', route => route.fulfill({
    contentType: 'application/javascript', body: 'window.lucide = {createIcons() {}};',
  }));
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  await page.route('**/api/enquiry-config.php', async route => {
    readinessRequests++;
    readinessURLs.push(new URL(route.request().url()).pathname);
    assert.equal(await page.locator('[data-enquiry-submit]').isDisabled(), true,
      'Submission enabled while the readiness request was still pending.');
    if (readinessGate) await readinessGate;
    if (readinessFailure === 'network') { await route.abort('failed'); return; }
    if (readinessFailure === 'html') {
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Login required</p>' });
      return;
    }
    await route.fulfill({
      status: readinessFailure === 'http' ? 503 : available ? 200 : 503,
      contentType: 'application/json', body: JSON.stringify({ available: readinessFailure === 'string' ? 'true' : available }),
    });
  });
  await page.route('**/api/enquiry.php', async route => {
    submissionURLs.push(new URL(route.request().url()).pathname);
    requests.push(route.request().postDataJSON());
    await route.fulfill({ status: result.status, contentType: 'application/json', body: JSON.stringify({
      ok: false, code: result.code, message: 'QA rejection only. Email acceptance is not simulated.',
    }) });
  });
  await page.goto(new URL(path, origin).href, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelector('[data-enquiry-form]').getAttribute('aria-busy') === 'false');
  await page.locator('#enquiry-name').fill('QA Customer');
  await page.locator('#enquiry-email').fill('qa@example.invalid');
  await page.locator('#enquiry-message').fill('Original QA message - never deliver.');
  return {
    context, page, requests, errors, readinessURLs, submissionURLs,
    get readinessRequests() { return readinessRequests; },
    setAvailable(value) { available = value; },
    holdReadiness() {
      let release;
      readinessGate = new Promise(resolve => { release = resolve; });
      return () => { readinessGate = null; release(); };
    },
    rejectWith(status, code) { result = { status, code }; },
  };
}

async function attempt(test) {
  await test.page.locator('[data-enquiry-submit]').click();
  await test.page.waitForFunction(() => document.querySelector('[data-enquiry-form]').getAttribute('aria-busy') === 'false');
}

(async () => {
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  try {
    for (const width of [320, 390, 768, 1440]) {
      const unavailable = await setup(browser, { width, available: false });
      assert.equal(unavailable.readinessRequests, 1, 'Page load must check actual backend readiness.');
      assert.equal(await unavailable.page.locator('[data-enquiry-submit]').isDisabled(), true);
      assert.equal(await unavailable.page.locator('[data-enquiry-availability]').isVisible(), true);
      assert.match(await unavailable.page.locator('[data-enquiry-availability]').innerText(), /unavailable/);
      assert.equal(await unavailable.page.locator('.enquiry-status').innerText(), '');
      assert.equal(await unavailable.page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
      await unavailable.page.locator('#enquiry-name').fill('');
      await unavailable.page.locator('[data-enquiry-form]').evaluate(form => form.requestSubmit());
      assert.equal(unavailable.requests.length, 0, 'An unavailable form posted customer details.');
      assert.equal(unavailable.readinessRequests, 1);
      assert.equal(await unavailable.page.locator('[data-enquiry-submit]').isDisabled(), true, 'Input bypassed readiness.');
      unavailable.setAvailable(true);
      await unavailable.page.locator('[data-enquiry-retry]').click();
      await unavailable.page.waitForFunction(() => !document.querySelector('[data-enquiry-submit]').disabled);
      assert.equal(await unavailable.page.locator('[data-enquiry-availability]').isHidden(), true);
      assert.equal(await unavailable.page.locator('[data-enquiry-submit]').evaluate(el => el === document.activeElement), true);
      await unavailable.page.locator('#enquiry-message').focus();
      await unavailable.page.keyboard.press('Tab');
      assert(await unavailable.page.locator('[data-enquiry-submit]').evaluate(el => el === document.activeElement));
      assert.equal(await unavailable.page.locator('[data-enquiry-submit]').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
      await unavailable.page.keyboard.press('Enter');
      assert.equal(unavailable.readinessRequests, 2, 'Invalid fields should not start another readiness request.');
      assert.equal(await unavailable.page.locator('.enquiry-error-summary').evaluate(el => el === document.activeElement), true);
      await unavailable.page.locator('#enquiry-name').fill('QA Customer');
      unavailable.setAvailable(false);
      await attempt(unavailable);
      assert.equal(unavailable.readinessRequests, 3);
      assert.equal(unavailable.requests.length, 0, 'Customer details reached an unavailable backend.');
      assert.match(await unavailable.page.locator('.enquiry-status').innerText(), /couldn't send/);
      assert.equal(await unavailable.page.locator('#enquiry-message').inputValue(), 'Original QA message - never deliver.');
      assert.equal(await unavailable.page.locator('[data-enquiry-submit]').isDisabled(), true);
      unavailable.setAvailable(true);
      unavailable.rejectWith(503, 'smtp_failure');
      await unavailable.page.locator('[data-enquiry-retry]').click();
      await unavailable.page.waitForFunction(() => !document.querySelector('[data-enquiry-submit]').disabled);
      await unavailable.page.locator('#enquiry-message').fill('Edited after readiness failure - never deliver.');
      await attempt(unavailable);
      assert.equal(unavailable.readinessRequests, 5, 'Recovery and submission must each check readiness.');
      assert.equal(unavailable.requests.length, 1, 'Readiness failure incorrectly locked changed details.');
      assert.equal(await unavailable.page.locator('[data-enquiry-submit-label]').innerText(), 'Send enquiry');
      assert.deepEqual(unavailable.errors, []);
      await unavailable.context.close();
    }

    for (const path of ['/', '/index.html', '/v4-enquiry-test/', '/v4-enquiry-test/index.html']) {
      const routed = await setup(browser, { path });
      routed.rejectWith(503, 'smtp_failure');
      const prefix = path.startsWith('/v4-enquiry-test/') ? '/v4-enquiry-test' : '';
      assert.equal(await routed.page.locator('[data-enquiry-form]').evaluate(form => new URL(form.action).pathname), `${prefix}/api/enquiry.php`);
      await attempt(routed);
      assert.deepEqual(routed.readinessURLs, [`${prefix}/api/enquiry-config.php`, `${prefix}/api/enquiry-config.php`]);
      assert.deepEqual(routed.submissionURLs, [`${prefix}/api/enquiry.php`]);
      assert.deepEqual(routed.errors, []);
      await routed.context.close();
    }

    for (const readinessFailure of ['network', 'html', 'http', 'string']) {
      const failed = await setup(browser, { readinessFailure });
      assert.equal(await failed.page.locator('[data-enquiry-submit]').isDisabled(), true);
      assert.equal(await failed.page.locator('[data-enquiry-availability]').isVisible(), true);
      assert.equal(failed.requests.length, 0);
      assert.deepEqual(failed.errors, []);
      await failed.context.close();
    }

    const noJSContext = await browser.newContext({ javaScriptEnabled: false });
    const noJS = await noJSContext.newPage();
    await noJS.goto(new URL('/v4-enquiry-test/index.html', origin).href);
    assert.equal(await noJS.locator('[data-enquiry-submit]').isDisabled(), true);
    assert.equal(await noJS.locator('noscript').isVisible(), true);
    assert.equal(await noJS.locator('.enquiry-fallback a').getAttribute('href'), 'tel:+61430455920');
    assert.equal(await noJS.locator('meta[name="robots"]').getAttribute('content'), 'noindex,follow');
    await noJSContext.close();

    const pending = await setup(browser);
    pending.rejectWith(503, 'smtp_failure');
    const releaseReadiness = pending.holdReadiness();
    await pending.page.locator('[data-enquiry-submit]').click();
    await pending.page.waitForFunction(() => document.querySelector('[data-enquiry-form]').getAttribute('aria-busy') === 'true');
    assert.equal(await pending.page.locator('[data-enquiry-submit]').isDisabled(), true);
    await pending.page.locator('[data-enquiry-form]').evaluate(form => { form.requestSubmit(); form.requestSubmit(); });
    assert.equal(pending.requests.length, 0);
    releaseReadiness();
    await pending.page.waitForFunction(() => document.querySelector('[data-enquiry-form]').getAttribute('aria-busy') === 'false');
    assert.equal(pending.readinessRequests, 2, 'Repeated submissions started concurrent readiness checks.');
    assert.equal(pending.requests.length, 1, 'Repeated submissions created duplicate POSTs.');
    assert.deepEqual(pending.errors, []);
    await pending.context.close();

    const test = await setup(browser);
    await attempt(test);
    assert.equal(test.requests.length, 1);
    const reference = test.requests[0].reference;
    test.setAvailable(false);
    await attempt(test);
    assert.equal(test.requests.length, 1);
    assert.match(await test.page.locator('.enquiry-status').innerText(), /could not confirm submission/);
    test.setAvailable(true);
    await test.page.locator('[data-enquiry-retry]').click();
    await test.page.waitForFunction(() => !document.querySelector('[data-enquiry-submit]').disabled);
    await test.page.locator('#enquiry-message').fill('Readiness failure must preserve earlier uncertainty.');
    await attempt(test);
    assert.match(await test.page.locator('.enquiry-status').innerText(), /Restore the original details/);
    await test.page.locator('#enquiry-message').fill('Original QA message - never deliver.');
    for (const [status, code] of [[429, 'rate_limit'], [422, 'invalid_request'], [422, 'validation']]) {
      test.rejectWith(status, code);
      const count = test.requests.length;
      await attempt(test);
      assert.equal(test.requests.length, count + 1);
      assert.equal(test.requests.at(-1).reference, reference);
      await test.page.locator('#enquiry-message').fill('Changed details must remain blocked.');
      await attempt(test);
      assert.equal(test.requests.length, count + 1, 'A rejected retry erased earlier uncertainty.');
      assert.match(await test.page.locator('.enquiry-status').innerText(), /Restore the original details/);
      assert.equal(await test.page.locator('[data-enquiry-submit-label]').innerText(), 'Send enquiry');
      await test.page.locator('#enquiry-message').fill('Original QA message - never deliver.');
    }
    assert.deepEqual(test.errors, []);
    await test.context.close();

    const unknown = await setup(browser);
    unknown.rejectWith(502, 'unexpected_proxy_error');
    await attempt(unknown);
    await unknown.page.locator('#enquiry-message').fill('Do not assume a proxy error means no acceptance.');
    await attempt(unknown);
    assert.equal(unknown.requests.length, 1, 'An unknown error must retain uncertain delivery state.');
    assert.deepEqual(unknown.errors, []);
    await unknown.context.close();

    const phone = await setup(browser);
    phone.rejectWith(503, 'smtp_failure');
    for (const value of ['------', '()()()', '+     ', '1-2-3-4-5']) {
      await phone.page.locator('#enquiry-phone').fill(value);
      await attempt(phone);
      assert.equal(phone.requests.length, 0, 'Punctuation-only/short phone reached the backend.');
      assert.equal(await phone.page.locator('#enquiry-phone').getAttribute('aria-invalid'), 'true');
    }
    for (const value of ['', '0430 455 920', '+61 (430) 455-920', '+1 (609) 555-0123']) {
      await phone.page.locator('#enquiry-phone').fill(value);
      const count = phone.requests.length;
      await attempt(phone);
      assert.equal(phone.requests.length, count + 1, 'Optional/formatted phone rejected.');
      assert.equal(phone.requests.at(-1).phone, value);
    }
    assert.deepEqual(phone.errors, []);
    await phone.context.close();
    process.stdout.write('Browser regressions passed: readiness-gated enablement, root/protected API paths, responsive/keyboard validation, recovery, pending request lock, sticky uncertainty, unknown responses and phone validation. No email sent or acceptance simulated.\n');
  } finally {
    await browser.close();
  }
})().catch(error => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
