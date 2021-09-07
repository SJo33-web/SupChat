//here we are import the installed firebase module in our application such that we can use it

import firebase from "firebase"

//these are the conguration keys for our application

const firebaseConfig = {
    apiKey: "AIzaSyCj3B9txhhX4vDFjfpajKohE7Qb0iCY4Zc",
    authDomain: "supchat-4c857.firebaseapp.com",
    projectId: "supchat-4c857",
    storageBucket: "supchat-4c857.appspot.com",
    messagingSenderId: "980698496071",
    appId: "1:980698496071:web:d878078432feab3d3bc562",
    measurementId: "G-G017GCE7RL"
};


// iniatialising or starting our apllication

const firebaseApp = firebase.initializeApp(firebaseConfig)

// create a link to our database

const db = firebaseApp.firestore()

//create link for authentication

const auth = firebase.auth()

// configure google authentication service

const provider = new firebase.auth.GoogleAuthProvider()


// export our instances

export { auth, provider }
export default db