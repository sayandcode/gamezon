// this is listed as a dev dependency, as MockDBFetch is intended only for dev builds
// eslint-disable-next-line import/no-extraneous-dependencies
import { FastHTMLParser } from 'fast-html-dom-parser';

const JSON_DATABASE_URL = 'http://127.0.0.1:5500/JSONDatabase';
const STORAGE_DB_URL = 'http://127.0.0.1:5500/storage';
const GAME_PICS_ROOT_FOLDER = 'gameListPics';

export async function getDataFromQuery({
  key,
  comparison,
  value,
  collectionName,
}) {
  const response = await fetch(`${JSON_DATABASE_URL}/${collectionName}.json`);
  const dataObj = await response.json();

  function compare(_key, _value) {
    switch (comparison) {
      case '==':
        return _key === _value;
      case '!=':
        return _key !== _value;
      default:
        throw new Error(
          `Cannot query database without comparison operator!(${JSON.stringify({
            comparison,
          })})`
        );
    }
  }
  const result = Object.values(dataObj).filter((doc) =>
    compare(doc[key], doc[value])
  );
  return result;
}

export async function getScreenshotFor(title, { count } = { count: 1 }) {
  const folderPath = `${STORAGE_DB_URL}/${GAME_PICS_ROOT_FOLDER}/${encodeURIComponent(
    title
  ).toString()}`;
  if (count === 1) {
    const filePath = `${folderPath}/2.png`;
    const localURL = await getImageFromDBPath(filePath);
    return localURL;
  }

  const folderDocumentHTML = await (await fetch(folderPath)).text();
  const folderDocument = new FastHTMLParser(folderDocumentHTML);
  const allFilesInFolder = folderDocument.getElementsByClassName('icon-image');
  const allFileNames = allFilesInFolder.map(
    (file) => file.getElementsByClassName('name')[0].textContent
  );

  const filteredFileNames = allFileNames.filter(
    (fileName) => fileName !== 'boxArt.png'
  );
  const requiredFileNames = filteredFileNames.slice(0, count);
  const localURLs = await Promise.allSettledFiltered(
    requiredFileNames.map(async (fileName) => {
      const filePath = `${folderPath}/${fileName}`;
      return getImageFromDBPath(filePath);
    })
  );

  const dbItemCount = requiredFileNames.length;
  if (count > dbItemCount)
    console.log(
      `Database didn't have ${count} files. All ${dbItemCount} files returned`
    );

  return localURLs;
}

export async function getboxArtFor(title) {
  const path = `${STORAGE_DB_URL}/${GAME_PICS_ROOT_FOLDER}/${encodeURIComponent(
    title
  ).toString()}/boxArt.png`;
  const imgURL = await getImageFromDBPath(path);
  return imgURL;
}

async function getImageFromDBPath(path) {
  const response = await fetch(path);
  const imgBlob = await response.blob();
  const localURL = URL.createObjectURL(imgBlob);
  return localURL;
}
