const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const fs = require('fs/promises');
const handleCaptchasIn = require('./handleCaptchasIn');
const getAllGamesFromWikiListPageID = require('./getAllGamesFromWikiListPageID');
const { getGameDescriptionsFor } = require('./wikiHelpers');
require('dotenv').config();

puppeteer.use(AdblockerPlugin());

(async () => {
  /* const gamingConsoles = [
    'Playstation 4',
    'Playstation 5',
    'Xbox series X and series S',
  ];

  const gamesListsForAllConsoles = gamingConsoles.map(async (consoleName) => {
    const pageID = await findWikipediaPageIDFor(`List of ${consoleName} games`);
    const gamesList = await getAllGamesFromWikiListPageID(pageID);
    Object.values(gamesList).forEach(async (game) => {
      const gamePageID = await findWikipediaPageIDFor(
        `${game.Title} ${consoleName} game`
      );
      const gameDescription = await getWikiSummaryFromPageID(gamePageID);

      gamesList[game.Title].Description = gameDescription;
    });
  }); */
  const gamesList = await getAllGamesFromWikiListPageID(38592593);

  const gamesListWithDescriptions = await getGameDescriptionsFor(gamesList);
  console.log(gamesListWithDescriptions);
  console.log('End');
  await fs.writeFile(
    'PS4GamesList.json',
    JSON.stringify(gamesListWithDescriptions)
  );
})();
