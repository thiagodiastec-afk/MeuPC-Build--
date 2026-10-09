import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0036916917",
  appId: "1:560833797194:web:fded8bb86f218d8e441ab3",
  apiKey: "AIzaSyBCdqt3E7hAV3quWhAyrGLMH8XfS1WyuAc",
  authDomain: "gen-lang-client-0036916917.firebaseapp.com",
  storageBucket: "gen-lang-client-0036916917.firebasestorage.app",
  messagingSenderId: "560833797194",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
}, "ai-studio-meupcbuildmontad-8e2a5593-452b-4de8-9a20-047d63d7d4da");

const auth = getAuth(app);

export { app, db, auth };
