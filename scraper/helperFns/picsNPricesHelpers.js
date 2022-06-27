const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');
const fetch = require('node-fetch');
const handleCaptchasIn = require('./handleCaptchasIn');

async function getYoutubeURL(queryString, browser) {
  const page = await browser.newPage();

  const youtubeQueryString = encodeURIComponent(queryString).replace(
    /%20/g,
    '+'
  );
  await page.goto(
    `https://www.youtube.com/results?search_query=${youtubeQueryString}`,
    { waitUntil: 'networkidle2' }
  );
  await handleCaptchasIn(page);
  const URL = await page.$eval('#contents a', (a) => a.href);
  await page.close();
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
  const gameScreenshots = (
    await Promise.all(
      screenshotUrls.map(async (url) => {
        try {
          const fetchResponse = await fetch(url);
          return fetchResponse.body;
        } catch {
          return null; // if theres a bad certificate from the website, just ignore it
        }
      })
    )
  ).filter((ss) => ss !== null);
  return gameScreenshots;
}

async function getBoxArtImage(gameName) {
  const queryString = `${gameName} video game box art`;
  const response = await GOOGLE_IMG_SCRAP({
    search: queryString,
    limit: 2,
    // eslint-disable-next-line consistent-return
    execute(element) {
      if (!element.url.match('gstatic.com')) return element;
    },
  });

  let fetchResponse;
  try {
    const boxArtUrl = response.result[0].url;
    fetchResponse = await fetch(boxArtUrl);
  } catch (err) {
    console.log(`First fetch didn't work for ${gameName} boxArt`);
    const boxArtUrl = response.result[1].url;
    fetchResponse = await fetch(boxArtUrl);
  }
  const boxArtImage = fetchResponse.body;
  return boxArtImage;
}

async function getPriceAccToConsole(gameName, consoleName, browser) {
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

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 });
  const currUrl = page.url();
  if (currUrl.match(/en-in/i)) {
    const newURL = currUrl.replace(/en-in/gi, 'en-us');
    await page.goto(newURL, { waitUntil: 'networkidle2' });
  } else if (currUrl.match(/amazon\.in/)) {
    const newURL = currUrl.replace(/amazon\.in/, 'amazon.com');
    await page.goto(newURL, { waitUntil: 'networkidle2' });
  }

  const priceElement = (
    await page.$x(
      "//*[(self::p or self::div or self::span)][contains(text(),'$')]"
    )
  )[0];

  const price = priceElement
    ? await priceElement.evaluate(
        (el) => el.textContent.match(/\$\d+(\.\d+)?/)?.[0] // this works, cause if it cant find a match, it returns null
      )
    : null;
  const purchaseUrl = page.url();

  await page.close();

  return { price, purchaseUrl };
}

exports.getYoutubeURL = getYoutubeURL;
exports.getGameScreenshots = getGameScreenshots;
exports.getBoxArtImage = getBoxArtImage;
exports.getPriceAccToConsole = getPriceAccToConsole;
