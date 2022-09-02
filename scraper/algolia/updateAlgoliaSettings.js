async function updateAlgoliaSettings(client) {
  const gamesIndex = client.initIndex('games');
  await gamesIndex.setSettings({
    searchableAttributes: [
      'Title',
      'Description',
      'Developer(s)',
      'Publisher(s)',
    ],
  });
}

module.exports = updateAlgoliaSettings;
