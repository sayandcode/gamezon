/* eslint-disable no-param-reassign */
// const { initializeApp } = require('firebase/app');
// const { getFirestore, collection, getDoc, doc } = require('firebase/firestore');
const fs = require('fs/promises');
const path = require('path');

require('dotenv').config();

// const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
// const app = initializeApp(firebaseConfig);
// const firestoreDB = getFirestore(app);

const DB_URL = path.resolve(
  __dirname,
  '../mockFirebase/JSONDatabase/games.json'
);

// ideally this doesnt exist yet
const METADATA_URL = path.resolve(
  __dirname,
  '../mockFirebase/JSONDatabase/games.metadata.json'
);
const MIN_DISCOUNT = 0.1;
const MAX_DISCOUNT = 0.6;
const SPOTLIGHT_ITEMS_COUNT = 5;
const OFFER_ITEMS_COUNT = 50;

(async () => {
  const localDB = JSON.parse(await fs.readFile(DB_URL));

  const allTitles = Object.keys(localDB);
  const randomShuffledGameTitles = allTitles.sort(() => Math.random() - 0.5);
  const spotlightTitles = randomShuffledGameTitles.slice(
    0,
    SPOTLIGHT_ITEMS_COUNT
  );
  const offerTitles = randomShuffledGameTitles.slice(
    SPOTLIGHT_ITEMS_COUNT,
    SPOTLIGHT_ITEMS_COUNT + OFFER_ITEMS_COUNT
  );

  spotlightTitles.forEach((title) => {
    localDB[title].spotlight = true;
  });

  offerTitles.forEach((title) => {
    const discount =
      MIN_DISCOUNT +
      Number((Math.random() * (MAX_DISCOUNT - MIN_DISCOUNT)).toFixed(2));
    localDB[title].discount = discount;
  });

  // also find unreleased games
  const unreleasedTitles = Object.values(localDB).filter(
    (game) => game.startingPrice === null
  );

  // also find all developers, publishers, consoles, and genres for filtering
  const allDevelopers = [];
  const allPublishers = [];
  const allConsoles = [];
  const allGenres = [];
  Object.values(localDB).forEach((game) => {
    game['Developer(s)'].forEach((dev) => {
      if (!allDevelopers.includes(dev)) allDevelopers.push(dev);
    });
    game['Publisher(s)'].forEach((pub) => {
      if (!allPublishers.includes(pub)) allPublishers.push(pub);
    });
    game['Console(s)'].forEach((cons) => {
      if (!allConsoles.includes(cons)) allConsoles.push(cons);
    });
    game['Genre(s)'].forEach((genre) => {
      if (!allGenres.includes(genre)) allGenres.push(genre);
    });
  });

  const metadata = {
    allTitles,
    spotlightTitles,
    offerTitles,
    unreleasedTitles,
    allDevelopers,
    allPublishers,
    allConsoles,
    allGenres,
  };
  await fs.writeFile(METADATA_URL, JSON.stringify(metadata));

  await fs.writeFile(DB_URL, JSON.stringify(localDB));
  console.log('Done');
})();
