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
const DB_URL = './gameDataJSON/gameData.json';

puppeteer.use(AdblockerPlugin());

(async () => {
  const db = JSON.parse(await fs.readFile(DB_URL));
  const gameNames = Object.keys(db);
  for (let i = 2; i < /* gameNames.length */ 3; i += 1) {
    const gameName = gameNames[i];

    /* Source the data */
    //  1 Box Art Image
    const boxArtImage = await getBoxArtImage(gameName);
    //  1 Game trailer youtube URL
    const youtubeURL = await getYoutubeURL(`${gameName} video game trailer`);
    db[gameName].trailerURL = youtubeURL;

    //  4 Game screenshot images
    const gameScreenshots = await getGameScreenshots(gameName);

    //  price foreach console
    const { variants } = db[gameName];
    for (let j = 0; j < variants.length; j += 1) {
      const thisVariant = variants[j];
      const price = await getPriceAccToConsole(
        gameName,
        thisVariant.consoleName
      );
      thisVariant.price = price;
      if (!price) thisVariant['Release date'] = null;
      await sleep(500);
    }

    /* Now write everything to disk */
    const picsDir = `./pics/${gameName}`;
    await fs.mkdir(picsDir, { recursive: true });
    gameScreenshots.forEach(async (screenshot, index) =>
      fs.writeFile(`${picsDir}/${index + 1}.png`, screenshot)
    );
    await fs.writeFile(`${picsDir}/boxArt.png`, boxArtImage);
    console.log(`Finished${i + 1} of ${gameNames.length} `);
  }

  // write to the disk last cause anyway its stored in memory
  const dataDir = './gameDataJSON';
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(`${dataDir}/gameDataWithPrices.json`, JSON.stringify(db));
})();
