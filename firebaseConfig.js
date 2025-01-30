import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "@firebase/storage";

// Firebase 設定情報
const firebaseConfig = {
    apiKey: "AIzaSyDAGONL5Xo_QNFAGHJEi-ewEN0Vr_FjSaw",
    authDomain: "movieapp-8810c.firebaseapp.com",
    projectId: "movieapp-8810c",
    storageBucket: "movieapp-8810c.firebasestorage.app",
    messagingSenderId: "650219347154",
    appId: "1:650219347154:web:570cd21167d3f567aca10b",
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
