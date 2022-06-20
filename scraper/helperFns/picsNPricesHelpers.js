const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');
const fetch = require('node-fetch');
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
  await handleCaptchasIn(page);
  const URL = await page.$eval('#contents a', (a) => a.href);
  await browser.close();
  return URL;
}

async function getGameScreenshots(gameName) {
  const queryString = `${gameName} video game screenshots`;
  const response = await GOOGLE_IMG_SCRAP({
    search: queryString,
    limit: 4,
    // eslint-disable-next-line consistent-return
    execute(element) {
      if (!element.url.match('gstatic.com')) return element;
    },
  });
  const screenshotUrls = response.result.map((pic) => pic.url);
  const gameScreenshots = await Promise.all(
    screenshotUrls.map(async (url) => {
      const fetchResponse = await fetch(url);
      return fetchResponse.body;
    })
  );
  return gameScreenshots;
}

exports.getYoutubeURL = getYoutubeURL;
exports.getGameScreenshots = getGameScreenshots;
