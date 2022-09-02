const algoliasearch = require('algoliasearch');
const { appID, adminApiKey } = require('./algoliaConfig');
const updateAlgoliaSettings = require('./updateAlgoliaSettings');
const uploadToAlgolia = require('./uploadToAlgolia');

const client = algoliasearch(appID, adminApiKey);

(async () => {
  await uploadToAlgolia(client);
  await updateAlgoliaSettings(client);
})();
