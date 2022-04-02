import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyDM0-i1n7sbIv5ZfoqAtK27BJitlfnH2Xc",
    authDomain: "cis371project-74531.firebaseapp.com",
    projectId: "cis371project-74531",
    storageBucket: "cis371project-74531.appspot.com",
    messagingSenderId: "416352564578",
    appId: "1:416352564578:web:45c0ff4a79a4be1231283b"
};

const app = initializeApp(firebaseConfig); 

export default app;