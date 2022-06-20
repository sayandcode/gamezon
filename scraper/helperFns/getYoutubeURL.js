const puppeteer = require('puppeteer-extra');
const handleCaptchasIn = require('./handleCaptchasIn');
const sleep = require('./sleep');

async function getYoutubeURL(queryString) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();

  await page.goto(
    `https://www.youtube.com/results?search_query=${queryString.replace(
      /\s/g,
      '+'
    )}`
  );
  // await handleCaptchasIn(page);
  const URL = await page.$eval('#contents a', (a) => a.href);
  await browser.close();
  return URL;
}

module.exports = getYoutubeURL;
