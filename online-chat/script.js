import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// NEW: Import Auth functions
import { 
    getAuth, signInWithPopup, GoogleAuthProvider, 
    createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCfnuDVP47ex-QsjqOoBDUyDu8dE6EPpBo",
    authDomain: "online-chat-a3602.firebaseapp.com",
    projectId: "online-chat-a3602",
    storageBucket: "online-chat-a3602.firebasestorage.app",
    messagingSenderId: "23307042316",
    appId: "1:23307042316:web:b9ff829f08fe22a20ab829",
    measurementId: "G-KKN070WRXE"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const authContainer = document.getElementById('auth-container');
const chatApp = document.getElementById('chat-app');
const logoutBtn = document.getElementById('logout-btn');

// --- 1. AUTH LOGIC ---

// Google Login
document.getElementById('google-login').onclick = () => signInWithPopup(auth, provider);

// Email Signup
document.getElementById('email-signup').onclick = () => {
    const email = document.getElementById('email-input').value;
    const pass = document.getElementById('pass-input').value;
    createUserWithEmailAndPassword(auth, email, pass).catch(err => alert(err.message));
};

// Email Login
document.getElementById('email-login').onclick = () => {
    const email = document.getElementById('email-input').value;
    const pass = document.getElementById('pass-input').value;
    signInWithEmailAndPassword(auth, email, pass).catch(err => alert(err.message));
};

// Logout
logoutBtn.onclick = () => signOut(auth);

// --- 2. THE STATE OBSERVER ---
// This runs every time the user logs in or out
onAuthStateChanged(auth, (user) => {
    if (user) {
        authContainer.style.display = 'none';
        chatApp.style.display = 'block';
        console.log("Logged in as:", user.displayName || user.email);
        loadMessages(user.uid); // Start the chat logic
    } else {
        authContainer.style.display = 'flex';
        chatApp.style.display = 'none';
    }
});

// --- 3. CHAT LOGIC (Modified to use real UIDs) ---
function loadMessages(currentUid) {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    onSnapshot(q, (snapshot) => {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            // Now we check the REAL user ID from Firebase
            displayMessage(data.text, data.uid === currentUid, data.author);
        });
    });
}

// When sending, include the user's name
document.getElementById('message-form').onsubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById('user-input');
    const user = auth.currentUser;

    await addDoc(collection(db, "messages"), {
        text: input.value,
        createdAt: serverTimestamp(),
        uid: user.uid,
        author: user.displayName || user.email // Fallback to email if no name
    });
    input.value = '';
};