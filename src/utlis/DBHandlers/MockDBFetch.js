// this is listed as a dev dependency, as MockDBFetch is intended only for dev builds
// eslint-disable-next-line import/no-extraneous-dependencies
import { FastHTMLParser } from 'fast-html-dom-parser';
import { getPropertyValue } from '../HelperFns';
import sleep from '../sleep';

const JSON_DATABASE_URL = 'http://127.0.0.1:5500/JSONDatabase';
const STORAGE_DB_URL = 'http://127.0.0.1:5500/storage';
const GAME_PICS_ROOT_FOLDER = 'gameListPics';

export async function getDataFromQuery({
  collectionPath,
  whereFields,
  limitNo,
  startAtDoc,
  startAfterDoc,
  limitToLastNo,
  endBeforeDoc,
  orderByFields,
}) {
  await sleep(1000);
  const response = await fetch(
    `${JSON_DATABASE_URL}/${collectionPath.join('/')}.json`
  );
  const dataObj = await response.json();

  // filter by where clause, and also any orderBy fields
  let filteredDocs = Object.values(dataObj);
  whereFields?.forEach((field) => {
    const { key, comparison, value } = field;
    filteredDocs = filteredDocs.filter((doc) =>
      compare(doc, key, comparison, value)
    );
  });
  orderByFields?.forEach(({ key }) => {
    filteredDocs = filteredDocs.filter((doc) => compare(doc, key, 'exists'));
  });

  // order by orderBy clause
  let filteredOrderedDocs = filteredDocs;
  orderByFields?.forEach(({ key, desc }) => {
    filteredOrderedDocs = filteredDocs.sort((doc1, doc2) => {
      const [a, b] = desc ? [doc2, doc1] : [doc1, doc2];
      const [aVal, bVal] = [getPropertyValue(a, key), getPropertyValue(b, key)];

      if (typeof aVal === 'string') return aVal > bVal ? 1 : -1;
      return aVal - bVal;
    });
  });

  const queriedDocs = filteredOrderedDocs;

  let startDocIndex = 0;
  let endDocIndex;

  if (startAfterDoc || startAtDoc) {
    const givenDocIndex = queriedDocs.findIndex(
      (doc) => doc.Title === (startAfterDoc || startAtDoc)
    );
    if (givenDocIndex === -1)
      throw new Error("Start doc doesn't exist in queried results");

    startDocIndex = startAfterDoc ? givenDocIndex + 1 : givenDocIndex;
  }
  if (endBeforeDoc) {
    endDocIndex = queriedDocs.findIndex((doc) => doc.Title === endBeforeDoc);
    if (startDocIndex === -1)
      throw new Error("End doc doesn't exist in queried results");
  }

  const edgeFilteredDocs = queriedDocs
    .map((doc) => ({ ref: doc.Title, data: doc }))
    .slice(startDocIndex, endDocIndex); // if endDocIndex is undefined it just returns all the docs

  if (limitNo) [startDocIndex, endDocIndex] = [0, limitNo];
  else if (limitToLastNo)
    [startDocIndex, endDocIndex] = [-limitToLastNo, undefined];

  const result = edgeFilteredDocs.slice(startDocIndex, endDocIndex);

  return result;

  function compare(doc, _key, _comparison, givenVal) {
    // eslint-disable-next-line no-underscore-dangle
    const valueInDoc = getPropertyValue(doc, _key);
    switch (_comparison) {
      case '==':
        return valueInDoc === givenVal;
      case '!=':
        return valueInDoc !== givenVal;
      case '<':
        return valueInDoc < givenVal;
      case '<=':
        return valueInDoc <= givenVal;
      case '>':
        return valueInDoc > givenVal;
      case '>=':
        return valueInDoc >= givenVal;
      case 'in':
        return givenVal.includes(valueInDoc);
      case 'not-in':
        return !givenVal.includes(valueInDoc);
      case 'array-contains':
        return valueInDoc.includes(givenVal);
      case 'array-contains-any':
        return givenVal.some((val) => valueInDoc.includes(val));
      case 'exists':
        return !!valueInDoc;

      default:
        throw new Error(
          `Cannot query database without comparison operator!(${JSON.stringify({
            _comparison,
          })})`
        );
    }
  }
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
    console.warn(
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
