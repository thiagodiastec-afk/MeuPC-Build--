const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importFirebase = `import { auth, signInWithGoogle, signOut, saveUserBuild, getUserBuilds, deleteUserBuild } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';`;
code = code.replace("import { checkBuildCompatibility }", importFirebase + "\nimport { checkBuildCompatibility }");

code = code.replace("const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);", 
`const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch cloud builds
        try {
          const cloudBuilds = await getUserBuilds(currentUser.uid);
          if (cloudBuilds && cloudBuilds.length > 0) {
            setSavedBuilds(cloudBuilds as SavedBuild[]);
            persistSavedBuilds(cloudBuilds as SavedBuild[]);
          }
        } catch (e) {
          console.error("Error fetching cloud builds", e);
        }
      }
    });
    return () => unsubscribe();
  }, []);
`);

const saveCurrentReplace = `const handleSaveCurrentBuild = async (nameOverride?: string) => {`;
code = code.replace("const handleSaveCurrentBuild = (nameOverride?: string) => {", saveCurrentReplace);

const saveCloudLogic = `    const updated = [newBuild, ...savedBuilds];
    setSavedBuilds(updated);
    persistSavedBuilds(updated);
    
    if (user) {
      saveUserBuild(user.uid, newBuild).catch(e => console.error(e));
    }`;
code = code.replace(/    const updated = \[newBuild, \.\.\.savedBuilds\];\n    setSavedBuilds\(updated\);\n    persistSavedBuilds\(updated\);/, saveCloudLogic);

const deleteReplace = `const handleDeleteSavedBuild = async (id: string) => {`;
code = code.replace("const handleDeleteSavedBuild = (id: string) => {", deleteReplace);

const deleteCloudLogic = `    const updated = savedBuilds.filter(b => b.id !== id);
    setSavedBuilds(updated);
    persistSavedBuilds(updated);
    
    if (user) {
      deleteUserBuild(user.uid, id).catch(e => console.error(e));
    }`;
code = code.replace(/    const updated = savedBuilds\.filter\(b => b\.id !== id\);\n    setSavedBuilds\(updated\);\n    persistSavedBuilds\(updated\);/, deleteCloudLogic);

const dupReplace = `const handleDuplicateSavedBuild = async (id: string) => {`;
code = code.replace("const handleDuplicateSavedBuild = (id: string) => {", dupReplace);

const dupCloudLogic = `    const updated = [duplicated, ...savedBuilds];
    setSavedBuilds(updated);
    persistSavedBuilds(updated);

    if (user) {
      saveUserBuild(user.uid, duplicated).catch(e => console.error(e));
    }`;
code = code.replace(/    const updated = \[duplicated, \.\.\.savedBuilds\];\n    setSavedBuilds\(updated\);\n    persistSavedBuilds\(updated\);/, dupCloudLogic);

// Pass user to Header and Drawer
code = code.replace(`          partsCount={partsCount}\n          buildName={buildName}`, 
`          partsCount={partsCount}\n          buildName={buildName}\n          user={user}\n          onSignIn={signInWithGoogle}\n          onSignOut={signOut}`);

code = code.replace(`            currentBuildName={buildName}\n          />`, 
`            currentBuildName={buildName}\n            user={user}\n            onSignIn={signInWithGoogle}\n          />`);

fs.writeFileSync('src/App.tsx', code);
