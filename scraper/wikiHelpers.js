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
  const response = await fetch(queryUrl, MyUserAgent);
  const data = await response.json();
  const pageID = data.query.search[0].pageid;
  return pageID;
}

// eslint-disable-next-line consistent-return
async function getWikiSummaryFor(pageTitles) {
  try {
    /* Returns an array containing objects of {wikiTitle, summaryText} */

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
    // eslint-disable-next-line no-var , vars-on-top
    var response = await fetch(queryUrl, MyUserAgent);
    await sleep(500);
    console.log(response.statusText);
    const data = await response.json();
    const pages = Object.values(data.query.pages);
    const redirectMaps = data.query.redirects;

    const summaries = pages.map((pageResult) => {
      if (redirectMaps) {
        const thisMapping = redirectMaps.find(
          (mapping) => mapping.to === pageResult.title
        );
        const oldWikiTitle = thisMapping ? thisMapping.from : pageResult.title;
        return {
          wikiTitle: oldWikiTitle,
          summaryText: pageResult.extract,
        };
      }
      return {
        wikiTitle: pageResult.title,
        summaryText: pageResult.extract,
      };
    });

    // any summaries that returned undefined or '', were actually redirects
    // wikipedia's API shows the option to redirect these, but the redirects dont provide data
    // without a separate call. Wierd
    // So lets call the API again, but for only those titles
    const redirectableWikiTitles = summaries
      .filter((summary) => !summary.summaryText)
      .map((title) => title.wikiTitle);

    if (redirectableWikiTitles.length) {
      const redirectedSummaries = await getWikiSummaryFor(
        redirectableWikiTitles
      );
      return [
        ...summaries.filter((summary) => !!summary.summaryText),
        ...redirectedSummaries,
      ];
    }
    return summaries;
  } catch (err) {
    console.log(err);
  }
}

exports.findWikipediaPageIDFor = findWikipediaPageIDFor;
exports.getWikiSummaryFor = getWikiSummaryFor;
