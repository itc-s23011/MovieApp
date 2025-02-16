import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Firebase 設定情報
const firebaseConfig = {
    apiKey: "AIzaSyDAGONL5Xo_QNFAGHJEi-ewEN0Vr_FjSaw",
    authDomain: "movieapp-8810c.firebaseapp.com",
    projectId: "movieapp-8810c",
    // storageBucket: "movieapp-8810c.appspot.com", // 画像保存が不要になったためコメントアウト
    messagingSenderId: "650219347154",
    appId: "1:650219347154:web:570cd21167d3f567aca10b",
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export { app, auth };
