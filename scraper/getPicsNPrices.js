/* eslint-disable no-await-in-loop */ // Serialize the calls
const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const fs = require('fs/promises');
const {
  getYoutubeURL,
  getGameScreenshots,
  getBoxArtImage,
  getPriceAccToConsole,
} = require('./helperFns/picsNPricesHelpers');
const sleep = require('./helperFns/sleep');

/* THINGS TO SCRAPE */
//  1 Box Art Image
//  1 Game trailer youtube URL
//  4 Game screenshot images
//  price foreach console

// runtime constants
const DB_URL = './gameDataJSON/gameDataWithPrices.json';

puppeteer.use(AdblockerPlugin());

(async () => {
  const db = JSON.parse(await fs.readFile(DB_URL));
  const gameNames = Object.keys(db);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  // FAILED: 303
  for (let i = 303; i < gameNames.length; i += 1) {
    const gameName = gameNames[i];

    /* Source the data */
    //  1 Box Art Image
    const boxArtImage = await getBoxArtImage(gameName);
    //  1 Game trailer youtube URL
    const youtubeURL = await getYoutubeURL(
      `${gameName} video game trailer`,
      browser
    );
    db[gameName].trailerURL = youtubeURL;

    //  4 Game screenshot images
    const gameScreenshots = await getGameScreenshots(gameName);

    //  price foreach console
    const { variants } = db[gameName];
    for (let j = 0; j < variants.length; j += 1) {
      const thisVariant = variants[j];
      const { price, purchaseUrl } = await getPriceAccToConsole(
        gameName,
        thisVariant.consoleName,
        browser
      );
      thisVariant.price = price;
      if (!price) thisVariant['Release date'] = null;
      thisVariant.purchaseUrl = purchaseUrl;
      await sleep(500);
    }

    /* Now write everything to disk */
    // json first, cause pics are more likely to fail

    // write to the disk at every iteration vs once,
    // cause I want to be able to pause the program
    const dataDir = './gameDataJSON';
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(
      `${dataDir}/gameDataWithPrices.json`,
      JSON.stringify(db)
    );

    const picsDir = `./pics/${gameName}`;
    await fs.mkdir(picsDir, { recursive: true });
    await Promise.all(
      gameScreenshots.map(async (screenshot, index) =>
        fs.writeFile(`${picsDir}/${index + 1}.png`, screenshot)
      )
    );
    await fs.writeFile(`${picsDir}/boxArt.png`, boxArtImage);

    console.log(`Finished ${i + 1} of ${gameNames.length}: ${gameName}`);
  }
  browser.close();
})();
