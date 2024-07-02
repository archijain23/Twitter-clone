import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbi7S8sIxRtK8wBV_9ao-g5a0BWYUaGcg",
  authDomain: "twitterclone-77f6b.firebaseapp.com",
  projectId: "twitterclone-77f6b",
  storageBucket: "twitterclone-77f6b.appspot.com",
  messagingSenderId: "174747650717",
  appId: "1:174747650717:web:2d7a5af63d301442d16274",
  measurementId: "G-BYZW1VSMHF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
