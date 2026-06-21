// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDMoTBTEeKzV1EIO_MeoVaK1w9nrXqshXQ",
	authDomain: "fitness-pro-67b02.firebaseapp.com",
	databaseURL: "https://fitness-pro-67b02-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "fitness-pro-67b02",
	storageBucket: "fitness-pro-67b02.appspot.com",
	messagingSenderId: "755423996845",
	appId: "1:755423996845:web:a11e12926ee4d341958f24",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
