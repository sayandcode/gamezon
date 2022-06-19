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

    gameData[consoleName] = gamesListWithDescriptions;
    console.log(`${consoleName}: Completed`);
  }

  const consolidatedGameData = consolidate(gameData);

  const dir = './gameDataJSON';
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    `${dir}/gameData.json`,
    JSON.stringify(consolidatedGameData)
  );
})();

function consolidate(gameDataOriginal) {
  const gameData = JSON.parse(JSON.stringify(gameDataOriginal)); // cause pure fn

  // the final list will have each game occurring once. So combine all the keys in an object style
  const finalList = {};
  Object.values(gameData).forEach((list) => {
    const entries = Object.keys(list).map((gameName) => [gameName, {}]);
    Object.assign(finalList, Object.fromEntries(entries));
  });

  // iterate through this list of unique game names, and search the gameLists, for if it occurs
  const gameLists = Object.entries(gameData);
  Object.keys(finalList).forEach((gameName) => {
    gameLists.forEach(([consoleName, list]) => {
      // if game doesn't exist on that list, skip the list
      if (!list[gameName]) return;
      /* from this point on, we are sure that the current list contains the game
      so we dont need to explicitly check */

      // if the game exists on the list, but hasn't been added to finalList
      // add it to the final list
      if (Object.keys(finalList[gameName]).length === 0) {
        finalList[gameName] = {
          ...list[gameName],
        };
        finalList[gameName].variants = [
          { consoleName, 'Release date': list[gameName]['Release date'] },
        ];
        delete finalList[gameName]['Release date']; // we dont need a separate field, just store it in variants
      } // if the game exists on both the list and final list i.e was already added before
      else {
        const newVariant = {
          consoleName,
          'Release date': list[gameName]['Release date'],
        };
        finalList[gameName].variants.push(newVariant);
      }
    });
  });
  return finalList;
}
