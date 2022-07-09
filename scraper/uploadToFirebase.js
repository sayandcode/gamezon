/* eslint-disable no-await-in-loop */
const { initializeApp } = require('firebase/app');
const { getFirestore, writeBatch, doc, setDoc } = require('firebase/firestore');
const { getStorage, ref, uploadBytes } = require('firebase/storage');
const fs = require('fs/promises');
const path = require('path');

require('dotenv').config();

const DB_URL = path.resolve(
  __dirname,
  '../mockFirebase/JSONDatabase/games.json'
);
const METADATA_URL = path.resolve(
  __dirname,
  '../mockFirebase/JSONDatabase/games.metadata.json'
);
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);

(async function addGamesDataJSON() {
  const gamesDB = Object.values(JSON.parse(await fs.readFile(DB_URL)));
  const metadata = JSON.parse(await fs.readFile(METADATA_URL));

  const firestoreDB = getFirestore(app);

  // write a separate document for metadata
  await setDoc(doc(firestoreDB, 'games', '#metadata'), metadata);

  // maximum 500 writes per batch
  const FIRESTORE_MAX_WRITES = 500;
  for (let i = 0; i < gamesDB.length; i += FIRESTORE_MAX_WRITES) {
    const thisBatchOfGames = Object.values(gamesDB).slice(
      i,
      i + FIRESTORE_MAX_WRITES
    );

    const batch = writeBatch(firestoreDB);
    thisBatchOfGames.forEach((game) => {
      const gameDocRef = doc(firestoreDB, 'games', game.Title);
      batch.set(gameDocRef, game);
    });
    await batch.commit();

    console.log(
      `Finished uploading ${
        i + FIRESTORE_MAX_WRITES >= gamesDB.length
          ? gamesDB.length
          : i + FIRESTORE_MAX_WRITES
      } gamesof ${gamesDB.length} to Firestore`
    );
  }

  console.log('Finished uploading to Firestore Database');
})();

(async function addPicsToStorage() {
  const storage = getStorage(app);

  const gameList = await fs.readdir('./pics');

  // arbitrary batch size. I just thought 50 was right for my net speed
  const FIRESTORE_CLOUD_UPLOAD_BATCH_SIZE = 50;
  for (let i = 0; i < gameList.length; i += FIRESTORE_CLOUD_UPLOAD_BATCH_SIZE) {
    const thisBatchOfGames = Object.values(gameList).slice(
      i,
      i + FIRESTORE_CLOUD_UPLOAD_BATCH_SIZE
    );

    await Promise.all(
      thisBatchOfGames.map(async (gameName) => {
        const pics = await fs.readdir(`./pics/${gameName}`);
        await Promise.all(
          pics.map(async (picName) => {
            const picDir = `${gameName}/${picName}`;
            const picFile = await fs.readFile(`./pics/${picDir}`);

            const storageRef = ref(storage, `gameListPics/${picDir}`);
            // 'file' comes from the Blob or File API
            await uploadBytes(storageRef, picFile, {
              contentType: 'image/png',
            });
          })
        );
      })
    );
    console.log(
      `Finished uploading ${
        i + FIRESTORE_CLOUD_UPLOAD_BATCH_SIZE >= gameList.length
          ? gameList.length
          : i + FIRESTORE_CLOUD_UPLOAD_BATCH_SIZE
      } of ${gameList.length} game pics to Firestore`
    );
  }
  console.log('Done uploading pics to Firebase Cloud Storage');
})();
