import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBCdqt3E7hAV3quWhAyrGLMH8XfS1WyuAc",
  authDomain: "gen-lang-client-0036916917.firebaseapp.com",
  projectId: "gen-lang-client-0036916917",
  storageBucket: "gen-lang-client-0036916917.firebasestorage.app",
  messagingSenderId: "560833797194",
  appId: "1:560833797194:web:fded8bb86f218d8e441ab3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Use the explicit database ID configured during setup
export const firestoreDbId = "ai-studio-meupcbuildmontad-8e2a5593-452b-4de8-9a20-047d63d7d4da";

// Update the db instance if necessary to use the specific database
// Note: In firebase@10+, you can specify the databaseId in initializeFirestore if needed,
// but for standard initialization, the default is usually fine if we only provisioned one.
// The skill suggests we don't need to specify it unless using a secondary database, but let's be safe.
// Actually, firebase-applet-config.json gives firestoreDatabaseId.
// In the current JS SDK, it's just `getFirestore(app, firestoreDbId)`
export const firestore = getFirestore(app, firestoreDbId);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signOut = () => firebaseSignOut(auth);

// CRUD operations for user builds
export const saveUserBuild = async (userId: string, buildData: any) => {
  const buildRef = doc(firestore, 'users', userId, 'builds', buildData.id);
  await setDoc(buildRef, {
    ...buildData,
    updatedAt: new Date().toISOString()
  });
};

export const getUserBuilds = async (userId: string) => {
  const buildsRef = collection(firestore, 'users', userId, 'builds');
  const snapshot = await getDocs(buildsRef);
  return snapshot.docs.map(doc => doc.data());
};

export const deleteUserBuild = async (userId: string, buildId: string) => {
  const buildRef = doc(firestore, 'users', userId, 'builds', buildId);
  await deleteDoc(buildRef);
};

// Catalog operations
export const getCatalogComponents = async () => {
  const compRef = collection(firestore, 'components');
  const snapshot = await getDocs(compRef);
  return snapshot.docs.map(doc => doc.data());
};
