const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Pipe console logs to terminal
  page.on('console', msg => {
    if (msg.text().includes('[DEBUG')) {
      console.log('BROWSER LOG:', msg.text());
    }
  });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173/');

  // Function to wait for a selector with retry logic to handle transitions
  const waitForSelector = async (selector, timeout = 5000) => {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch (e) {
      return false;
    }
  };

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  console.log('Waiting for Language Screen...');
  await waitForSelector('button.onboarding-btn');
  console.log('Selecting Language...');
  await page.click('button.onboarding-btn');
  await delay(1000);

  console.log('Waiting for Login Screen...');
  await waitForSelector('input[placeholder="Enter as per Aadhaar"]');
  console.log('Logging in...');
  await page.type('input[placeholder="Enter as per Aadhaar"]', 'John Doe');
  await page.type('input[placeholder="10-digit number"]', '9999999999');
  await page.type('input[type="date"]', '1995-05-15');
  await page.click('div.w-6.h-6');
  await delay(500);
  await page.click('button.onboarding-btn');
  await delay(1000);

  console.log('Waiting for OTP Screen...');
  await waitForSelector('input[type="tel"]');
  console.log('Entering OTP...');
  await page.type('input[type="tel"]', '123456');
  await page.click('button.onboarding-btn');
  await delay(1000);

  console.log('Waiting for City Screen...');
  await delay(1000);
  console.log('Selecting City...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.onboarding-card'));
    const bengaluru = cards.find(c => c.innerText.includes('Bengaluru'));
    if (bengaluru) bengaluru.click();
  });
  await delay(500);
  await page.click('button.onboarding-btn');
  await delay(1000);

  console.log('Waiting for Hub Screen...');
  await delay(1000);
  console.log('Selecting Hub...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.onboarding-card'));
    const koramangala = cards.find(c => c.innerText.includes('Koramangala Hub'));
    if (koramangala) koramangala.click();
  });
  await delay(500);
  await page.click('button.onboarding-btn');
  await delay(1000);

  console.log('Waiting for Aadhaar Screen...');
  await delay(1000);
  console.log('Bypassing Aadhaar e-KYC...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const skip = btns.find(b => b.innerText.includes('Skip for now'));
    if (skip) skip.click();
  });
  await delay(1000);

  console.log('Waiting for Selfie Guide...');
  await delay(1000);
  console.log('Selecting Selfie Guide...');
  await page.click('button.onboarding-btn');
  await delay(1000);

  console.log('Waiting for Live Selfie...');
  await delay(1000);
  console.log('Triggering Live Selfie Capture...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const captureBtn = buttons[buttons.length - 1];
    if (captureBtn) captureBtn.click();
  });
  await delay(2000);

  console.log('At URL:', page.url());

  const evalClick = async (text) => {
    await page.evaluate((txt) => {
      const btns = Array.from(document.querySelectorAll('button, div.onboarding-btn'));
      const btn = btns.find(b => b.innerText.includes(txt));
      if (btn) btn.click();
    }, text);
    await delay(1500);
  };

  console.log('Clicking Go Online...');
  await evalClick('Go Online');

  console.log('In Face Scan Modal... clicking Scan Face');
  await evalClick('Scan Face');
  await delay(3000); // Wait for face match verification animation

  console.log('In Face Scan Modal... clicking Go Online');
  await evalClick('Go Online');
  await delay(1000);

  console.log('Clicking Orders tab...');
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const orders = links.find(l => l.innerText.includes('Orders'));
    if (orders) orders.click();
  });
  await delay(1500);

  console.log('At URL:', page.url());

  console.log('Reloading page (Simulate App reopen)...');
  await page.reload({ waitUntil: 'networkidle0' });
  await delay(2000);

  console.log('After reload, URL:', page.url());

  await browser.close();
})();
