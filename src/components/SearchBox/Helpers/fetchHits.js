import algoliasearch from 'algoliasearch/lite';

/* These are read-only API keys */
const APP_ID = '1TBCZZR9CO';
const SEARCH_API_KEY = 'b174931cc807e7fd22b0673c11430d46';

const client = algoliasearch(APP_ID, SEARCH_API_KEY);
const gamesIndex = client.initIndex('games');
const searchParameters = {
  hitsPerPage: 3,
  attributesToRetrieve: ['Title', 'Console(s)', 'Developer(s)'],
  attributesToHighlight: ['Title'],
};

async function fetchHits(queryString) {
  const { hits } = await gamesIndex.search(queryString, searchParameters);
  return hits;
}

export default fetchHits;
