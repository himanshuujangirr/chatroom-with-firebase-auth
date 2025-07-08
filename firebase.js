import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCU75G4huFiusLyKEMGi4H54ZN_C-X9D-E",
    authDomain: "mychatapp-ee3b1.firebaseapp.com",
    projectId: "mychatapp-ee3b1",
    storageBucket: "mychatapp-ee3b1.appspot.com",
    messagingSenderId: "302796192959",
    appId: "1:302796192959:web:c972a16dac994285835a0a",
    measurementId: "G-MHFLV6ESFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Anonymous sign-in
signInAnonymously(auth)
    .then(() => console.log("Signed in anonymously"))
    .catch((error) => console.error("Error signing in:", error));

// Function to fetch security question & answer from Firestore
export async function getSecurityQuestion(userId) {
    const docRef = doc(db, "security_questions", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.error("No security question found for user:", userId);
        return null;
    }
}

export { db, auth, signInAnonymously, addDoc, collection, serverTimestamp };
