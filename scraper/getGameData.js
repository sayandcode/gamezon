/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const fs = require('fs/promises');
const getAllGamesFromWikiListPageID = require('./getAllGamesFromWikiListPageID');
const {
  getGameDescriptionsFor,
  findWikipediaPageIDFor,
} = require('./wikiHelpers');
require('dotenv').config();

puppeteer.use(AdblockerPlugin());

(async () => {
  const gamingConsoles = [
    'Playstation 4',
    'Playstation 5',
    'Xbox series X and series S',
  ];

  for (let i = 0; i < gamingConsoles.length; i += 1) {
    const consoleName = gamingConsoles[i];
    console.log(`${consoleName}: Starting`);

    const pageID = await findWikipediaPageIDFor(`List of ${consoleName} games`);
    const gamesList = await getAllGamesFromWikiListPageID(pageID);
    const gamesListWithDescriptions = await getGameDescriptionsFor(gamesList);

    const dir = './gameDataJSON';
    const fileName = `${consoleName
      .replace(/(\w+)/g, (m) => m[0].toUpperCase() + m.slice(1))
      .replace(/\s/g, '')}GamesList.json`;
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      `${dir}/${fileName}`,
      JSON.stringify(gamesListWithDescriptions)
    );

    console.log(`${consoleName}: Completed\nFileName:${fileName}`);
  }
})();
