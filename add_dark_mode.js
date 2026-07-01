import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');

const replacements = [
  { search: /\bbg-white\b/g, replace: 'bg-white dark:bg-slate-900' },
  { search: /\btext-slate-900\b/g, replace: 'text-slate-900 dark:text-slate-100' },
  { search: /\btext-slate-800\b/g, replace: 'text-slate-800 dark:text-slate-200' },
  { search: /\btext-slate-700\b/g, replace: 'text-slate-700 dark:text-slate-300' },
  { search: /\btext-slate-600\b/g, replace: 'text-slate-600 dark:text-slate-400' },
  { search: /\bbg-slate-50\b/g, replace: 'bg-slate-50 dark:bg-slate-800/50' },
  { search: /\bbg-slate-100\b/g, replace: 'bg-slate-100 dark:bg-slate-800' },
  { search: /\bborder-slate-200\b/g, replace: 'border-slate-200 dark:border-slate-700' },
  { search: /\bborder-slate-100\b/g, replace: 'border-slate-100 dark:border-slate-700/50' },
];

let newApp = app;
// To avoid double-replacements if run multiple times, let's clean it up first
replacements.forEach(r => {
  // strip existing dark: classes for these specific items just in case
  newApp = newApp.replace(new RegExp(r.replace.split(' ')[1], 'g'), '');
  // then apply them
  newApp = newApp.replace(r.search, r.replace);
  // fix extra spaces
  newApp = newApp.replace(/\s+/g, ' ');
});

// Since regex replace with spaces might mess up newlines and formatting (wait, \s+ replacing messes up code!),
// I cannot use \s+ blindly on the whole file!! 
