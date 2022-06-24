const TIME_TO_HANDLE_CAPTCHAS = 600000; /* milliseconds */

function captchaSolved(frame) {
  return new Promise((resolve, reject) => {
    let intervalRef;
    let timeoutRef;
    // eslint-disable-next-line prefer-const
    intervalRef = setInterval(async () => {
      const verified = await frame.evaluate(() => {
        const statusText = document.querySelector(
          '#recaptcha-accessible-status'
        ).innerText;

        return statusText === 'You are verified';
      });
      if (verified) {
        clearTimeout(timeoutRef);
        clearInterval(intervalRef);
        console.log('You solved the captchas in time');
        resolve();
      }
    }, 1000);
    timeoutRef = setTimeout(() => {
      clearTimeout(timeoutRef);
      clearInterval(intervalRef);
      reject(new Error('You took too much time to solve the captchas'));
    }, TIME_TO_HANDLE_CAPTCHAS);
  });
}

async function handleCaptchasIn(page) {
  // check if there are captchas on the page
  const captchaFrameHandle = await page.$('iframe[title="reCAPTCHA"]');

  // if there aren't resolve the promise
  if (captchaFrameHandle === null) return false;

  // if there are, wait till they're solved
  const bgmBrowser = await startBGM();
  try {
    await captchaSolved(await captchaFrameHandle.contentFrame());
  } catch (err) {
    console.log(err);
  }
  await bgmBrowser.close();
  return true;
}

module.exports = handleCaptchasIn;

const puppeteer = require('puppeteer-extra');

async function startBGM() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.youtube.com/watch?v=Yczul_609Gg');

  const session = await page.target().createCDPSession();
  const { windowId } = await session.send('Browser.getWindowForTarget');
  await session.send('Browser.setWindowBounds', {
    windowId,
    bounds: { windowState: 'minimized' },
  });
  return browser;
}
