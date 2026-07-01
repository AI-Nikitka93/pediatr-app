import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');

// Replace common color classes with their dark variants globally
const replacements = [
  { search: /\bbg-white\b/g, replace: 'bg-white dark:bg-slate-900' },
  { search: /\btext-slate-900\b/g, replace: 'text-slate-900 dark:text-slate-100' },
  { search: /\btext-slate-800\b/g, replace: 'text-slate-800 dark:text-slate-200' },
  { search: /\btext-slate-700\b/g, replace: 'text-slate-700 dark:text-slate-300' },
  { search: /\btext-slate-600\b/g, replace: 'text-slate-600 dark:text-slate-400' },
  { search: /\btext-slate-500\b/g, replace: 'text-slate-500 dark:text-slate-500' },
  { search: /\bbg-slate-50\b/g, replace: 'bg-slate-50 dark:bg-slate-800\/50' },
  { search: /\bbg-slate-100\b/g, replace: 'bg-slate-100 dark:bg-slate-800' },
  { search: /\bborder-slate-200\b/g, replace: 'border-slate-200 dark:border-slate-700' },
  { search: /\bborder-slate-100\b/g, replace: 'border-slate-100 dark:border-slate-800' },
  // Emerald accents
  { search: /\bbg-emerald-50\b/g, replace: 'bg-emerald-50 dark:bg-emerald-900\/20' },
  { search: /\bbg-emerald-100\b/g, replace: 'bg-emerald-100 dark:bg-emerald-900\/40' },
  { search: /\bbg-emerald-600\b/g, replace: 'bg-emerald-600 dark:bg-emerald-700' },
];

let newApp = app;

replacements.forEach(r => {
  // Try to remove previous dark: duplicates if any exist
  const darkClass = r.replace.split(' ')[1];
  if (darkClass) {
    const stripRegex = new RegExp('\\b' + darkClass.replace(/\//g, '\\/') + '\\b', 'g');
    newApp = newApp.replace(stripRegex, '');
  }
});

// Now apply
replacements.forEach(r => {
  newApp = newApp.replace(r.search, r.replace);
});

// Remove double spaces introduced by the cleanup
newApp = newApp.replace(/  +/g, ' ');

fs.writeFileSync(appPath, newApp);
console.log("Applied Dark Mode to App.tsx successfully.");
