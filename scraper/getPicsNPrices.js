/* eslint-disable no-await-in-loop */ // Serialize the calls
const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const fs = require('fs/promises');
const {
  getYoutubeURL,
  getGameScreenshots,
  getBoxArtImage,
} = require('./helperFns/picsNPricesHelpers');

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
  for (let i = 0; i < /* gameNames.length */ 1; i += 1) {
    const gameName = gameNames[i];

    /* Source the data */
    //  1 Box Art Image
    const boxArtImage = await getBoxArtImage(gameName);
    //  1 Game trailer youtube URL
    /* const youtubeURL = await getYoutubeURL(`${gameName} video game trailer`); */
    //  4 Game screenshot images
    /* const gameScreenshots = await getGameScreenshots(gameName); */

    //  price foreach console

    /* Now write everything to disk */
    const dir = `./pics/${gameName}`;
    await fs.mkdir(dir, { recursive: true });
    /* gameScreenshots.forEach(async (screenshot, index) =>
      fs.writeFile(`${dir}/${index + 1}.png`, screenshot)
    ); */
    await fs.writeFile(`${dir}/boxArt.png`, boxArtImage);
  }
})();

// id='contents'
