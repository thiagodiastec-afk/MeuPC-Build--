const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importFirebase = `import { auth, signInWithGoogle, signOut, saveUserBuild, getUserBuilds, deleteUserBuild, getCatalogComponents } from './services/firebase';`;
code = code.replace(/import { auth, signInWithGoogle.*} from '.\/services\/firebase';/, importFirebase);

const importDatabase = `import { CATEGORY_INFO, RAW_COMPONENTS, setRawComponents } from './data/componentsDatabase';`;
code = code.replace(/import { CATEGORY_INFO, RAW_COMPONENTS } from '.\/data\/componentsDatabase';/, importDatabase);

const loadCatalogHook = `
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const cloudComponents = await getCatalogComponents();
        if (cloudComponents && cloudComponents.length > 0) {
          setRawComponents(cloudComponents as PCComponent[]);
        }
      } catch (e) {
        console.error("Error fetching cloud catalog", e);
      } finally {
        setCatalogLoaded(true);
      }
    };
    loadCatalog();
  }, []);
`;

code = code.replace("  // Initialize Auth", loadCatalogHook + "\n  // Initialize Auth");

fs.writeFileSync('src/App.tsx', code);
