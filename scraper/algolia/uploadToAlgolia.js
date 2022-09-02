const recordsToAdd = require('./recordsToAdd');

async function uploadToAlgolia(client) {
  const gamesIndex = client.initIndex('games');
  await gamesIndex.saveObjects(recordsToAdd, {
    autoGenerateObjectIDIfNotExist: true,
  });
}

module.exports = uploadToAlgolia;
