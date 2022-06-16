const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const fs = require('fs/promises');
const handleCaptchasIn = require('./handleCaptchasIn');
const getAllGamesFromWikiListPageID = require('./getAllGamesFromWikiListPageID');
const { getWikiSummaryFor } = require('./wikiHelpers');
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
  const gamesListArray = Object.values(gamesList);
  let apiCall = {
    /* wikiTitle:title */
  };
  for (let i = 0; i < gamesListArray.length; i += 1) {
    const game = gamesListArray[i];
    apiCall = {
      ...apiCall,
      [game.wikiPageTitle]: game.Title,
    };
    if ((i + 1) % 50 === 0 || i === gamesListArray.length - 1) {
      // wikipedia API policy prefers serialized calls
      // eslint-disable-next-line no-await-in-loop
      const summaries = await getWikiSummaryFor(Object.keys(apiCall));
      for (let j = 0; j < summaries.length; j += 1) {
        const summary = summaries[j];
        const correspondingTitle = apiCall[summary.wikiTitle]; // returns the game title
        try {
          gamesList[correspondingTitle].Description = summary.summaryText;
        } catch (err) {
          console.log(err);
        }
        delete gamesList[correspondingTitle].wikiPageTitle;
      }
      console.log(`${i} of ${gamesListArray.length}`);
      apiCall = {};
    }
  }
  await fs.writeFile('PS4GamesList', JSON.stringify(gamesList));
})();
