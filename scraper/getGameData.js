/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const fs = require('fs/promises');
const getAllGamesFromWikiListPageID = require('./helperFns/getAllGamesFromWikiListPageID');
const {
  getGameDescriptionsFor,
  findWikipediaPageIDFor,
} = require('./helperFns/wikiHelpers');
require('dotenv').config();

puppeteer.use(AdblockerPlugin());

(async () => {
  const gamingConsoles = [
    'Playstation 4',
    'Playstation 5',
    'Xbox series X and series S',
  ];

  const gameData = {};

  for (let i = 0; i < gamingConsoles.length; i += 1) {
    const consoleName = gamingConsoles[i];
    console.log(`${consoleName}: Starting`);

    const pageID = await findWikipediaPageIDFor(`List of ${consoleName} games`);
    const gamesList = await getAllGamesFromWikiListPageID(pageID);
    const gamesListWithDescriptions = await getGameDescriptionsFor(gamesList);

    Object.values(gamesListWithDescriptions).forEach((game) => {
      const addedToFinalList = Object.hasOwn(gameData, game.Title);
      if (!addedToFinalList) {
        gameData[game.Title] = game;
        gameData[game.Title]['Console(s)'] = [];
      }
      gameData[game.Title]['Console(s)'].push(consoleName);
    });

    console.log(`${consoleName}: Completed`);
  }

  const dir = './gameDataJSON';
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(`${dir}/gameData.json`, JSON.stringify(gameData));
  console.log('All Done!');
})();
