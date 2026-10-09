import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { RAW_COMPONENTS } from './src/data/componentsDatabase';

const firebaseConfig = {
  apiKey: "AIzaSyBCdqt3E7hAV3quWhAyrGLMH8XfS1WyuAc",
  authDomain: "gen-lang-client-0036916917.firebaseapp.com",
  projectId: "gen-lang-client-0036916917",
  storageBucket: "gen-lang-client-0036916917.firebasestorage.app",
  messagingSenderId: "560833797194",
  appId: "1:560833797194:web:fded8bb86f218d8e441ab3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-meupcbuildmontad-8e2a5593-452b-4de8-9a20-047d63d7d4da");

async function seed() {
  console.log(`Seeding ${RAW_COMPONENTS.length} components to Firestore...`);
  let count = 0;
  for (const comp of RAW_COMPONENTS) {
    const compRef = doc(db, 'components', comp.id);
    await setDoc(compRef, comp);
    count++;
    if (count % 10 === 0) {
      console.log(`Seeded ${count}/${RAW_COMPONENTS.length}`);
    }
  }
  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(console.error);
