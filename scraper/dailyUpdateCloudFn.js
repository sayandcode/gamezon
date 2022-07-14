const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  writeBatch,
  deleteField,
  getDoc,
  doc,
  updateDoc,
} = require('firebase/firestore');

require('dotenv').config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);
const gamesDB = collection(firestoreDB, 'games');

const MIN_DISCOUNT = 0.1;
const MAX_DISCOUNT = 0.6;
const SPOTLIGHT_ITEMS_COUNT = 5;
const OFFER_ITEMS_COUNT = 50;

(async () => {
  // max batch writes is 500. This works cause our spotlight and offer items are together 55 items
  const batch = writeBatch(firestoreDB);

  const metadataDocRef = doc(firestoreDB, 'games', '#metadata');
  const { allTitles, spotlightTitles, offerTitles, unreleasedTitles } = (
    await getDoc(metadataDocRef)
  ).data();

  // this works even on the first read, since spotlightTitles and offerTitles
  // document will return undefined, and hence their blocks will not run
  spotlightTitles.forEach((title) => {
    const docRef = doc(gamesDB, title);
    batch.update(docRef, { spotlight: deleteField() });
  });

  offerTitles.forEach((title) => {
    const docRef = doc(gamesDB, title);
    batch.update(docRef, { discount: deleteField() });
  });

  const releasedTitles = allTitles.filter(
    (title) => !unreleasedTitles.includes(title)
  );
  const randomShuffledGameTitles = releasedTitles.sort(
    () => Math.random() - 0.5
  );

  const newSpotlightTitles = randomShuffledGameTitles.slice(
    0,
    SPOTLIGHT_ITEMS_COUNT
  );
  const newOfferTitles = randomShuffledGameTitles.slice(
    SPOTLIGHT_ITEMS_COUNT,
    SPOTLIGHT_ITEMS_COUNT + OFFER_ITEMS_COUNT
  );

  newSpotlightTitles.forEach((title) => {
    const docRef = doc(gamesDB, title);
    batch.update(docRef, { spotlight: true });
  });

  newOfferTitles.forEach((title) => {
    const docRef = doc(gamesDB, title);
    const discount =
      MIN_DISCOUNT +
      Number((Math.random() * (MAX_DISCOUNT - MIN_DISCOUNT)).toFixed(2));
    batch.update(docRef, { discount });
  });

  updateDoc(metadataDocRef, {
    spotlightTitles: newSpotlightTitles,
    offerTitles: newOfferTitles,
  });

  await batch.commit();

  console.log('Done');
})();
