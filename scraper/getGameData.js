const puppeteer = require('puppeteer');
const handleCaptchasIn = require('./handleCaptchasIn');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    'https://recaptcha-demo.appspot.com/recaptcha-v2-checkbox-explicit.php'
  );
  await handleCaptchasIn(page);
  await browser.close();
})();
