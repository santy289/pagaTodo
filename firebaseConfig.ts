import react from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: "AIzaSyCd4CVe2GmInJ-hvVFjMFf392xdxtBHeSs",
  authDomain: "pagatodo-9acb4.firebaseapp.com",
  projectId: "pagatodo-9acb4",
  storageBucket: "pagatodo-9acb4.appspot.com",
  messagingSenderId: "61492390293",
  appId: "1:61492390293:web:d88e7f9e665f73d253ae9c",
  measurementId: "G-W6FQH1968P",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
