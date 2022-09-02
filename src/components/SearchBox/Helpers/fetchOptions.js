import fetchHits from './fetchHits';
import getOptionsFromHits from './getOptionsFromHits';

async function fetchOptions(queryString) {
  const hits = await fetchHits(queryString);
  const options = getOptionsFromHits(hits);
  return options;
}

export default fetchOptions;
