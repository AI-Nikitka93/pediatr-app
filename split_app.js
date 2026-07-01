import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');

const markers = [
  { id: 'home', str: '{activeTab === "home" && (' },
  { id: 'chat', str: '{activeTab === "ai-chat" && (' },
  { id: 'tools', str: '{activeTab === "tools" && (' },
  { id: 'quiz', str: '{activeTab === "quiz" && (' },
  { id: 'cabinet', str: '{activeTab === "cabinet" && (' }
];

const indices = markers.map(m => {
  const i = app.indexOf(m.str);
  if (i === -1) throw new Error("Marker not found: " + m.str);
  return { id: m.id, index: i };
});

// Add the end of file index
indices.push({ id: 'end', index: app.lastIndexOf('  );') });

const pagesDir = path.join(process.cwd(), 'src/pages');
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir);

for (let i = 0; i < indices.length - 1; i++) {
  const chunk = app.substring(indices[i].index, indices[i+1].index);
  const fileName = indices[i].id.charAt(0).toUpperCase() + indices[i].id.slice(1) + 'Tab.tsx';
  
  const content = `import React from 'react';
import { Baby, Stethoscope, Heart, ShieldAlert, CheckCircle2, Calendar, User, MessageCircle, Activity, Trophy, Apple, Sparkles, BookOpen, Clock, ChevronRight, Calculator, Check, X, Award, AlertCircle, PhoneCall, MapPin, FileText, Download, Plus, Trash2, CheckSquare, Square, HelpCircle, TrendingUp, ArrowRight, Info, Volume2, VolumeX, Bell, BellOff, Building2, Lock, LogOut, Key, Users, Briefcase } from 'lucide-react';
const GrowthChart = React.lazy(() => import("../components/GrowthChart"));

export default function ${indices[i].id.charAt(0).toUpperCase() + indices[i].id.slice(1)}Tab(props: any) {
  const { ${indices[i].id === 'cabinet' ? 'currentUser, usersStore, handleLogin, handleRegister, handleLogout' : ''} } = props;
  
  return (
    <>
      ${chunk.replace(markers[i].str, '').replace(/}\)$/, '').trim()}
    </>
  );
}
`;
  fs.writeFileSync(path.join(pagesDir, fileName), content);
  console.log("Wrote " + fileName);
}
