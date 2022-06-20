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
  await sleep(100);
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

async function getBoxArtImage(gameName) {
  const queryString = `${gameName} video game box art`;
  const response = await GOOGLE_IMG_SCRAP({
    search: queryString,
    limit: 1,
    // eslint-disable-next-line consistent-return
    execute(element) {
      if (!element.url.match('gstatic.com')) return element;
    },
  });
  const boxArtUrl = response.result[0].url;
  const fetchResponse = await fetch(boxArtUrl);
  const boxArtImage = fetchResponse.body;
  return boxArtImage;
}

async function getPriceAccToConsole(gameName, consoleName) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  await handleCaptchasIn(page);

  const queryString = `${gameName} ${consoleName} price usa`;
  await page.type('input[aria-label="Search"]', queryString);
  await page.evaluate(() => {
    const imFeelingLuckyBtn = document.querySelector(
      `input[aria-label="I'm Feeling Lucky"]`
    );
    imFeelingLuckyBtn.click();
  });
  await page.waitForNavigation();
  if (page.url().match(/en-in/)) {
    const newURL = page.url().replace(/en-in/g, 'en-us');
    await page.goto(newURL);
  }

  const priceElement = (
    await page.$x(
      "//*[(self::p or self::div or self::span)][contains(text(),'$')]"
    )
  )?.[0];

  const price = priceElement
    ? await priceElement.evaluate((el) => el.innerText.match(/(\$[\d,.]+)/)[0])
    : null;

  await browser.close();

  return price;
}

exports.getYoutubeURL = getYoutubeURL;
exports.getGameScreenshots = getGameScreenshots;
exports.getBoxArtImage = getBoxArtImage;
exports.getPriceAccToConsole = getPriceAccToConsole;
