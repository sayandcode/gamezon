/* const puppeteer = require('puppeteer'); */
const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const handleCaptchasIn = require('./handleCaptchasIn');

puppeteer.use(AdblockerPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    'https://recaptcha-demo.appspot.com/recaptcha-v2-checkbox-explicit.php'
  );
  await handleCaptchasIn(page);
  await browser.close();
})();
