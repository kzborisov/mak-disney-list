import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env
    .VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/**
 * Write data to the Movies realtime database
 * @param {string} movieId The title of the movie
 * @param {string} title The title of the movie (again)
 * @param {number} year The year the movie was released
 * @param {string} imgUrl Url to the image of the movie
 * @param {boolean} watched Has the movie been watched already
 */
export function writeMovieData(movieId, title, year, imgUrl, watched) {
  const reference = ref(db, "movies/" + movieId);
  set(reference, {
    title,
    year,
    image_url: imgUrl,
    watched,
  });
}
