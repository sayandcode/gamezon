import { getDocs } from 'firebase/firestore';
import { getBlob, listAll, ref } from 'firebase/storage';
import { firebaseStorage } from '../firebase-config';

const GAME_PICS_ROOT_FOLDER = 'gameListPics';

export async function getDataFromQuery(queryObj) {
  const q = queryObj.extractQuery();
  const docsSnapshot = await getDocs(q);
  const documents = docsSnapshot.docs.map((doc) => ({
    ref: doc,
    data: doc.data(),
  }));
  return documents;
}

export async function getScreenshotFor(title, { count } = { count: 1 }) {
  const folderPath = `gameListPics/${title}`;
  if (count === 1) {
    const filePath = `${folderPath}/2.png`;
    const localURL = await getImageFromDBPath(filePath);
    return localURL;
  }
  const folderRef = ref(firebaseStorage, folderPath);
  const fileRefs = (await listAll(folderRef)).items;
  const filteredFileRefs = fileRefs.filter(
    (item) => item.name !== 'boxArt.png'
  );
  const requiredFileRefs = filteredFileRefs.slice(0, count);
  const localURLs = await Promise.allSettledFiltered(
    requiredFileRefs.map((fileRef) => getImageFromDBPath(fileRef.fullPath))
  );

  const dbItemCount = filteredFileRefs.length;
  if (count > dbItemCount)
    console.warn(
      `Database didn't have ${count} files. All ${dbItemCount} files returned`
    );

  return localURLs;
}
export async function getboxArtFor(title) {
  const path = `${GAME_PICS_ROOT_FOLDER}/${title}/boxArt.png`;
  const imgURL = await getImageFromDBPath(path);
  return imgURL;
}

async function getImageFromDBPath(path) {
  const pathRef = ref(firebaseStorage, path);
  const imgBlob = await getBlob(pathRef);
  const localURL = URL.createObjectURL(imgBlob);
  return localURL;
}
