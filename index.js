import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDesISfb30mWNj5EsGE88rN30S--foGzw8",
  authDomain: "ttsmartmirror.firebaseapp.com",
  projectId: "ttsmartmirror",
  storageBucket: "ttsmartmirror.appspot.com",
  messagingSenderId: "459172659001",
  appId: "1:459172659001:web:7e333f094fb00e6197b2e8",
  measurementId: "G-TD6KLLNNTV"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
conosle.log(app);