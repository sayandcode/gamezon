const { Headers } = require('node-fetch');
const fetch = require('node-fetch');
const sleep = require('./sleep');

const MyUserAgent = {
  method: 'GET',
  headers: new Headers({
    'Api-User-Agent': process.env.WIKI_API_HEADER,
  }),
};

async function findWikipediaPageIDFor(searchString) {
  const wikiAPIbaseUrl = 'https://en.wikipedia.org/w/api.php?';
  const queryObj = {
    action: 'query',
    format: 'json',
    list: 'search',
    srsearch: searchString,
    srprop: '',
  };

  const queryUrl = wikiAPIbaseUrl + new URLSearchParams(queryObj);
  try {
    // eslint-disable-next-line no-var , vars-on-top
    var response = await fetch(queryUrl, MyUserAgent);
  } catch (err) {
    console.log(err);
  }

  // eslint-disable-next-line block-scoped-var
  const data = await response.json();
  const pageID = data.query.search[0].pageid;
  return pageID;
}

/* Takes an array of wikiPageTitles, and returns */
/* an array containing objects of {wikiPageTitle, summaryText} */
async function getWikiSummaryFor(pageTitles) {
  const wikiAPIbaseUrl = 'https://en.wikipedia.org/w/api.php?';
  const queryObj = {
    action: 'query',
    format: 'json',
    prop: 'extracts',
    titles: Array.isArray(pageTitles) ? pageTitles.join('|') : pageTitles,
    redirects: 1,
    exintro: 1,
    explaintext: 1,
  };

  const queryUrl = wikiAPIbaseUrl + new URLSearchParams(queryObj);
  const response = await fetch(queryUrl, MyUserAgent);
  await sleep(250);
  console.log(response.statusText);
  const data = await response.json();
  const pages = Object.values(data.query.pages); // this is an object
  const redirectMaps = data.query.redirects; // this is an array. Wikipedia is wierd

  const summaries = pageTitles.map((oldTitle) => {
    const redirectedTitle = redirectMaps?.find(
      (mapping) => mapping.from === oldTitle
    )?.to;
    const finalWikiTitle = redirectedTitle || oldTitle;

    const thisSummary = pages.find(
      (page) => page.title === finalWikiTitle
    ).extract;

    return { wikiPageTitle: oldTitle, summaryText: thisSummary };
  });

  return summaries;
}

async function getGameDescriptionsFor(gamesListOriginal) {
  const WIKI_API_TITLE_LIMIT = 20;
  const gamesList = JSON.parse(JSON.stringify(gamesListOriginal)); // copy it to avoid mutation
  const gamesListArray = Object.values(gamesList);

  // wikipedia API policy prefers serialized calls, and also provides only 20 results at a time
  for (let i = 0; i < gamesListArray.length; i += WIKI_API_TITLE_LIMIT) {
    // if its the last iteration, then dont take the last WIKI_API_TITLE_LIMIT
    // just take whatevers left, by keeping the end as undefined
    const sliceEndIndex =
      i + WIKI_API_TITLE_LIMIT >= gamesListArray.length
        ? undefined
        : i + WIKI_API_TITLE_LIMIT;
    const apiCallStack = gamesListArray.slice(i, sliceEndIndex).map((game) => ({
      Title: game.Title,
      wikiPageTitle: game.wikiPageTitle,
    }));

    // eslint-disable-next-line no-await-in-loop
    const summaries = await getWikiSummaryFor(
      apiCallStack.map((game) => game.wikiPageTitle)
    );

    apiCallStack.forEach((game) => {
      const correspondingSummary = summaries.find(
        (summary) => summary.wikiPageTitle === game.wikiPageTitle
      ).summaryText;
      gamesList[game.Title].Description = correspondingSummary;
      delete gamesList[game.Title].wikiPageTitle;
    });

    console.log(
      `Finished ${i + apiCallStack.length} of ${gamesListArray.length}`
    );
  }
  return gamesList;
}

exports.findWikipediaPageIDFor = findWikipediaPageIDFor;
exports.getWikiSummaryFor = getWikiSummaryFor;
exports.getGameDescriptionsFor = getGameDescriptionsFor;
