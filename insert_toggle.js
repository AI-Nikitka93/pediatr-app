import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');

const targetStr = `              )}
            </button>
          </nav>
        </div>`;

const newStr = `              )}
            </button>
            <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1 hidden sm:block"></div>
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 cursor-pointer"
              title="Переключить тему"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </nav>
        </div>`;

// Use regex to ignore \r vs \n differences
const regex = /\s*}\)\s*}\s*<\/button>\s*<\/nav>\s*<\/div>/;

if (regex.test(app)) {
  app = app.replace(regex, newStr);
  fs.writeFileSync(appPath, app);
  console.log("Toggle inserted successfully.");
} else {
  console.log("Could not find the target string with regex.");
}
