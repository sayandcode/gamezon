require('dotenv').config();

const algoliaConfig = JSON.parse(process.env.ALGOLIA_CONFIG);

exports.appID = algoliaConfig.appID;
exports.adminApiKey = algoliaConfig.adminApiKey;
