// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlemkfsB1spUVJmrd9b-cYlMxC7yNwXZc",
  authDomain: "travelohi-e69e8.firebaseapp.com",
  projectId: "travelohi-e69e8",
  storageBucket: "travelohi-e69e8.appspot.com",
  messagingSenderId: "677923720212",
  appId: "1:677923720212:web:b19d5dc52f8f482792ab01",
  measurementId: "G-SQY1Z7JQMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export {storage}