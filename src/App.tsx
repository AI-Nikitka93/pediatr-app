import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
 Baby, 
 Stethoscope, 
 Heart, 
 ShieldAlert, 
 CheckCircle2, 
 Calendar, 
 User, 
 MessageCircle, 
 Activity, 
 Trophy, 
 Apple, 
 Sparkles, 
 BookOpen, 
 Clock, 
 ChevronRight, 
 Calculator, 
 Check, 
 X, 
 Award, 
 AlertCircle, 
 PhoneCall, 
 MapPin, 
 FileText, 
 Download,
 Plus, 
 Trash2, 
 CheckSquare, 
 Square, 
 HelpCircle,
 TrendingUp,
 ArrowRight,
 Info,
 Volume2,
 VolumeX,
 Bell,
 BellOff,
 Building2,
 Lock,
 LogOut,
 Key,
 Users,
 Briefcase,
 Moon,
 Sun
} from "lucide-react";

import { useDarkMode } from "./hooks/useDarkMode";

const GrowthChart = React.lazy(() => import("./components/GrowthChart"));

import { AppUser, CorporateChild, Doctor, ChildProfile, GrowthRecord, SicknessRecord, Appointment, Message, VaccineGuide } from './types';
import { VACCINE_DATABASE, DOCTORS, MYTH_QUIZ_QUESTIONS } from './data/constants';
import { generateDefaultGrowthLogs, getWhoMedianForAge, readStoredJson } from './utils/helpers';
import { useChildProfile } from './hooks/useChildProfile';
import { useChat } from './hooks/useChat';
import { useAuth } from './hooks/useAuth';
export default function App() {
  const { isDark, toggleDarkMode } = useDarkMode();
 // Navigation: "home" | "ai-chat" | "tools" | "quiz" | "cabinet"
 const [activeTab, setActiveTab] = useState<"home" | "ai-chat" | "tools" | "quiz" | "cabinet">("home");

 // Extracted hooks
 const { childProfile, setChildProfile, inputChildName, setInputChildName, inputChildGender, setInputChildGender, inputChildBirthdate, setInputChildBirthdate, completedVaccines, setCompletedVaccines, sicknessLogs, setSicknessLogs, appointments, setAppointments } = useChildProfile();
 const { chatMessages, setChatMessages, chatInput, setChatInput, isTyping: isChatLoading, setIsTyping: setIsChatLoading, chatEndRef, sendChatMessage } = useChat();

 const [newSymptomText, setNewSymptomText] = useState("");
 const [newNotesText, setNewNotesText] = useState("");

 // Booking Form State
 const [bookDoctorId, setBookDoctorId] = useState("dr1");
 const [bookDate, setBookDate] = useState("2026-05-26");
 const [bookTime, setBookTime] = useState("14:30");
 const [bookSymptom, setBookSymptom] = useState("Плановое взвешивание, осмотр ротовой полости");
 const [bookType, setBookType] = useState<"online" | "offline">("offline");
 const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);

 // Growth calculator states
 const [calcAgeMonths, setCalcAgeMonths] = useState<number>(12);
 const [calcWeight, setCalcWeight] = useState<number>(10);
 const [calcHeight, setCalcHeight] = useState<number>(75);
 const [calcGender, setCalcGender] = useState<"boy" | "girl">("boy");
 const [calcResult, setCalcResult] = useState<{
 bmi: number;
 bmiStatus: string;
 weightStatus: string;
 heightStatus: string;
 generalAdvise: string;
 colorClass: string;
 } | null>(null);

 // Myths quiz state
 const [quizIndex, setQuizIndex] = useState(0);
 const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
 const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
 const [quizScore, setQuizScore] = useState(0);
 const [quizCompleted, setQuizCompleted] = useState(false);

 // Urgent notice banner toggle
 const [showUrgentBanner, setShowUrgentBanner] = useState(true);

 // PDF Export loader state
 const [isExportingPDF, setIsExportingPDF] = useState(false);

 // Growth tracking states
 const [growthLogs, setGrowthLogs] = useState<GrowthRecord[]>(() => {
 const savedLogs = readStoredJson<GrowthRecord[] | null>("pediatr_growth_logs", null);
 if (savedLogs) return savedLogs;

 const savedProfile = readStoredJson<ChildProfile | null>("pediatr_child_profile", null);
 if (savedProfile) {
 return generateDefaultGrowthLogs(savedProfile.birthdate, savedProfile.gender);
 }
 return [];
 });

 const [newGrowthAge, setNewGrowthAge] = useState<number>(12);
 const [newGrowthDate, setNewGrowthDate] = useState<string>("");
 const [newGrowthWeight, setNewGrowthWeight] = useState<string>("");
 const [newGrowthHeight, setNewGrowthHeight] = useState<string>("");
 const [growthActiveMetric, setGrowthActiveMetric] = useState<"weight" | "height">("weight");

 // Vaccine notifications configuration
 const [vaccineAudioEnabled, setVaccineAudioEnabled] = useState<boolean>(() => {
 return readStoredJson<boolean>("pediatr_vac_audio_enabled", true);
 });

 const [vaccineBrowserNotificationsEnabled, setVaccineBrowserNotificationsEnabled] = useState<boolean>(() => {
 return readStoredJson<boolean>("pediatr_vac_browser_enabled", false);
 });

 interface CustomToast {
 id: string;
 title: string;
 message: string;
 type: "info" | "warning" | "success";
 }
 const [toasts, setToasts] = useState<CustomToast[]>([]);

 // ========================================================
 // Demo dual-role cabinet. Real production auth must move server-side before launch.
 // ========================================================
 const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
 return readStoredJson<AppUser | null>("pediatr_auth_session", null);
 });

 const [usersStore, setUsersStore] = useState<AppUser[]>(() => {
 const savedUsers = readStoredJson<AppUser[] | null>("pediatr_users_store", null);
 if (savedUsers) return savedUsers;
 const defaultUsers: AppUser[] = [
 {
 id: "u_b2c_demo",
 type: "private",
 email: "parent@example.com",
 name: "Елена Иванова",
 phone: "+7 (999) 888-77-66",
 childName: "Максим",
 childGender: "boy",
 childBirthdate: "2025-05-15"
 },
 {
 id: "u_b2b_demo",
 type: "company",
 email: "clinic@example.com",
 name: "Доказательная Клиника «Звезда»",
 phone: "+7 (495) 111-22-33",
 inn: "7701234567",
 address: "Москва, Миусская площадь, д. 9",
 contactPerson: "Ольга Мальцева",
 role: "partner_clinic"
 }
 ];
 localStorage.setItem("pediatr_users_store", JSON.stringify(defaultUsers));
 return defaultUsers;
 });

 const [corporateChildren, setCorporateChildren] = useState<CorporateChild[]>(() => {
 const saved = readStoredJson<CorporateChild[] | null>("pediatr_corporate_children", null);
 if (saved) return saved;
 const defaultCorp: CorporateChild[] = [
 { id: "cc1", name: "Алиса Кузнецова", gender: "girl", birthdate: "2025-02-12", ageInMonths: 15, clinicId: "u_b2b_demo", corporatePlan: "Бизнес Премиум", lastCheckupDate: "2026-05-10" },
 { id: "cc2", name: "Кирилл Соловьев", gender: "boy", birthdate: "2024-09-01", ageInMonths: 20, clinicId: "u_b2b_demo", corporatePlan: "VIP Развитие", lastCheckupDate: "2026-05-12" },
 { id: "cc3", name: "Милан Романов", gender: "boy", birthdate: "2025-05-01", ageInMonths: 12, clinicId: "u_b2b_demo", corporatePlan: "Базовый Детский", lastCheckupDate: "2026-04-20" }
 ];
 localStorage.setItem("pediatr_corporate_children", JSON.stringify(defaultCorp));
 return defaultCorp;
 });

 const [doctorsList, setDoctorsList] = useState(() => {
 const saved = readStoredJson<Doctor[] | null>("pediatr_doctors_list", null);
 if (saved) return saved;
 const initialDocs = [
 { id: "dr1", name: "Ковалева Анна Сергеевна", role: "Главный Врач-Педиатр", exp: "15 лет стажа", active: true, slots: ["09:00", "11:00", "14:30", "16:00"] },
 { id: "dr2", name: "Соколов Игорь Петрович", role: "Детский Хирург-Ортопед", exp: "12 лет стажа", active: true, slots: ["10:00", "12:30", "15:00"] },
 { id: "dr3", name: "Васильева Екатерина Дмитриевна", role: "Детский Клинический Невролог", exp: "9 лет стажа", active: true, slots: ["09:30", "11:30", "14:00"] }
 ];
 localStorage.setItem("pediatr_doctors_list", JSON.stringify(initialDocs));
 return initialDocs;
 });

 const [authView, setAuthView] = useState<"login" | "register">("login");
 const [authType, setAuthType] = useState<"private" | "company">("private");
 
 // Forms state
 const [loginEmail, setLoginEmail] = useState("");
 const [loginPassword, setLoginPassword] = useState("");
 const [authError, setAuthError] = useState<string | null>(null);
 const [authSuccess, setAuthSuccess] = useState<string | null>(null);
 const [serverProfileStatus, setServerProfileStatus] = useState<string | null>(null);
 const serverProfileReadSessionRef = useRef<string | null>(null);

 // Reg state - private
 const [regEmail, setRegEmail] = useState("");
 const [regPassword, setRegPassword] = useState("");
 const [regName, setRegName] = useState("");
 const [regPhone, setRegPhone] = useState("");
 const [regChildName, setRegChildName] = useState("");
 const [regChildGender, setRegChildGender] = useState<"boy" | "girl">("boy");
 const [regChildBirthdate, setRegChildBirthdate] = useState("");

 // Reg state - B2B
 const [regCompName, setRegCompName] = useState("");
 const [regCompInn, setRegCompInn] = useState("");
 const [regCompAddress, setRegCompAddress] = useState("");
 const [regCompContact, setRegCompContact] = useState("");
 const [regCompRole, setRegCompRole] = useState<"partner_clinic" | "corporate_customer">("partner_clinic");
 const [regCompPhone, setRegCompPhone] = useState("");

 // B2B Actions forms
 const [newCorpChildName, setNewCorpChildName] = useState("");
 const [newCorpChildGender, setNewCorpChildGender] = useState<"boy" | "girl">("boy");
 const [newCorpChildBirth, setNewCorpChildBirth] = useState("2025-05-15");
 const [newCorpChildPlan, setNewCorpChildPlan] = useState<"Базовый Детский" | "Бизнес Премиум" | "VIP Развитие">("Базовый Детский");

 // Auth methods
 const handleLogin = (e: React.FormEvent) => {
 e.preventDefault();
 setAuthError(null);
 setAuthSuccess(null);

 const user = usersStore.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
 if (!user) {
 setAuthError("Пользователь с таким Email не найден в реестре. Проверьте данные или зарегистрируйтесь.");
 return;
 }
 // Demo mode: the local prototype only checks that a password was entered.
 if (loginPassword.length < 5) {
 setAuthError("Пароль должен содержать не менее 5 символов.");
 return;
 }

 // Success login
 localStorage.setItem("pediatr_auth_session", JSON.stringify(user));
 setCurrentUser(user);
 setAuthSuccess(`С возвращением, ${user.name}!`);
 playChime();

 // If private client, sync profile
 if (user.type === "private" && user.childName) {
 const syncedProfile = {
 name: user.childName,
 gender: user.childGender || "boy",
 birthdate: user.childBirthdate || "2025-01-01"
 };
 setChildProfile(syncedProfile);
 localStorage.setItem("pediatr_child_profile", JSON.stringify(syncedProfile));
 }

 // Reset fields
 setLoginEmail("");
 setLoginPassword("");
 };

 const handleRegister = (e: React.FormEvent) => {
 e.preventDefault();
 setAuthError(null);
 setAuthSuccess(null);

 const emailToUse = authType === "private" ? regEmail : regEmail; // simple
 const exists = usersStore.some(u => u.email.toLowerCase() === emailToUse.toLowerCase());
 if (exists) {
 setAuthError("Пользователь с таким Email уже зарегистрирован.");
 return;
 }

 let newUser: AppUser;

 if (authType === "private") {
 if (!regEmail || !regPassword || !regName || !regChildName || !regChildBirthdate) {
 setAuthError("Пожалуйста, заполните все обязательные поля.");
 return;
 }
 newUser = {
 id: "u_" + Math.random().toString(36).substr(2, 9),
 type: "private",
 email: regEmail,
 name: regName,
 phone: regPhone || "+7 (000) 000-00-00",
 childName: regChildName,
 childGender: regChildGender,
 childBirthdate: regChildBirthdate
 };

 // Set profile as active child profile immediately
 const syncedProfile = {
 name: regChildName,
 gender: regChildGender,
 birthdate: regChildBirthdate
 };
 setChildProfile(syncedProfile);
 localStorage.setItem("pediatr_child_profile", JSON.stringify(syncedProfile));
 } else {
 if (!regEmail || !regPassword || !regCompName || !regCompInn || !regCompContact) {
 setAuthError("Пожалуйста, заполните все реквизиты компании.");
 return;
 }
 newUser = {
 id: "u_" + Math.random().toString(36).substr(2, 9),
 type: "company",
 email: regEmail,
 name: regCompName,
 phone: regCompPhone || "+7 (000) 000-00-00",
 inn: regCompInn,
 address: regCompAddress,
 contactPerson: regCompContact,
 role: regCompRole
 };
 }

 const updatedStore = [...usersStore, newUser];
 setUsersStore(updatedStore);
 localStorage.setItem("pediatr_users_store", JSON.stringify(updatedStore));

 // Sign in automatically
 localStorage.setItem("pediatr_auth_session", JSON.stringify(newUser));
 setCurrentUser(newUser);
 setAuthSuccess(`Регистрация успешно пройдена! Здравствуйте, ${newUser.name}.`);
 playChime();

 // Reset forms
 setRegEmail("");
 setRegPassword("");
 setRegName("");
 setRegPhone("");
 setRegChildName("");
 setRegChildBirthdate("");
 setRegCompName("");
 setRegCompInn("");
 setRegCompAddress("");
 setRegCompContact("");
 setRegCompPhone("");
 };

 const handleLogout = () => {
 localStorage.removeItem("pediatr_auth_session");
 localStorage.removeItem("pediatr_auth_session_token");
 setCurrentUser(null);
 setAuthSuccess(null);
 setAuthError(null);
 playChime();
 };

 const handleDemoSessionLogin = async (demoUser: AppUser, syncedProfile?: ChildProfile) => {
 setAuthError(null);
 setAuthSuccess(null);
 setLoginEmail(demoUser.email);
 setLoginPassword("12345");

 try {
 const response = await fetch("/api/auth/demo-session", {
 method: "POST",
 headers: { "content-type": "application/json" },
 body: JSON.stringify({
 consentAccepted: true,
 consentVersion: "demo-consent-v1",
 user: {
 id: demoUser.id,
 type: demoUser.type,
 email: demoUser.email,
 name: demoUser.name,
 },
 }),
 });

 const session = await response.json();
 if (!response.ok) {
 throw new Error(session.error || "Не удалось создать серверную демо-сессию.");
 }

 localStorage.setItem(
 "pediatr_auth_session_token",
 JSON.stringify({
 sessionId: session.sessionId,
 expiresAt: session.expiresAt,
 auditId: session.auditId,
 consent: session.consent,
 })
 );
 localStorage.setItem("pediatr_auth_session", JSON.stringify(demoUser));
 setCurrentUser(demoUser);

 if (syncedProfile) {
 setChildProfile(syncedProfile);
 localStorage.setItem("pediatr_child_profile", JSON.stringify(syncedProfile));
 serverProfileReadSessionRef.current = session.sessionId;
 void persistChildProfileToServer(syncedProfile);
 }

 setAuthSuccess("Демо-вход выполнен через серверную consent-сессию.");
 addInAppToast("Демо-вход", "Серверная демо-сессия и audit-событие созданы.");
 playChime();
 } catch (error: any) {
 setAuthError(error.message || "Ошибка демо-входа.");
 }
 };

 const persistChildProfileToServer = async (profile: ChildProfile) => {
 const sessionToken = readStoredJson<{
 sessionId?: string;
 expiresAt?: string;
 auditId?: string;
 } | null>("pediatr_auth_session_token", null);

 if (!sessionToken?.sessionId) {
 setServerProfileStatus("Локально. Серверная синхронизация доступна после демо-входа.");
 return;
 }

 setServerProfileStatus("Сохраняем на сервере...");

 try {
 const response = await fetch("/api/child-profile", {
 method: "PUT",
 headers: {
 "content-type": "application/json",
 Authorization: `Bearer ${sessionToken.sessionId}`,
 },
 body: JSON.stringify({
 consentAccepted: true,
 profile,
 }),
 });
 const body = await response.json();

 if (!response.ok) {
 throw new Error(body.error || "Сервер не принял профиль.");
 }

 setServerProfileStatus(`Сервер сохранен. Audit: ${body.storage.auditId}`);
 } catch (error: any) {
 setServerProfileStatus(error.message || "Синхронизация не удалась.");
 }
 };

 const loadChildProfileFromServer = async () => {
 const sessionToken = readStoredJson<{
 sessionId?: string;
 expiresAt?: string;
 auditId?: string;
 } | null>("pediatr_auth_session_token", null);

 if (!sessionToken?.sessionId) return;

 try {
 const response = await fetch("/api/child-profile", {
 method: "GET",
 headers: {
 Authorization: `Bearer ${sessionToken.sessionId}`,
 },
 });
 const body = await response.json();

 if (response.status === 404) {
 setServerProfileStatus("Серверный профиль пока не создан для этой сессии.");
 return;
 }

 if (!response.ok) {
 throw new Error(body.error || "Не удалось загрузить профиль с сервера.");
 }

 const profile = body.profile as ChildProfile;
 setChildProfile(profile);
 localStorage.setItem("pediatr_child_profile", JSON.stringify(profile));
 setGrowthLogs((currentLogs) =>
 currentLogs.length > 0 ? currentLogs : generateDefaultGrowthLogs(profile.birthdate, profile.gender)
 );
 setServerProfileStatus(`Серверный профиль загружен. Audit: ${body.storage.auditId}`);
 } catch (error: any) {
 setServerProfileStatus(error.message || "Серверный профиль недоступен.");
 }
 };

 const handleAddCorporateChild = (e: React.FormEvent) => {
 e.preventDefault();
 if (!newCorpChildName.trim() || !currentUser) return;

 // Calculate age months based on birthdate
 const bDate = new Date(newCorpChildBirth);
 const diff = Math.abs(new Date().getTime() - bDate.getTime());
 const ageInMStr = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.4));

 const newChild: CorporateChild = {
 id: "cc_" + Math.random().toString(36).substr(2, 9),
 name: newCorpChildName,
 gender: newCorpChildGender,
 birthdate: newCorpChildBirth,
 ageInMonths: ageInMStr,
 clinicId: currentUser.id,
 corporatePlan: newCorpChildPlan,
 lastCheckupDate: new Date().toISOString().split("T")[0]
 };

 const updated = [...corporateChildren, newChild];
 setCorporateChildren(updated);
 localStorage.setItem("pediatr_corporate_children", JSON.stringify(updated));

 // Reset Form
 setNewCorpChildName("");
 addInAppToast("🌟 Корпоративный клиент", `Ребенок ${newChild.name} успешно зарегистрирован по плану '${newChild.corporatePlan}'`);
 };

 const handleToggleDocActive = (docId: string) => {
 const updated = doctorsList.map(doc => {
 if (doc.id === docId) {
 return { ...doc, active: !doc.active };
 }
 return doc;
 });
 setDoctorsList(updated);
 localStorage.setItem("pediatr_doctors_list", JSON.stringify(updated));
 addInAppToast("🩺 Расписание врачей", "Статус ведения приёма успешно обновлён корпоративным координатором");
 };

 // Web Audio API custom synthesizer chime
 const playChime = () => {
 try {
 const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
 if (!AudioCtx) return;
 const ctx = new AudioCtx();
 
 const osc1 = ctx.createOscillator();
 const gain1 = ctx.createGain();
 osc1.type = "sine";
 osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 (C-major clinical pitch)
 gain1.gain.setValueAtTime(0.12, ctx.currentTime);
 gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
 osc1.connect(gain1);
 gain1.connect(ctx.destination);
 osc1.start();
 osc1.stop(ctx.currentTime + 0.4);

 const osc2 = ctx.createOscillator();
 const gain2 = ctx.createGain();
 osc2.type = "sine";
 osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
 gain2.gain.setValueAtTime(0, ctx.currentTime);
 gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.1);
 gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
 osc2.connect(gain2);
 gain2.connect(ctx.destination);
 osc2.start(ctx.currentTime + 0.1);
 osc2.stop(ctx.currentTime + 0.6);
 } catch (e) {
 console.error("Audio chime play failed:", e);
 }
 };

 const triggerBrowserNotification = (title: string, body: string) => {
 if (!("Notification" in window)) return;
 if (Notification.permission === "granted") {
 try {
 new Notification(title, { body });
 } catch (err) {
 console.warn("Notification error (probably sandbox iframe limit):", err);
 }
 }
 };

 const addInAppToast = (title: string, message: string, type: "info" | "warning" | "success" = "info") => {
 const id = `toast_${Date.now()}`;
 setToasts(prev => [...prev, { id, title, message, type }]);
 setTimeout(() => {
 setToasts(prev => prev.filter(t => t.id !== id));
 }, 8500);
 };

 const triggerNotifications = (title: string, msg: string) => {
 if (vaccineAudioEnabled) {
 playChime();
 }
 addInAppToast(title, msg, "warning");
 if (vaccineBrowserNotificationsEnabled) {
 triggerBrowserNotification(title, msg);
 }
 };

 const handleToggleBrowserNotifications = () => {
 if (!("Notification" in window)) {
 alert("Ваш браузер или текущий фрейм не поддерживает push-уведомления.");
 return;
 }
 
 if (Notification.permission === "granted") {
 setVaccineBrowserNotificationsEnabled(!vaccineBrowserNotificationsEnabled);
 } else if (Notification.permission === "denied") {
 alert("Доступ к уведомлениям заблокирован в настройках вашего браузера. Пожалуйста, сбросьте настройки блокировки для этого сайта.");
 } else {
 Notification.requestPermission().then((permission) => {
 if (permission === "granted") {
 setVaccineBrowserNotificationsEnabled(true);
 triggerBrowserNotification("📢 Доступ разрешен", "Педагогический календарь прививок готов отправлять уведомления.");
 } else {
 setVaccineBrowserNotificationsEnabled(false);
 alert("Браузерное уведомление отклонено.");
 }
 });
 }
 };

 // Persist vaccine notification configurations to local storage
 useEffect(() => {
 localStorage.setItem("pediatr_vac_audio_enabled", JSON.stringify(vaccineAudioEnabled));
 }, [vaccineAudioEnabled]);

 useEffect(() => {
 localStorage.setItem("pediatr_vac_browser_enabled", JSON.stringify(vaccineBrowserNotificationsEnabled));
 }, [vaccineBrowserNotificationsEnabled]);

 // Save states to local storage
 useEffect(() => {
 localStorage.setItem("pediatr_child_profile", JSON.stringify(childProfile));
 }, [childProfile]);

 useEffect(() => {
 localStorage.setItem("pediatr_completed_vaccines", JSON.stringify(completedVaccines));
 }, [completedVaccines]);

 useEffect(() => {
 localStorage.setItem("pediatr_sickness_logs", JSON.stringify(sicknessLogs));
 }, [sicknessLogs]);

 useEffect(() => {
 localStorage.setItem("pediatr_appointments", JSON.stringify(appointments));
 }, [appointments]);

 useEffect(() => {
 localStorage.setItem("pediatr_growth_logs", JSON.stringify(growthLogs));
 }, [growthLogs]);

 useEffect(() => {
 if (!currentUser) {
 serverProfileReadSessionRef.current = null;
 return;
 }

 const sessionToken = readStoredJson<{ sessionId?: string } | null>("pediatr_auth_session_token", null);
 if (!sessionToken?.sessionId || serverProfileReadSessionRef.current === sessionToken.sessionId) return;

 serverProfileReadSessionRef.current = sessionToken.sessionId;
 void loadChildProfileFromServer();
 }, [currentUser?.id]);

 // Set default growth age and date inside form based on profile
 useEffect(() => {
 if (childProfile) {
 const birth = new Date(childProfile.birthdate);
 setNewGrowthDate(new Date().toISOString().split("T")[0]);
 
 const birthdate = new Date(childProfile.birthdate);
 const diffTime = Math.abs(new Date().getTime() - birthdate.getTime());
 const ageMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375));
 if (ageMonths >= 0 && ageMonths <= 36) {
 setNewGrowthAge(ageMonths);
 } else {
 setNewGrowthAge(12);
 }
 }
 }, [childProfile]);

 const handleAddGrowthRecord = (e: React.FormEvent) => {
 e.preventDefault();
 if (!childProfile) return;

 const weightNum = parseFloat(newGrowthWeight);
 const heightNum = parseFloat(newGrowthHeight);

 if (isNaN(weightNum) || weightNum <= 0 || isNaN(heightNum) || heightNum <= 0) {
 alert("Пожалуйста, введите корректные числовые значения роста (см) и веса (кг).");
 return;
 }

 const existingIndex = growthLogs.findIndex((g) => g.ageInMonths === newGrowthAge);

 const newRecord: GrowthRecord = {
 id: existingIndex !== -1 ? growthLogs[existingIndex].id : `growth_${Date.now()}`,
 date: newGrowthDate || new Date().toISOString().split("T")[0],
 ageInMonths: newGrowthAge,
 weight: weightNum,
 height: heightNum,
 };

 const updatedLogs = [...growthLogs];
 if (existingIndex !== -1) {
 updatedLogs[existingIndex] = newRecord;
 } else {
 updatedLogs.push(newRecord);
 }

 updatedLogs.sort((a, b) => a.ageInMonths - b.ageInMonths);
 setGrowthLogs(updatedLogs);

 setNewGrowthWeight("");
 setNewGrowthHeight("");
 };

 const handleDeleteGrowthRecord = (id: string) => {
 setGrowthLogs(growthLogs.filter((g) => g.id !== id));
 };

 // Scan sickness logs for weight/height and import them
 const scanSicknessLogsForBiometrics = () => {
 const foundRecords: { date: string; weight: number; height: number; notes: string; ageInMonths: number }[] = [];
 if (!childProfile) return foundRecords;

 const birthdate = new Date(childProfile.birthdate);
 sicknessLogs.forEach((log) => {
 const text = `${log.symptoms} ${log.doctorNotes}`;
 const weightMatch = text.match(/(?:вес|вес:)\s*(\d+(?:\.\d+)?)\s*(?:кг)?/i);
 const heightMatch = text.match(/(?:рост|рост:)\s*(\d+(?:\.\d+)?)\s*(?:см)?/i);

 if (weightMatch || heightMatch) {
 const w = weightMatch ? parseFloat(weightMatch[1]) : 0;
 const h = heightMatch ? parseFloat(heightMatch[1]) : 0;

 let validW = w > 1 && w < 40 ? w : 0;
 let validH = h > 35 && h < 140 ? h : 0;

 if (validW > 0 || validH > 0) {
 const logDate = new Date(log.date);
 const diffTime = Math.abs(logDate.getTime() - birthdate.getTime());
 const ageInMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375));

 if (ageInMonths >= 0 && ageInMonths <= 36) {
 foundRecords.push({
 date: log.date,
 weight: validW,
 height: validH,
 ageInMonths,
 notes: `Разбор симптомов ОРВИ за ${log.date}`,
 });
 }
 }
 }
 });
 return foundRecords;
 };

 const handleImportSicknessBiometrics = () => {
 const scanned = scanSicknessLogsForBiometrics();
 if (scanned.length === 0) {
 alert("В текущих записях дневника ОРВИ не обнаружено упоминаний веса в кг или роста в см (например: 'вес 10' или 'рост 75').");
 return;
 }

 let updatedLogs = [...growthLogs];
 let importedCount = 0;

 scanned.forEach((item) => {
 const existingIdx = updatedLogs.findIndex((g) => g.ageInMonths === item.ageInMonths);
 const newRec: GrowthRecord = {
 id: existingIdx !== -1 ? updatedLogs[existingIdx].id : `growth_import_${Date.now()}_${Math.random()}`,
 date: item.date,
 ageInMonths: item.ageInMonths,
 weight: item.weight || (existingIdx !== -1 ? updatedLogs[existingIdx].weight : 0),
 height: item.height || (existingIdx !== -1 ? updatedLogs[existingIdx].height : 0),
 };

 if (newRec.weight > 0 || newRec.height > 0) {
 if (newRec.weight === 0 && existingIdx !== -1) newRec.weight = updatedLogs[existingIdx].weight;
 if (newRec.height === 0 && existingIdx !== -1) newRec.height = updatedLogs[existingIdx].height;
 if (newRec.weight === 0) newRec.weight = getWhoMedianForAge(item.ageInMonths, childProfile?.gender || "boy", "weight");
 if (newRec.height === 0) newRec.height = getWhoMedianForAge(item.ageInMonths, childProfile?.gender || "boy", "height");

 if (existingIdx !== -1) {
 updatedLogs[existingIdx] = newRec;
 } else {
 updatedLogs.push(newRec);
 }
 importedCount++;
 }
 });

 updatedLogs.sort((a, b) => a.ageInMonths - b.ageInMonths);
 setGrowthLogs(updatedLogs);
 alert(`Успешно импортировано и обновлено записей биометрии из дневника здоровья: ${importedCount}`);
 };

 // Scroll to bottom of chat
 useEffect(() => {
 chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
 }, [chatMessages, isChatLoading]);

 // Calculate child's actual age in months
 const childAge = childProfile 
 ? Math.floor(Math.abs(new Date().getTime() - new Date(childProfile.birthdate).getTime()) / (1000 * 60 * 60 * 24 * 30.4375)) 
 : null;

 // Dynamic vaccination reminders system based on age & completed status
 const getVaccineReminders = () => {
 if (!childProfile || childAge === null) return { dueSoon: [], overdue: [], totalUpcoming: 0 };

 const dueSoon: VaccineGuide[] = [];
 const overdue: VaccineGuide[] = [];

 VACCINE_DATABASE.forEach(v => {
 const isCompleted = completedVaccines.includes(v.id);
 if (!isCompleted) {
 // Overdue vaccine: child is older than recommended age plus 1.5 months
 if (childAge > v.ageInMonths + 1.5) {
 overdue.push(v);
 }
 // Due soon (approaching): child is within +/- 1.5 months around the recommended age
 else if (childAge >= v.ageInMonths - 1.5 && childAge <= v.ageInMonths + 1.5) {
 dueSoon.push(v);
 }
 }
 });

 return { dueSoon, overdue, totalUpcoming: dueSoon.length + overdue.length };
 };

 const reminders = getVaccineReminders();

 // Automatic vaccine reminder trigger system based on child profile age & status
 useEffect(() => {
 if (!childProfile || childAge === null) return;
 
 const overdueCount = reminders.overdue.length;
 const dueSoonCount = reminders.dueSoon.length;
 const totalCount = overdueCount + dueSoonCount;
 
 if (totalCount > 0) {
 // Use child name and totalCount as key to avoid repetitive reminders unless things change
 const sessionKey = `pediatr_notified_${childProfile.name}_${totalCount}`;
 const alreadyNotified = sessionStorage.getItem(sessionKey);
 
 if (!alreadyNotified) {
 // Small delay to allow the rendering context to settle and first interaction
 const timer = setTimeout(() => {
 let title = "📢 Календарь прививок";
 let message = `Рекомендуется уделить внимание плановым прививкам (${totalCount} шт.).`;
 
 if (overdueCount > 0) {
 title = "⚠️ Пропущены вакцины!";
 message = `Пропущено: ${overdueCount} прививок у ${childProfile.name}. Пожалуйста, обратитесь к врачу.`;
 } else if (dueSoonCount > 0) {
 title = "⏳ Сроки вакцинации подходят";
 message = `Ближайший месяц: подходит время для ${dueSoonCount} прививок у ${childProfile.name}.`;
 }
 
 triggerNotifications(title, message);
 sessionStorage.setItem(sessionKey, "true");
 }, 1500);
 
 return () => clearTimeout(timer);
 }
 }
 }, [childProfile?.name, completedVaccines.length, childAge]);

 // Handle Child Profile Creation
 const handleSaveProfile = (e: React.FormEvent) => {
 e.preventDefault();
 if (!inputChildName.trim() || !inputChildBirthdate) return;
 const profile = {
 name: inputChildName,
 gender: inputChildGender,
 birthdate: inputChildBirthdate
 };
 setChildProfile(profile);
 // Set age in calculator automatically
 const bDate = new Date(inputChildBirthdate);
 const diffTime = Math.abs(new Date().getTime() - bDate.getTime());
 const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375));
 if (diffMonths >= 0 && diffMonths <= 200) {
 setCalcAgeMonths(diffMonths);
 }
 // Set default growth logs
 setGrowthLogs(generateDefaultGrowthLogs(inputChildBirthdate, inputChildGender));
 void persistChildProfileToServer(profile);
 };

 const handleDeleteProfile = () => {
 if (window.confirm("Вы уверены, что хотите удалить профиль ребенка? Данные будут стерты.")) {
 setChildProfile(null);
 setInputChildName("");
 setInputChildBirthdate("");
 setGrowthLogs([]);
 }
 };

 // Generate high-resolution, pixel-perfect clinical PDF with stamps and tables
 const handleExportPDF = async () => {
 if (!childProfile) return;
 setIsExportingPDF(true);

 try {
 const { jsPDF } = await import("jspdf");
 setTimeout(() => {
 const width = 1200;
 const height = 1600;
 const canvas = document.createElement("canvas");
 canvas.width = width;
 canvas.height = height;
 const ctx = canvas.getContext("2d");

 if (!ctx) {
 setIsExportingPDF(false);
 return;
 }

 // Background
 ctx.fillStyle = "#ffffff";
 ctx.fillRect(0, 0, width, height);

 // Outer borders
 ctx.strokeStyle = "#e2e8f0";
 ctx.lineWidth = 6;
 ctx.strokeRect(20, 20, width - 40, height - 40);

 ctx.strokeStyle = "#10b981"; // elegant clinical emerald green
 ctx.lineWidth = 1.5;
 ctx.strokeRect(28, 28, width - 56, height - 56);

 // Header Rect
 ctx.fillStyle = "#f0fdf4"; // emerald-50
 ctx.fillRect(34, 34, width - 68, 170);
 ctx.strokeStyle = "#bbf7d0";
 ctx.lineWidth = 1;
 ctx.strokeRect(34, 34, width - 68, 170);

 // Hospital/Clinic Emblem
 ctx.strokeStyle = "#10b981";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.arc(80, 115, 25, 0, 2 * Math.PI);
 ctx.stroke();

 ctx.fillStyle = "#10b981";
 ctx.font = "bold 24px sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("❀", 80, 115);

 // Text title
 ctx.textAlign = "left";
 ctx.fillStyle = "#064e3b"; // emerald-900
 ctx.font = "bold 26px sans-serif";
 ctx.fillText("КЛИНИЧЕСКАЯ КАРТА РАЗВИТИЯ РЕБЕНКА", 130, 95);

 ctx.fillStyle = "#1e293b"; // slate-800
 ctx.font = "14px sans-serif";
 ctx.fillText("Частный научно-практический кабинет доказательной педиатрии Ковалевой А. С.", 130, 128);

 ctx.fillStyle = "#64748b"; // slate-500
 ctx.font = "11px sans-serif";
 ctx.fillText(`Evidence-Based Medicine • Документ сформирован: ${new Date().toLocaleDateString('ru-RU')} в ${new Date().toLocaleTimeString('ru-RU')}`, 130, 155);

 // Reset Text alignment
 ctx.textAlign = "left";
 ctx.textBaseline = "alphabetic";

 // Side-by-side Cards Section (Biometrics vs Status)
 // Patient Biometrics Box
 ctx.fillStyle = "#fafaf9"; // stone-50
 ctx.fillRect(50, 235, 520, 240);
 ctx.strokeStyle = "#e7e5e4"; // stone-200
 ctx.lineWidth = 1;
 ctx.strokeRect(50, 235, 520, 240);

 // Left block title
 ctx.fillStyle = "#1c1917";
 ctx.font = "bold 15px sans-serif";
 ctx.fillText("ПАСПОРТНАЯ ЧАСТЬ ПАЦИЕНТА", 70, 275);

 ctx.fillStyle = "#78716c";
 ctx.font = "13px sans-serif";
 ctx.fillText("ФИО Пациента:", 75, 315);
 ctx.fillText("Дата рождения:", 75, 350);
 ctx.fillText("Пол ребенка:", 75, 385);
 ctx.fillText("Фактический возраст:", 75, 420);
 ctx.fillText("Медицинский статус:", 75, 455);

 ctx.fillStyle = "#0c0a09";
 ctx.font = "bold 13px sans-serif";
 ctx.fillText(childProfile.name, 250, 315);
 ctx.fillText(new Date(childProfile.birthdate).toLocaleDateString('ru-RU') + " г.", 250, 350);
 ctx.fillText(childProfile.gender === "boy" ? "Мужской (мальчик) 👶" : "Женский (девочка) 👧", 250, 385);
 ctx.fillText(`${childAge} месяцев`, 250, 420);
 ctx.fillStyle = completedVaccines.length === VACCINE_DATABASE.length ? "#059669" : "#1e40af";
 ctx.fillText(completedVaccines.length === VACCINE_DATABASE.length ? "Полная вакцинация ✓" : "Плановое ведение", 250, 455);

 // Clinic Stats Box
 ctx.fillStyle = "#f8fafc"; // slate-50
 ctx.fillRect(590, 235, 560, 240);
 ctx.strokeStyle = "#e2e8f0"; // slate-200
 ctx.lineWidth = 1;
 ctx.strokeRect(590, 235, 560, 240);

 // Right block title
 ctx.fillStyle = "#0f172a";
 ctx.font = "bold 15px sans-serif";
 ctx.fillText("МЕДИЦИНСКОЕ СОПРОВОЖДЕНИЕ", 610, 275);

 ctx.fillStyle = "#475569";
 ctx.font = "13px sans-serif";
 ctx.fillText("Сделано прививок РФ:", 615, 315);
 ctx.fillText("Регистраций ОРВИ:", 615, 350);
 ctx.fillText("Запланировано визитов:", 615, 385);
 ctx.fillText("Ответственный врач:", 615, 420);
 ctx.fillText("Курация клиники:", 615, 455);

 ctx.fillStyle = "#0f172a";
 ctx.font = "bold 13px sans-serif";
 ctx.fillText(`${completedVaccines.length} из ${VACCINE_DATABASE.length} доз (завершено: ${Math.round((completedVaccines.length / VACCINE_DATABASE.length) * 100)}%)`, 790, 315);
 ctx.fillText(`${sicknessLogs.length} записей в дневнике за период`, 790, 350);
 ctx.fillText(`${appointments.length} предстоящих приёмов`, 790, 385);
 ctx.fillText("д-р Ковалева А. С. (Педиатр-Неонатолог)", 790, 420);
 ctx.fillStyle = "#047857";
 ctx.fillText("Активна (Evidence-Based)", 790, 455);

 // SECTION 1: VACCINE SHIELD
 let yPos = 525;
 ctx.fillStyle = "#1e293b";
 ctx.font = "bold 16px sans-serif";
 ctx.fillText("ЖУРНАЛ СДЕЛАHHЫХ И ПЛАНИРУЕМЫХ ВАКЦИНАЦИЙ (национ. календарь)", 50, yPos);

 // Accent bar
 ctx.fillStyle = "#10b981";
 ctx.fillRect(50, yPos + 10, width - 100, 3);

 yPos += 45;

 // Table Header
 ctx.fillStyle = "#64748b";
 ctx.font = "bold 11px sans-serif";
 ctx.fillText("МЕДИЦИНСКОЕ НАЗНАЧЕНИЕ ВАКЦИНЫ", 70, yPos);
 ctx.fillText("РЕКОМЕНД. СРОК", 400, yPos);
 ctx.fillText("АССОЦИИРОВАННЫЕ ЗАБОЛЕВАНИЯ", 560, yPos);
 ctx.fillText("ФАКТИЧЕСКИЙ СТАТУС", 950, yPos);

 ctx.strokeStyle = "#e2e8f0";
 ctx.lineWidth = 1;
 ctx.beginPath();
 ctx.moveTo(50, yPos + 10);
 ctx.lineTo(width - 50, yPos + 10);
 ctx.stroke();

 yPos += 30;

 // Filter: choose up to 9 primary vaccines to fit neatly
 const shownVaccines = VACCINE_DATABASE.slice(0, 9);
 shownVaccines.forEach((v) => {
 const isDone = completedVaccines.includes(v.id);
 const isOverdue = !isDone && childAge !== null && childAge > v.ageInMonths + 1.5;

 ctx.fillStyle = isDone ? "#0f172a" : "#475569";
 ctx.font = isDone ? "bold 12px sans-serif" : "12px sans-serif";
 ctx.fillText(v.name, 70, yPos);

 ctx.fillStyle = "#475569";
 ctx.font = "12px sans-serif";
 ctx.fillText(v.ageLabel, 400, yPos);

 ctx.fillStyle = "#64748b";
 ctx.font = "11px sans-serif";
 ctx.fillText(v.diseases.length > 50 ? v.diseases.slice(0, 48) + "..." : v.diseases, 560, yPos);

 if (isDone) {
 ctx.fillStyle = "#059669"; // emerald-600
 ctx.font = "bold 11px sans-serif";
 ctx.fillText("✓ СДЕЛАНО (ВНЕСЕНО)", 950, yPos);
 } else if (isOverdue) {
 ctx.fillStyle = "#dc2626"; // red-600
 ctx.font = "bold 11px sans-serif";
 ctx.fillText("⚠️ ПРОПУЩЕНО / СРОЧНО", 950, yPos);
 } else {
 ctx.fillStyle = "#d97706"; // amber-600
 ctx.font = "11px sans-serif";
 ctx.fillText("⏳ РЕКОМЕНДУЕТСЯ СРОК", 950, yPos);
 }

 // Line separator
 ctx.strokeStyle = "#f1f5f9";
 ctx.beginPath();
 ctx.moveTo(50, yPos + 10);
 ctx.lineTo(width - 50, yPos + 10);
 ctx.stroke();

 yPos += 28;
 });

 // SECTION 2: MEDICAL RECORDS SICKNESS
 yPos += 25;
 ctx.fillStyle = "#1e293b";
 ctx.font = "bold 16px sans-serif";
 ctx.fillText("ХРОНОЛОГИЯ НАБЛЮДЕНИЙ ЗА СОСТОЯНИЕМ ЗДОРОВЬЯ (Дневник ОРВИ)", 50, yPos);

 ctx.fillStyle = "#3b82f6"; // beautiful clinical blue accent line
 ctx.fillRect(50, yPos + 10, width - 100, 3);

 yPos += 45;

 if (sicknessLogs.length === 0) {
 ctx.fillStyle = "#64748b";
 ctx.font = "italic 13px sans-serif";
 ctx.fillText("Записей или эпизодов ОРВИ в электронный дневник ребенка не сохраняли. Карта пуста.", 70, yPos);
 yPos += 40;
 } else {
 ctx.fillStyle = "#64748b";
 ctx.font = "bold 11px sans-serif";
 ctx.fillText("ДАТА ЗАПИСИ", 70, yPos);
 ctx.fillText("СИМПТОМЫ & ОПИСАНИЕ СОСТОЯНИЯ ПАЦИЕНТА", 200, yPos);
 ctx.fillText("НАЗНАЧЕННЫЕ РЕКОМЕНДАЦИИ И МЕДИЦИНСКИЙ УХОД", 620, yPos);
 ctx.fillText("СТАТУС КУРСА", 980, yPos);

 ctx.strokeStyle = "#e2e8f0";
 ctx.lineWidth = 1;
 ctx.beginPath();
 ctx.moveTo(50, yPos + 10);
 ctx.lineTo(width - 50, yPos + 10);
 ctx.stroke();

 yPos += 30;

 // Limit to latest 6 entries to keep it robust and not overflow
 const activeSicknessLogs = sicknessLogs.slice(0, 6);
 activeSicknessLogs.forEach((log) => {
 ctx.fillStyle = "#0f172a";
 ctx.font = "bold 11px sans-serif";
 ctx.fillText(log.date, 70, yPos);

 ctx.font = "11px sans-serif";
 const symptomsTruncStr = log.symptoms.length > 60 ? log.symptoms.slice(0, 58) + "..." : log.symptoms;
 ctx.fillText(symptomsTruncStr, 200, yPos);

 ctx.fillStyle = "#475569";
 const notesTruncStr = log.doctorNotes.length > 55 ? log.doctorNotes.slice(0, 53) + "..." : log.doctorNotes;
 ctx.fillText(notesTruncStr, 620, yPos);

 ctx.fillStyle = log.status === "Вылечен" ? "#047857" : "#ea580c";
 ctx.font = "bold 10px sans-serif";
 ctx.fillText(log.status.toUpperCase(), 980, yPos);

 ctx.strokeStyle = "#f1f5f9";
 ctx.beginPath();
 ctx.moveTo(50, yPos + 10);
 ctx.lineTo(width - 50, yPos + 10);
 ctx.stroke();

 yPos += 28;
 });
 }

 // SECTION 3: APPOINTMENTS
 if (appointments.length > 0 && yPos < height - 250) {
 yPos += 15;
 ctx.fillStyle = "#1e293b";
 ctx.font = "bold 15px sans-serif";
 ctx.fillText("ЗАПЛАНИРОВАННЫЕ КОНСУЛЬТАЦИИ И ПРИЕМЫ", 50, yPos);

 ctx.fillStyle = "#8b5cf6"; // purple bar
 ctx.fillRect(50, yPos + 8, width - 100, 2);

 yPos += 35;
 appointments.slice(0, 2).forEach((ap) => {
 ctx.fillStyle = "#0f172a";
 ctx.font = "bold 11px sans-serif";
 ctx.fillText(`${ap.date} в ${ap.time}`, 70, yPos);
 ctx.font = "11px sans-serif";
 ctx.fillText(`Кабинет: ${ap.doctorName} (${ap.doctorRole})`, 200, yPos);
 ctx.fillStyle = "#64748b";
 ctx.fillText(`Цель: ${ap.symptom}`, 670, yPos);

 yPos += 22;
 });
 }

 // SIGNATURE PORTION & STAMP
 const signatureY = height - 120;
 ctx.strokeStyle = "#cbd5e1";
 ctx.lineWidth = 1.2;
 ctx.beginPath();
 ctx.moveTo(50, signatureY - 20);
 ctx.lineTo(width - 50, signatureY - 20);
 ctx.stroke();

 ctx.fillStyle = "#475569";
 ctx.font = "12px sans-serif";
 ctx.fillText("Руководитель медицинского кабинета превентивной педиатрии: ____________________ (д-р Ковалева А. С.)", 70, signatureY + 10);
 ctx.fillText("Законный представитель ребенка (родитель): ___________________________ (ФИО и подпись)", 70, signatureY + 45);

 // CLINICAL STAMP DRAWING
 ctx.save();
 ctx.translate(width - 240, signatureY + 10);
 ctx.rotate(-8 * Math.PI / 180); // 8 degrees tilt counter-clockwise

 ctx.strokeStyle = "rgba(49, 46, 129, 0.72)"; // clinical indigo violet ink
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.arc(0, 0, 62, 0, 2 * Math.PI);
 ctx.stroke();

 ctx.strokeStyle = "rgba(49, 46, 129, 0.5)";
 ctx.lineWidth = 1;
 ctx.beginPath();
 ctx.arc(0, 0, 55, 0, 2 * Math.PI);
 ctx.stroke();

 ctx.fillStyle = "rgba(49, 46, 129, 0.85)";
 ctx.font = "bold 8px sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("ДОКАЗАТЕЛЬНАЯ ПЕДИАТРИЯ", 0, -32);
 ctx.fillText("* МОСКВА *", 0, 42);

 ctx.font = "10px sans-serif";
 ctx.fillText("МЕДИЦИНСКАЯ", 0, -11);
 ctx.font = "bold 11px sans-serif";
 ctx.fillText("КАРТА REB-EBM", 0, 6);
 ctx.font = "9px sans-serif";
 ctx.fillText("Ковалева А.С.", 0, 22);

 ctx.restore();

 // GENERATE PDF
 const imgData = canvas.toDataURL("image/jpeg", 0.96);
 const pdf = new jsPDF("p", "pt", "a4");
 const pdfWidth = 595.28;
 const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

 pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
 pdf.save(`${childProfile.name.replace(/\s+/g, '_')}_медицинская_карта.pdf`);

 setIsExportingPDF(false);
 }, 550);
 } catch (err) {
 console.error("PDF Export error:", err);
 setIsExportingPDF(false);
 alert("Сбой экспорта PDF. Пожалуйста, попробуйте еще раз.");
 }
 };

 const handleToggleVaccine = (id: string) => {
 if (completedVaccines.includes(id)) {
 setCompletedVaccines(completedVaccines.filter(v => v !== id));
 } else {
 setCompletedVaccines([...completedVaccines, id]);
 }
 };

 const handleViewVaccineCalendar = () => {
 setActiveTab("tools");
 setTimeout(() => {
 const el = document.getElementById("vaccine_calendar");
 if (el) {
 el.scrollIntoView({ behavior: "smooth", block: "start" });
 }
 }, 120);
 };

 // Add customized symptom log
 const handleAddSicknessLog = (e: React.FormEvent) => {
 e.preventDefault();
 if (!newSymptomText.trim()) return;
 const newRecord: SicknessRecord = {
 id: "sick_" + Date.now(),
 date: new Date().toISOString().split('T')[0],
 symptoms: newSymptomText,
 doctorNotes: newNotesText.trim() || "Рекомендован покой, мытье рук, теплое питье, проветривание детской. Контроль температуры.",
 status: "Активно"
 };
 setSicknessLogs([newRecord, ...sicknessLogs]);
 setNewSymptomText("");
 setNewNotesText("");
 };

 const handleUpdateRecordStatus = (id: string, newStatus: "Вылечен" | "Активно" | "Наблюдение") => {
 setSicknessLogs(sicknessLogs.map(log => log.id === id ? { ...log, status: newStatus } : log));
 };

 const handleDeleteRecord = (id: string) => {
 setSicknessLogs(sicknessLogs.filter(log => log.id !== id));
 };

 // Handle Simulated booking
 const handleBookAppointment = (e: React.FormEvent) => {
 e.preventDefault();
 const doc = DOCTORS.find(d => d.id === bookDoctorId) || DOCTORS[0];
 const newApp: Appointment = {
 id: "booking_" + Date.now(),
 doctorName: doc.name,
 doctorRole: doc.role,
 date: bookDate,
 time: bookTime,
 symptom: bookSymptom,
 childName: childProfile ? childProfile.name : "Малыш",
 type: bookType,
 status: "Ожидает"
 };

 setAppointments([...appointments, newApp]);
 setBookingSuccessMessage(`Вы успшено записаны к врачу ${doc.name} на ${bookDate} в ${bookTime}! Создан электронный талон.`);
 
 // Auto clear notification after 6 sec
 setTimeout(() => {
 setBookingSuccessMessage(null);
 }, 6000);
 };

 const handleCancelAppointment = (id: string) => {
 setAppointments(appointments.filter(ap => ap.id !== id));
 };

 // Send message to Gemini AI backend pediatrician
 const handleSendMessage = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!chatInput.trim() || isChatLoading) return;

 const userText = chatInput;
 setChatInput("");
 
 // Append user message
 const updatedMessages = [...chatMessages, { role: "user" as const, text: userText }];
 setChatMessages(updatedMessages);
 setIsChatLoading(true);

 try {
 const response = await fetch("/api/chat", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ messages: updatedMessages })
 });

 if (!response.ok) {
 throw new Error("Ошибка связи с сервером.");
 }

 const data = await response.json();
 setChatMessages(prev => [...prev, {
 role: "assistant",
 text: data.reply,
 emergencyTriage: data.emergencyTriage,
 careRoute: data.careRoute,
 }]);
 } catch (err: any) {
 console.error(err);
 setChatMessages(prev => [...prev, { 
 role: "assistant", 
 text: "Ой, возникла неполадка при связи со сервером доктора. Но не волнуйтесь! Запомните важные домашние правила: давайте ребенку пить больше теплой воды, измеряйте температуру каждые несколько часов и не используйте жесткие лекарства без осмотра врача. " 
 }]);
 } finally {
 setIsChatLoading(false);
 }
 };

 // Send pre-built prompt helper
 const handleSendPromptHelper = (text: string) => {
 setChatInput(text);
 };

 // Calculate Growth statistics
 const handleCalculateGrowth = (e: React.FormEvent) => {
 e.preventDefault();
 
 // Calculate BMI
 const heightInMeters = calcHeight / 100;
 const bmi = parseFloat((calcWeight / (heightInMeters * heightInMeters)).toFixed(1));

 // Simple heuristic pediatric percentile checks for Russian / WHO charts
 // Boys are slightly heavier on average. 
 // We calibrate for standard infants (e.g. 12 months should be around 9.5 - 11.5 kg, 75 cm)
 let weightStatus = "В пределах возрастной нормы";
 let heightStatus = "В пределах возрастной нормы";
 let colorClass = "from-emerald-500 to-teal-600";
 let bmiStatus = "Нормальный индекс массы тела";

 const expectedWeight = 3.2 + (calcAgeMonths * 0.6); // simplified linear growth helper
 const expectedHeight = 50 + (calcAgeMonths * 2); // simplified height helper

 // Check weights
 const weightDiffPercent = ((calcWeight - expectedWeight) / expectedWeight) * 100;
 if (weightDiffPercent < -22) {
 weightStatus = "Сниженный вес для данного возраста (дефицит массы)";
 colorClass = "from-amber-500 to-orange-600";
 } else if (weightDiffPercent > 25) {
 weightStatus = "Повышенный вес для данного возраста (избыток массы)";
 colorClass = "from-amber-500 to-red-600";
 }

 // Check heights
 const heightDiffPercent = ((calcHeight - expectedHeight) / expectedHeight) * 100;
 if (heightDiffPercent < -15) {
 heightStatus = "Рост ниже средних возрастных показателей";
 } else if (heightDiffPercent > 15) {
 heightStatus = "Рост выше средних возрастных показателей";
 }

 if (bmi < 14) {
 bmiStatus = "ИМТ снижен. Рекомендуется калорийное сбалансированное питание и консультация педиатра.";
 } else if (bmi > 18.5) {
 bmiStatus = "ИМТ повышен. Обратите внимание на количество сахаров и уровень физической активности малыша.";
 }

 let generalAdvise = "Замечательные показатели! Ваш малыш растет гармонично. Рекомендуется продолжать грудное вскармливание или сбалансированный прикорм, ежедневные прогулки на свежем воздухе не менее 2 часов, ежедневный курс витамина D3 (после консультации по дозировке) и активное моторное развитие через свободное движение на полу без манежей.";
 
 if (weightDiffPercent < -22 || bmi < 14) {
 generalAdvise = "Замечен легкий дефицит массы. Попробуйте увеличить чашевое питание, исключить перекусы сладостями перед основной едой, поддерживать режим сна. Проконсультируйтесь с Анной Сергеевной по коррекции прикорма.";
 } else if (weightDiffPercent > 25 || bmi > 18.5) {
 generalAdvise = "Показатели выше средних. Убедитесь, что ребенок достаточно двигается (не сидит у экранов дольше нормы). Уберите сладкие соки и каши быстрого приготовления, заменяя их питьевой водой, овощами и цельнозерновыми крупами.";
 }

 setCalcResult({
 bmi,
 bmiStatus,
 weightStatus,
 heightStatus,
 generalAdvise,
 colorClass
 });
 };

 // Myths Quiz handlers
 const handleSelectQuizOption = (optId: string) => {
 if (hasSubmittedAnswer) return;
 setSelectedAnswer(optId);
 };

 const handleSubmitQuizAnswer = () => {
 if (!selectedAnswer || hasSubmittedAnswer) return;
 setHasSubmittedAnswer(true);

 const question = MYTH_QUIZ_QUESTIONS[quizIndex];
 const option = question.options.find(o => o.id === selectedAnswer);
 if (option?.isCorrect) {
 setQuizScore(prev => prev + 1);
 }
 };

 const handleNextQuizQuestion = () => {
 setSelectedAnswer(null);
 setHasSubmittedAnswer(false);

 if (quizIndex < MYTH_QUIZ_QUESTIONS.length - 1) {
 setQuizIndex(prev => prev + 1);
 } else {
 setQuizCompleted(true);
 }
 };

 const handleRestartQuiz = () => {
 setQuizIndex(0);
 setSelectedAnswer(null);
 setHasSubmittedAnswer(false);
 setQuizScore(0);
 setQuizCompleted(false);
 };

 return (
 <div className="min-h-screen bg-[#FDFBF7] text-slate-800 dark:text-slate-200 font-sans antialiased flex flex-col selection:bg-amber-100 selection:text-amber-900" id="main_container">
 
 {/* Floating Smart Vaccine Notification Toasts */}
 <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
 <AnimatePresence>
 {toasts.map((toast) => (
 <motion.div
 key={toast.id}
 initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
 animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
 exit={{ opacity: 0, scale: 0.9, x: 50, transition: { duration: 0.2 } }}
 className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3 pointer-events-auto cursor-default relative overflow-hidden"
 >
 {/* Decorative accent strip */}
 <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
 
 <div className="shrink-0 mt-0.5 bg-rose-500/10 p-1.5 rounded-xl border border-rose-500/20">
 <Bell className="w-4 h-4 text-rose-400 animate-pulse" />
 </div>

 <div className="space-y-1 pr-6 flex-1">
 <div className="flex items-center gap-1.5">
 <span className="text-[9px] bg-rose-950 text-rose-300 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">Уведомление</span>
 <span className="text-[9px] text-slate-500 dark:text-slate-500">EBM</span>
 </div>
 <h4 className="text-xs font-black text-white leading-tight font-display">{toast.title}</h4>
 <p className="text-[11px] text-slate-300 leading-normal">{toast.message}</p>
 </div>

 <button
 type="button"
 onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
 className="absolute right-2 top-2 p-1 rounded-lg hover:bg-slate-800 text-slate-500 dark:text-slate-500 hover:text-white transition-all cursor-pointer"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 
 {/* EXTREME URGENT CARD (Proof of High-End UX & Evidence Medicine Safety First) */}
 {showUrgentBanner && (
 <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs sm:text-sm py-2 px-4 shadow-md flex justify-between items-center z-50 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg hover:from-red-600 hover:to-rose-750" id="urgent_banner">
 <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
 <div className="flex items-center gap-2">
 <span className="bg-white dark:bg-slate-900/20 p-1 rounded-full animate-pulse">
 <AlertCircle className="w-4 h-4 text-white" />
 </span>
 <p className="font-medium">
 <strong className="font-bold">SOS:</strong> судороги, тяжело дышит, синеют губы, не просыпается или фиолетовая сыпь — звоните <span className="underline font-bold bg-white dark:bg-slate-900/10 px-1.5 py-0.5 rounded">103</span> или <span className="underline font-bold bg-white dark:bg-slate-900/10 px-1.5 py-0.5 rounded">112</span>.
 </p>
 </div>
 <button 
 onClick={() => setShowUrgentBanner(false)} 
 className="min-h-11 min-w-11 hover:bg-white dark:bg-slate-900/20 p-2.5 rounded-full transition-colors cursor-pointer flex items-center justify-center"
 title="Скрыть предупреждение"
 id="close_urgent_banner"
 >
 <X className="w-4 h-4" />
 </button>
 </div>
 </div>
 )}

 {/* TOP CRAFTED NAV BAR */}
 <header className="sticky top-0 bg-white dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-emerald-50/50 z-40 transition-all" id="app_header">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
 
 {/* Logo & Physician Brand */}
 <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")} id="brand_logo">
 <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-100/50">
 <Stethoscope className="w-6 h-6 animate-wiggle" />
 </div>
 <div>
 <h1 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
 Заботливый Педиатр <span className="text-emerald-500">❀</span>
 </h1>
 <span className="text-xs text-slate-500 dark:text-slate-500 font-medium tracking-wide block">Доказательная медицина для детей</span>
 </div>
 </div>

 {/* Navigation Links */}
 <nav className="flex flex-wrap items-center justify-center max-w-full gap-1 bg-slate-100 dark:bg-slate-800/70 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50" id="main_navigation">
 <button 
 onClick={() => setActiveTab("home")} 
 className={`min-h-11 px-2.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer lg:px-3.5 lg:text-sm ${activeTab === "home" ? "bg-white dark:bg-slate-900 text-emerald-700 shadow-sm font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"}`}
 id="nav_home"
 >
 Врач
 </button>
 <button 
 onClick={() => setActiveTab("ai-chat")} 
 className={`min-h-11 px-2.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 lg:px-3.5 lg:text-sm ${activeTab === "ai-chat" ? "bg-white dark:bg-slate-900 text-emerald-700 shadow-sm font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"}`}
 id="nav_ai"
 >
 <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
 ИИ
 </button>
 <button 
 onClick={() => setActiveTab("tools")} 
 className={`min-h-11 px-2.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 lg:px-3.5 lg:text-sm ${activeTab === "tools" ? "bg-white dark:bg-slate-900 text-emerald-700 shadow-sm font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"}`}
 id="nav_tools"
 >
 <Calculator className="w-3.5 h-3.5 text-teal-500" />
 Расчеты
 </button>
 <button 
 onClick={() => setActiveTab("quiz")} 
 className={`min-h-11 px-2.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 lg:px-3.5 lg:text-sm ${activeTab === "quiz" ? "bg-white dark:bg-slate-900 text-emerald-700 shadow-sm font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"}`}
 id="nav_quiz"
 >
 <Trophy className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
 ОРВИ
 </button>
 <button 
 onClick={() => setActiveTab("cabinet")} 
 className={`min-h-11 px-2.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 lg:px-3.5 lg:text-sm ${activeTab === "cabinet" ? "bg-white dark:bg-slate-900 text-emerald-700 shadow-sm font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"}`}
 id="nav_cabinet"
 >
 <User className="w-3.5 h-3.5 text-indigo-500" />
 Карта
 {appointments.length > 0 && (
 <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
 )}
 {reminders.totalUpcoming > 0 && (
 <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black ml-1 scale-90 animate-pulse">
 {reminders.totalUpcoming}
 </span>
 )}
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
 </div>
 </header>

 {/* WORKSPACE & BODY */}
 <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main_content_area">
 
 {/* TAB 1: HOME PAGE / BACKSTORY / EVIDENCE MEDICINE (warm, illustrations, medical honesty) */}
 {activeTab === "home" && (
 <div className="space-y-12" id="tab_home_view">
 
 {/* TASK-FIRST CARE COCKPIT */}
 <section className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f7fbf8] p-5 sm:p-8 lg:p-10" id="care_cockpit_hero">
 <div className="grid gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)] md:items-start lg:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
 <div className="flex flex-col gap-5">
 <div className="space-y-5">
 <span className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
 <ShieldAlert className="h-4 w-4" /> Безопасная маршрутизация перед советом
 </span>
 <div className="space-y-3">
 <h2 className="max-w-3xl text-3xl font-black leading-[1.12] tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
 Сначала определим уровень помощи.
 </h2>
 <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
 Потом покажем следующий шаг: экстренно, сегодня к педиатру или планово. ИИ готовит вопросы и не заменяет врача.
 </p>
 </div>
 </div>

 <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3" aria-label="Уровни помощи">
 <button
 type="button"
 onClick={() => {
 setActiveTab("ai-chat");
 setChatInput("У ребенка судороги, тяжело дышит или губы синеют. Что делать?");
 }}
 className="group min-h-[96px] rounded-lg border border-red-200 bg-white dark:bg-slate-900 p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md lg:min-h-[132px] lg:p-4"
 >
 <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-700 lg:mb-3 lg:h-9 lg:w-9">
 <PhoneCall className="h-5 w-5" />
 </span>
 <span className="block text-sm font-black text-red-900">Экстренно</span>
 <span className="mt-1 block text-xs leading-5 text-slate-600 dark:text-slate-400 md:hidden lg:block">Судороги, дыхание, синие губы, не просыпается. Не ждать чат.</span>
 </button>
 <button
 type="button"
 onClick={() => {
 setActiveTab("ai-chat");
 setChatInput("Ребенку 4 года, температура 38.6 и появилась непонятная сыпь на теле");
 }}
 className="group min-h-[96px] rounded-lg border border-amber-200 bg-white dark:bg-slate-900 p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md lg:min-h-[132px] lg:p-4"
 >
 <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-700 lg:mb-3 lg:h-9 lg:w-9">
 <Clock className="h-5 w-5" />
 </span>
 <span className="block text-sm font-black text-amber-900">Сегодня к педиатру</span>
 <span className="mt-1 block text-xs leading-5 text-slate-600 dark:text-slate-400 md:hidden lg:block">Младенец с температурой, сыпь, рвота/диарея, ухудшение.</span>
 </button>
 <button
 type="button"
 onClick={() => setActiveTab("tools")}
 className="group min-h-[96px] rounded-lg border border-sky-200 bg-white dark:bg-slate-900 p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md lg:min-h-[132px] lg:p-4"
 >
 <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 text-sky-700 lg:mb-3 lg:h-9 lg:w-9">
 <Calendar className="h-5 w-5" />
 </span>
 <span className="block text-sm font-black text-sky-950">Планово</span>
 <span className="mt-1 block text-xs leading-5 text-slate-600 dark:text-slate-400 md:hidden lg:block">Рост, прививки, дневник ОРВИ, вопросы перед приемом.</span>
 </button>
 </div>

 <div className="flex flex-col gap-3 border-t border-slate-200 dark:border-slate-700 pt-5 sm:flex-row sm:items-center">
 <button
 onClick={() => setActiveTab("ai-chat")}
 className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800"
 id="hero_btn_ai"
 >
 Какой следующий шаг <ArrowRight className="h-4 w-4" />
 </button>
 <button
 onClick={() => setActiveTab("cabinet")}
 className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-black text-slate-800 dark:text-slate-200 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-800"
 id="hero_btn_cabinet"
 >
 Открыть карту ребенка <FileText className="h-4 w-4 text-emerald-600" />
 </button>
 </div>
 </div>

 <div className="grid content-start gap-3" id="hero_avatar_section">
 <div className="relative h-[260px] overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 lg:h-[320px]">
 <img
 src="/src/assets/images/pediatrician_cabinet_1779444025164.png"
 alt="Педиатрический кабинет и подготовка к консультации"
 className="h-full w-full object-cover"
 referrerPolicy="no-referrer"
 />
 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/82 via-slate-950/35 to-transparent p-4 text-white">
 <div className="max-w-sm space-y-2">
 <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-900/12 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em]">
 <Lock className="h-3 w-3" /> demo-safe режим
 </span>
 <p className="text-sm font-bold leading-5">Перед консультацией соберите возраст, вес, температуру, динамику симптомов и фото/видео, если это уместно.</p>
 </div>
 </div>
 </div>

 <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
 <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
 <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">ИИ</span>
 <span className="mt-1 block text-sm font-black text-slate-900 dark:text-slate-100">Только подготовка</span>
 </div>
 <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
 <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Врач</span>
 <span className="mt-1 block text-sm font-black text-slate-900 dark:text-slate-100">Финальное решение</span>
 </div>
 <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
 <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Данные</span>
 <span className="mt-1 block text-sm font-black text-slate-900 dark:text-slate-100">Без реальных PHI в demo</span>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* BEAUTIFUL COMPLEMENTARY HERO ILLUSTRATION BANNER */}
 <div className="relative rounded-3xl overflow-hidden border border-emerald-100 shadow-xs h-40 sm:h-56 lg:h-72 w-full animate-fade-in" id="promo_illustration_banner">
 <img 
 src="/src/assets/images/pediatrician_hero_banner_1779444005958.png" 
 alt="Бережная педиатрия доказательной медицины" 
 className="w-full h-full object-cover"
 referrerPolicy="no-referrer"
 />
 <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-transparent flex items-end p-6">
 <p className="text-white text-xs sm:text-xs font-bold bg-emerald-600 dark:bg-emerald-700/90 backdrop-blur-xs px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-xs">
 Индивидуальный подход к каждому ребенку ❀
 </p>
 </div>
 </div>

 {/* INTERACTIVE CHILD CARD QUICK WIDGET (Direct Proof of Personalization) */}
 <section className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6" id="quick_profile_dashboard">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
 <div className="space-y-1">
 <h3 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
 <Baby className="w-5 h-5 text-indigo-500" />
 Личная медицинская карта Вашего малыша
 </h3>
 <p className="text-sm text-slate-500 dark:text-slate-500">Заполните профиль ребенка, чтобы персонализировать календари прививок и другие калькуляторы!</p>
 </div>
 {childProfile && (
 <button 
 onClick={handleDeleteProfile}
 className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
 id="btn_delete_profile"
 >
 <Trash2 className="w-3.5 h-3.5" /> Удалить данные
 </button>
 )}
 </div>

 {!childProfile ? (
 <form onSubmit={handleSaveProfile} className="bg-amber-50/45 p-4 sm:p-6 rounded-2xl border border-amber-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end" id="form_create_profile">
 <div className="space-y-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Имя малыша</label>
 <input 
 type="text" 
 placeholder="Маша, Даня..." 
 value={inputChildName}
 onChange={(e) => setInputChildName(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium" 
 required
 />
 </div>
 <div className="space-y-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Пол ребенка</label>
 <div className="grid grid-cols-2 gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
 <button 
 type="button" 
 onClick={() => setInputChildGender("boy")}
 className={`min-h-11 rounded-lg px-2 py-2 text-center text-xs font-bold transition-all cursor-pointer ${inputChildGender === "boy" ? "bg-indigo-500 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800"}`}
 >
 Мальчик
 </button>
 <button 
 type="button" 
 onClick={() => setInputChildGender("girl")}
 className={`min-h-11 rounded-lg px-2 py-2 text-center text-xs font-bold transition-all cursor-pointer ${inputChildGender === "girl" ? "bg-pink-400 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800"}`}
 >
 Девочка
 </button>
 </div>
 </div>
 <div className="space-y-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Дата рождения</label>
 <input 
 type="date" 
 value={inputChildBirthdate}
 onChange={(e) => setInputChildBirthdate(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium" 
 required
 />
 </div>
 <div>
 <button 
 type="submit"
 className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/10 cursor-pointer text-center"
 >
 Создать медкарту
 </button>
 </div>
 {serverProfileStatus && (
 <div className="md:col-span-4 text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/70 border border-amber-100 rounded-xl px-3 py-2">
 {serverProfileStatus}
 </div>
 )}
 </form>
 ) : (
 <div className="bg-emerald-50 dark:bg-emerald-900/20/50 p-6 rounded-2xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6" id="profile_details_widget">
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 flex items-center justify-center text-4xl shadow-xs">
 {childProfile.gender === "boy" ? "👶" : "👧"}
 </div>
 <div>
 <h4 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">{childProfile.name}</h4>
 <p className="text-xs font-medium text-slate-500 dark:text-slate-500 flex items-center gap-2">
 <span>Пол: {childProfile.gender === "boy" ? "мальчик" : "девочка"}</span>
 <span>•</span>
 <span>Родился/родилась: {new Date(childProfile.birthdate).toLocaleDateString()}</span>
 </p>
 
 {/* Age calculation */}
 <span className="inline-block mt-2 px-2.5 py-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 rounded-md">
 Возраст: {Math.floor(Math.abs(new Date().getTime() - new Date(childProfile.birthdate).getTime()) / (1000 * 60 * 60 * 24 * 30.4375))} месяцев
 </span>
 {serverProfileStatus && (
 <p className="mt-2 text-[11px] font-semibold text-emerald-900 bg-white dark:bg-slate-900/70 border border-emerald-100 rounded-xl px-3 py-2">
 {serverProfileStatus}
 </p>
 )}
 </div>
 </div>

 {/* Quick tracker status */}
 <div className="flex flex-wrap gap-3">
 <button 
 onClick={() => setActiveTab("cabinet")}
 className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-emerald-700 border border-slate-200 dark:border-slate-700 flex items-center gap-2 hover:-translate-y-0.5 transition-all cursor-pointer"
 >
 <FileText className="w-4 h-4 text-emerald-500" /> Вести дневник ОРВИ ({sicknessLogs.length})
 </button>
 <button 
 onClick={() => setActiveTab("tools")}
 className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-550 hover:bg-indigo-650 text-white flex items-center gap-2 shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
 >
 <Activity className="w-4 h-4" /> Календарь Прививок ({completedVaccines.length} сделано)
 </button>
 <button 
 onClick={handleExportPDF}
 disabled={isExportingPDF}
 className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
 >
 {isExportingPDF ? (
 <>
 <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
 Генерация...
 </>
 ) : (
 <>
 <Download className="w-4 h-4" /> Скачать карту PDF
 </>
 )}
 </button>
 </div>
 </div>
 )}
 </section>

 {/* THREE CORNERSTONES OF EVIDENCE-BASED MEDICINE */}
 <section className="space-y-6" id="three_cornerstones">
 <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 text-center">Почему наша педиатрия — особенная?</h3>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 
 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4 hover:shadow-md transition-all">
 <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
 <CheckCircle2 className="w-6 h-6" />
 </div>
 <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Бережность и здравый смысл</h4>
 <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
 90% ОРВИ требуют только времени, увлажнения носа и любви. Мы не прописываем бесполезные горчичники, иммуностимуляторы для галочки или сиропы от кашля, опасные для детей до 4-х лет.
 </p>
 </div>

 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4 hover:shadow-md transition-all">
 <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
 <Activity className="w-6 h-6" />
 </div>
 <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Доказанная безопасность</h4>
 <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
 Мы опираемся только на современные международные мета-анализы и рекомендации (Союз Педиатров России, ВОЗ, UpToDate). Антибиотики назначаются исключительно по строгим показаниям и после анализа крови.
 </p>
 </div>

 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4 hover:shadow-md transition-all">
 <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
 <Sparkles className="w-6 h-6 text-amber-500" />
 </div>
 <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Психологический комфорт</h4>
 <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
 Прием должен проходить без слез! Анна Сергеевна находит подход к любому непоседе при помощи игр, стетоскопа с веселой подсветкой и ласковых вопросов.
 </p>
 </div>

 </div>
 </section>

 {/* CLINIC LOCATION & FEEDBACKS */}
 <section className="bg-[#FAF8F3] border border-amber-100/40 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8" id="clinic_footer_info">
 <div className="space-y-6">
 <h3 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">Бережные очные осмотры в Москве</h3>
 <p className="text-sm text-slate-600 dark:text-slate-400">
 Если вашему ребенку требуется плановый осмотр, измерение параметров роста, аускультация легких или составление индивидуального календаря прививок, вы всегда можете записаться в нашу клинику доказательной медицины &quot;Малыш и Мама&quot;!
 </p>
 
 <div className="space-y-3">
 <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
 <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
 <span>г. Москва, ул. Ленинский проспект, д. 45, корпус 2</span>
 </div>
 <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
 <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
 <span>+7 (495) 777-66-55 (Регистратура)</span>
 </div>
 <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
 <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
 <span>Ежедневно с 8:30 до 20:00</span>
 </div>
 </div>

 <div className="bg-amber-100/50 p-4 rounded-2xl border border-amber-200/50 flex items-start gap-3">
 <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
 <p className="text-xs text-amber-800">
 Доктор Ковалева также проводит <strong className="font-bold">онлайн-телеконсультации</strong> для родителей из любых регионов — по вопросам ухода, грудного вскармливания, расшифровки анализов крови/мочи и корректировки календаря пропущенных вакцинаций.
 </p>
 </div>
 </div>

 {/* BEAUTIFUL CLINIC CABINET COVER */}
 <div className="relative rounded-2xl overflow-hidden border border-amber-100 shadow-xs h-64 lg:h-auto min-h-[220px]">
 <img 
 src="/src/assets/images/pediatrician_cabinet_1779444025164.png" 
 alt="Детский кабинет доказательной педиатрии" 
 className="w-full h-full object-cover"
 referrerPolicy="no-referrer"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
 <span className="text-[10px] text-white font-black bg-emerald-650 px-2.5 py-1 rounded tracking-widest uppercase">КАБИНЕТ ПРИЕМА</span>
 </div>
 </div>

 {/* Patient Feedbacks carousel-like section */}
 <div className="space-y-4">
 <h4 className="text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Отзывы благодарных родителей</h4>
 
 <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 space-y-2">
 <p className="text-xs text-slate-600 dark:text-slate-400 italic">
 &quot;Пример сценария: родитель фиксирует симптомы, температуру и вопросы перед визитом. Врач видит хронологию и быстрее понимает, что произошло за последние сутки.&quot;
 </p>
 <span className="block text-xs font-bold text-slate-900 dark:text-slate-100 text-right">— демонстрационный сценарий карты ребенка</span>
 </div>

 <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 space-y-2">
 <p className="text-xs text-slate-600 dark:text-slate-400 italic">
 &quot;Пример сценария: календарь прививок подсвечивает пропущенные и ближайшие позиции, но финальное решение остается за врачом после очной или телемедицинской консультации.&quot;
 </p>
 <span className="block text-xs font-bold text-slate-900 dark:text-slate-100 text-right">— демонстрационный сценарий вакцинации</span>
 </div>
 </div>
 </section>

 </div>
 )}

 {/* TAB 2: AI CONSULTING DOC CHAT (highly persistent backend prompt) */}
 {activeTab === "ai-chat" && (
 <div className="space-y-6" id="tab_ai_chat_view">
 
 <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col md:flex-row min-h-[550px]" id="chat_box_container">
 
 {/* Left sidebar: Guidelines and warm recommendations */}
 <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50/50 p-6 flex flex-col justify-between gap-6" id="chat_sidebar_info">
 <div className="space-y-6">
 <div className="space-y-1">
 <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase">Интерактивный ИИ</span>
 <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
 Чат с педиатром <Sparkles className="w-4 h-4 text-amber-500" />
 </h3>
 <p className="text-xs text-slate-500 dark:text-slate-500">
 Умная нейросетевая модель с осторожными подсказками на принципах доказательной медицины.
 </p>
 </div>

 {/* Transparent Copywriting: AI Limits & Free Status */}
 <motion.div 
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-3 text-xs text-amber-900 shadow-sm"
 >
 <div className="flex items-center justify-between">
 <p className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-800">
 <ShieldAlert className="w-4 h-4 text-amber-600" /> Границы ИИ
 </p>
 <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Бесплатно</span>
 </div>
 <p className="leading-relaxed font-medium opacity-90 text-[11px]">
 Нейросеть не выписывает рецепты и не ставит диагнозы. Она обучена на медицинских протоколах (2026), чтобы помочь вам отделить мифы от фактов и успокоиться. <strong className="font-bold text-amber-950">Это не заменяет живого врача.</strong>
 </p>
 </motion.div>

 <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4" id="structured_intake_rail">
 <div>
 <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Перед отправкой</span>
 <h4 className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">Мини-intake для педиатра</h4>
 </div>

 <div className="grid gap-2">
 <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
 <div className="flex items-start gap-2">
 <Baby className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
 <div>
 <p className="text-xs font-black text-slate-900 dark:text-slate-100">Возраст и вес</p>
 <p className="text-[11px] leading-4 text-slate-500 dark:text-slate-500 md:hidden xl:block">Месяцы/годы, примерный вес, хронические состояния.</p>
 </div>
 </div>
 </div>
 <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
 <div className="flex items-start gap-2">
 <Activity className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
 <div>
 <p className="text-xs font-black text-slate-900 dark:text-slate-100">Температура и динамика</p>
 <p className="text-[11px] leading-4 text-slate-500 dark:text-slate-500 md:hidden xl:block">Сколько градусов, как измеряли, сколько часов длится.</p>
 </div>
 </div>
 </div>
 <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
 <div className="flex items-start gap-2">
 <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
 <div>
 <p className="text-xs font-black text-slate-900 dark:text-slate-100">Фото/видео симптома</p>
 <p className="text-[11px] leading-4 text-slate-500 dark:text-slate-500 md:hidden xl:block">Сыпь, дыхание, ухо, горло — если это безопасно и уместно.</p>
 </div>
 </div>
 </div>
 <div className="rounded-lg border border-red-100 bg-red-50 p-3">
 <div className="flex items-start gap-2">
 <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
 <div>
 <p className="text-xs font-black text-red-950">Когда не ждать ответ</p>
 <p className="text-[11px] leading-4 text-red-800 md:hidden xl:block">Дыхание, судороги, синие губы, не просыпается, фиолетовая сыпь.</p>
 </div>
 </div>
 </div>
 </div>

 <div className="grid gap-2 pt-1">
 <button
 onClick={() => handleSendPromptHelper("Ребенку 8 недель, температура 38.2, что делать?")}
 className="flex min-h-11 items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs font-bold text-amber-950 transition-all hover:border-amber-300 hover:bg-amber-100"
 >
 <span>Температура у младенца</span>
 <ChevronRight className="h-4 w-4" />
 </button>
 <button
 onClick={() => handleSendPromptHelper("Ребенку 4 года, температура 38.6 и появилась непонятная сыпь на теле")}
 className="flex min-h-11 items-center justify-between rounded-lg border border-amber-200 bg-white dark:bg-slate-900 px-3 py-2 text-left text-xs font-bold text-slate-800 dark:text-slate-200 transition-all hover:border-amber-300 hover:bg-amber-50"
 >
 <span>Температура + сыпь</span>
 <ChevronRight className="h-4 w-4" />
 </button>
 <button
 onClick={() => handleSendPromptHelper("У ребенка температура 38.5, насморк. Что делать на первом этапе ОРВИ?")}
 className="flex min-h-11 items-center justify-between rounded-lg border border-emerald-200 bg-white dark:bg-slate-900 px-3 py-2 text-left text-xs font-bold text-slate-800 dark:text-slate-200 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:bg-emerald-900/20"
 >
 <span>ОРВИ без красных флагов</span>
 <ChevronRight className="h-4 w-4" />
 </button>
 <button
 onClick={() => handleSendPromptHelper("Прививки в 3 месяца: какие делать и как подготовиться?")}
 className="flex min-h-11 items-center justify-between rounded-lg border border-sky-200 bg-white dark:bg-slate-900 px-3 py-2 text-left text-xs font-bold text-slate-800 dark:text-slate-200 transition-all hover:border-sky-300 hover:bg-sky-50"
 >
 <span>Подготовка к прививкам</span>
 <ChevronRight className="h-4 w-4" />
 </button>
 </div>
 </div>
 </div>

 <div className="text-center p-3 border-t border-slate-100 dark:border-slate-800/80">
 <span className="text-[10px] block text-slate-400">Врач-педиатр Д-р Ковалева А. С.</span>
 <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Официальный веб-ассистент</span>
 </div>
 </div>

 {/* Right side: Real Chat Window */}
 <div className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 h-[560px]" id="chat_messages_panel">
 
 {/* Chat window top header */}
 <div className="px-6 py-4 border-b border-rose-50/50 bg-[#FDFBF7]/85 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-lg shadow-inner">
 👩‍⚕️
 </div>
 <div>
 <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Анна Сергеевна (ИИ-Ассистент)</h4>
 <span className="text-[10px] text-emerald-600 block flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" /> В сети
 </span>
 </div>
 </div>
 <button 
 onClick={() => {
 if (window.confirm("Очистить переписку?")) {
 setChatMessages([
 { role: "assistant", text: "Здравствуйте! Я ИИ-помощник доктора Анны Сергеевны. Расскажите, сколько месяцев вашему малышу и что вас беспокоит? Я помогу разобраться на принципах доказательной медицины." }
 ]);
 }
 }}
 className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-400 underline cursor-pointer"
 >
 Очистить диалог
 </button>
 </div>

 {/* Messages Box Stream */}
 <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-800/50/20" id="chat_scroll_area">
 {chatMessages.map((m, idx) => (
 <div 
 key={idx} 
 className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
 >
 <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
 m.role === "user" 
 ? "bg-emerald-600 dark:bg-emerald-700 text-white rounded-tr-none" 
 : m.emergencyTriage
 ? "bg-red-50 border border-red-200 text-red-950 rounded-tl-none"
 : m.careRoute?.level === "urgent_same_day"
 ? "bg-amber-50 border border-amber-200 text-amber-950 rounded-tl-none"
 : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
 }`}>
 
 {/* Avatar identifier inside chat */}
 <div className="flex items-center gap-1.5 mb-1 text-[10px] opacity-80 font-bold uppercase tracking-wider">
 <span>{m.role === "user" ? "Родитель" : m.emergencyTriage ? "Экстренная маршрутизация" : m.careRoute?.level === "urgent_same_day" ? "Срочная связь с педиатром" : "Педиатр Анна Сергеевна"}</span>
 </div>

 {/* Text */}
 <p className="whitespace-pre-wrap">{m.text}</p>
 </div>
 </div>
 ))}

 {/* Loader stream */}
 {isChatLoading && (
 <div className="flex justify-start">
 <motion.div 
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[85%] space-y-2"
 >
 <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
 <span>Анна Сергеевна печатает...</span>
 </div>
 <div className="flex gap-1.5 items-center py-2 px-1">
 <motion.span 
 animate={{ y: [0, -5, 0] }}
 transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0 }}
 className="w-2 h-2 rounded-full bg-emerald-400" 
 />
 <motion.span 
 animate={{ y: [0, -5, 0] }}
 transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.2 }}
 className="w-2 h-2 rounded-full bg-emerald-500" 
 />
 <motion.span 
 animate={{ y: [0, -5, 0] }}
 transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.4 }}
 className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-700" 
 />
 </div>
 </motion.div>
 </div>
 )}

 <div ref={chatEndRef} />
 </div>

 {/* Chat Form */}
 <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-[#FDFBF8] flex gap-2 items-center" id="chat_submit_form">
 <input 
 type="text" 
 value={chatInput}
 onChange={(e) => setChatInput(e.target.value)}
 placeholder="Например: Покраснение кожи у младенца 6 месяцев, не чешется..."
 className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 dark:text-slate-200" 
 disabled={isChatLoading}
 id="chat_input_field"
 />
 <button 
 type="submit"
 disabled={!chatInput.trim() || isChatLoading}
 className="px-5 py-3 rounded-xl bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm transition-all focus:ring-2 focus:ring-emerald-400 cursor-pointer flex items-center gap-1 shrink-0"
 id="btn_chat_send"
 >
 <span>Отправить</span>
 <ChevronRight className="w-4 h-4" />
 </button>
 </form>

 </div>

 </div>

 </div>
 )}

 {/* TAB 3: Growth calculator & Vaccination Calendar index cards (dynamic logic) */}
 {activeTab === "tools" && (
 <div className="space-y-12" id="tab_tools_view">
 
 {/* SUB-SECTION 1: Dynamic Child growth calculator */}
 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="growth_calculator">
 <div className="border-b border-emerald-50 pb-4">
 <h3 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
 <Calculator className="w-6 h-6 text-emerald-600 animate-pulse" />
 Интеллектуальный калькулятор физического развития (по нормам ВОЗ)
 </h3>
 <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
 Оцените соотношение роста, веса и индекса массы тела (ИМТ) вашего ребенка. Данный алгоритм анализирует стандартные центильные таблицы доказательной педиатрии.
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 
 {/* Calculator parameters Form */}
 <form onSubmit={handleCalculateGrowth} className="space-y-4 bg-slate-50 dark:bg-slate-800/50/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800" id="calc_inner_form">
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Пол ребенка</label>
 <div className="grid grid-cols-2 gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
 <button 
 type="button" 
 onClick={() => setCalcGender("boy")}
 className={`py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer transition-all ${calcGender === "boy" ? "bg-indigo-500 text-white" : "text-slate-600 dark:text-slate-400"}`}
 >
 👦 Мальчик
 </button>
 <button 
 type="button" 
 onClick={() => setCalcGender("girl")}
 className={`py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer transition-all ${calcGender === "girl" ? "bg-pink-400 text-white" : "text-slate-600 dark:text-slate-400"}`}
 >
 👧 Девочка
 </button>
 </div>
 </div>

 <div className="space-y-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Возраст (в месяцах)</label>
 <input 
 type="number" 
 min="0" 
 max="180"
 value={calcAgeMonths}
 onChange={(e) => setCalcAgeMonths(parseInt(e.target.value) || 0)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200" 
 required
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Вес ребенка (кг)</label>
 <input 
 type="number" 
 step="0.1"
 min="1"
 max="100"
 value={calcWeight}
 onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
 required
 />
 </div>
 <div className="space-y-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Рост ребенка (см)</label>
 <input 
 type="number" 
 step="0.5"
 min="30"
 max="180"
 value={calcHeight}
 onChange={(e) => setCalcHeight(parseFloat(e.target.value) || 0)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
 required
 />
 </div>
 </div>

 <button 
 type="submit"
 className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/15 cursor-pointer text-center"
 id="btn_calculate_growth"
 >
 Вычислить показатели развития
 </button>
 </form>

 {/* Calculator Results Display */}
 <div>
 {!calcResult ? (
 <div className="h-full border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-2 bg-[#FDFDFD]">
 <Calculator className="w-10 h-10 text-slate-300" />
 <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Введите показатели и получите мгновенный вердикт</p>
 <p className="text-xs text-slate-400">Данные генерируются без отправки на сервер, сохраняя конфиденциальность медицинской информации.</p>
 </div>
 ) : (
 <div className="space-y-6 bg-[#FAFDF9] p-6 rounded-2xl border border-emerald-100">
 
 {/* Interactive score visual bar */}
 <div className="space-y-2">
 <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-wider">
 <span>Расчитанный ИМТ ребенка</span>
 <span className="font-mono text-emerald-600 text-sm font-extrabold">{calcResult.bmi} кг/м²</span>
 </div>
 <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex relative">
 <div className="h-full bg-orange-400 w-[30%] text-[10px] flex items-center justify-center text-white pointer-events-none">Дефицит</div>
 <div className="h-full bg-emerald-500 w-[45%] text-[10px] flex items-center justify-center text-white font-bold pointer-events-none">Норма</div>
 <div className="h-full bg-red-400 w-[25%] text-[10px] flex items-center justify-center text-white pointer-events-none">Избыток</div>
 
 {/* Indicator dot */}
 <div 
 className="absolute top-0 bottom-0 w-1.5 bg-slate-900 border border-white ring-2 ring-slate-900 shadow-lg rounded-full"
 style={{ 
 left: `${Math.min(Math.max((calcResult.bmi / 25) * 100, 10), 90)}%`,
 transform: "translateX(-50%)"
 }}
 />
 </div>
 </div>

 {/* Detailed list cards */}
 <div className="space-y-3 pt-2">
 <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2">
 <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
 <div>
 <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Статус веса</span>
 <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{calcResult.weightStatus}</span>
 </div>
 </div>

 <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2">
 <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
 <div>
 <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Статус роста</span>
 <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{calcResult.heightStatus}</span>
 </div>
 </div>

 <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2">
 <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0" />
 <div>
 <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Мнение ИМТ</span>
 <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{calcResult.bmiStatus}</span>
 </div>
 </div>
 </div>

 <div className="bg-emerald-50 dark:bg-emerald-900/20/50 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
 <span className="font-bold text-emerald-950 block mb-1">❀ Рекомендация доктора Ковалевой:</span>
 {calcResult.generalAdvise}
 </div>

 </div>
 )}
 </div>

 </div>
 </div>

 {/* SUB-SECTION 2: Interactive Vaccination Planner (RF guidelines vaccine table) */}
 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="vaccine_calendar">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-50 pb-4">
 <div>
 <h3 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
 <Activity className="w-6 h-6 text-rose-500" />
 Интерактивный календарь прививок (Национальный календарь РФ + ВОЗ)
 </h3>
 <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
 Отмечайте прививки, которые уже сделаны вашему ребенку, и смотрите подробные описания каждой вакцины.
 </p>
 </div>
 {childProfile && (
 <div className="bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold text-indigo-800 border border-indigo-100">
 Прививки для: <span className="underline">{childProfile.name}</span>
 </div>
 )}
 </div>

 {/* Stats card vaccines completed */}
 <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-100/50 flex flex-col sm:flex-row justify-between items-center gap-4">
 <div className="space-y-1">
 <span className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-wider block">Прогресс вакцинации ребенка</span>
 <div className="flex items-center gap-2">
 <span className="text-2xl font-black text-rose-600">{completedVaccines.length} / {VACCINE_DATABASE.length}</span>
 <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">прививок выполнено</span>
 </div>
 </div>

 <div className="w-full sm:w-64 bg-slate-200 h-3.5 rounded-full overflow-hidden">
 <div 
 className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-500"
 style={{ width: `${(completedVaccines.length / VACCINE_DATABASE.length) * 100}%` }}
 />
 </div>

 <div>
 <button 
 onClick={() => {
 if (window.confirm("Сбросить весь прогресс прививок?")) {
 setCompletedVaccines([]);
 }
 }}
 className="text-xs text-rose-700 hover:text-rose-900 font-bold underline cursor-pointer"
 >
 Сбросить прогресс
 </button>
 </div>
 </div>

 {/* Interactive Vaccine Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="vaccines_grid">
 {VACCINE_DATABASE.map(vaccine => {
 const isDone = completedVaccines.includes(vaccine.id);
 const childAge = childProfile ? Math.floor(Math.abs(new Date().getTime() - new Date(childProfile.birthdate).getTime()) / (1000 * 60 * 60 * 24 * 30.4375)) : null;
 
 // Highlight recommended vaccine based on actual age
 const isRecommendedNow = childAge !== null && Math.abs(childAge - vaccine.ageInMonths) <= 1 && !isDone;

 return (
 <div 
 key={vaccine.id}
 onClick={() => handleToggleVaccine(vaccine.id)}
 className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between h-52 relative group hover:-translate-y-1 hover:shadow-md ${
 isDone 
 ? "bg-emerald-50 dark:bg-emerald-900/20/30 border-emerald-500/40 hover:border-emerald-500 hover:shadow-emerald-100/50" 
 : isRecommendedNow 
 ? "bg-amber-50/20 border-amber-400 hover:border-amber-500 shadow-md shadow-amber-100/30 hover:shadow-lg hover:shadow-amber-200/40" 
 : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 hover:shadow-slate-200/50"
 }`}
 >
 {/* Interactive click helper */}
 <div className="space-y-2">
 <div className="flex justify-between items-start">
 <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
 {vaccine.ageLabel}
 </span>
 
 {/* Checkbox button mimicking active check */}
 <div className="w-5 h-5 flex items-center justify-center">
 <AnimatePresence mode="wait">
 {isDone ? (
 <motion.div
 key="done"
 initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
 animate={{ scale: [0.6, 1.25, 1], rotate: 0, opacity: 1 }}
 exit={{ scale: 0.6, opacity: 0 }}
 transition={{ type: "spring", stiffness: 350, damping: 18 }}
 className="relative flex items-center justify-center"
 >
 <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
 <motion.span
 initial={{ scale: 0.8, opacity: 0.6 }}
 animate={{ scale: 2.3, opacity: 0 }}
 transition={{ duration: 0.45, ease: "easeOut" }}
 className="absolute w-5 h-5 rounded-full border-2 border-emerald-400 pointer-events-none"
 />
 </motion.div>
 ) : (
 <motion.div
 key="todo"
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.8, opacity: 0 }}
 className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-slate-500 transition-all"
 />
 )}
 </AnimatePresence>
 </div>
 </div>

 <div>
 <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-tight line-clamp-1 group-hover:text-emerald-800 transition-all">
 {vaccine.name}
 </h4>
 <span className="text-[10px] text-rose-600 font-semibold uppercase tracking-wider block mt-0.5">
 Защита: {vaccine.diseases}
 </span>
 </div>

 <p className="text-xs text-slate-500 dark:text-slate-500 leading-snug line-clamp-3">
 {vaccine.description}
 </p>
 </div>

 {/* Recommend notification footer badge */}
 {isRecommendedNow && (
 <div className="absolute top-1.5 right-[35px] bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md animate-pulse">
 РЕКОМЕНДУЕМ СЕЙЧАС
 </div>
 )}

 <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800/60 mt-2 relative">
 <div className="flex items-center gap-1.5">
 <span className="text-[10px] font-bold text-slate-400">
 {isDone ? "✓ Сделано" : "⏱ Ожидается"}
 </span>
 
 {/* Info Button with hover tooltip */}
 <div className="relative inline-block group/info select-none">
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation(); // Avoid triggering state changes
 }}
 className="p-1 rounded-full hover:bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 transition-colors cursor-help"
 >
 <Info className="w-3.5 h-3.5" />
 </button>
 
 {/* Full layout Tooltip */}
 <div className="absolute bottom-full right-0 left-auto mb-2 w-72 max-w-[calc(100vw-2rem)] bg-slate-950 text-white rounded-2xl p-4 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/info:opacity-100 group-hover/info:scale-100 group-hover/info:pointer-events-auto transition-all duration-300 z-[9999] border border-slate-800 space-y-3 text-left font-sans line-clamp-none">
 {/* Tip pointer */}
 <div className="absolute bottom-[-5px] left-3 w-2.5 h-2.5 bg-slate-950 rotate-45 border-r border-b border-slate-800"></div>
 
 <div>
 <span className="text-[9px] font-extrabold uppercase bg-rose-500/15 text-rose-400 px-2 py-0.5 rounded tracking-widest border border-rose-500/20 block w-fit mb-1">
 Схема дозирования
 </span>
 <p className="text-[11px] text-slate-100 font-medium leading-relaxed">
 {vaccine.dosage}
 </p>
 </div>
 
 <div className="border-t border-slate-800/80 pt-2">
 <span className="text-[9px] font-extrabold uppercase bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded tracking-widest border border-amber-500/20 block w-fit mb-1">
 Противопоказания
 </span>
 <p className="text-[11px] text-slate-200 font-medium leading-relaxed">
 {vaccine.contraindications}
 </p>
 </div>
 </div>
 </div>
 </div>

 <span className="text-[9px] text-emerald-700 font-bold underline opacity-0 group-hover:opacity-100 transition-opacity">
 Изменить статус
 </span>
 </div>
 </div>
 );
 })}
 </div>

 </div>

 </div>
 )}

 {/* TAB 4: Facts & Myth busting interactive Game Quiz (high quality educative game) */}
 {activeTab === "quiz" && (
 <div className="max-w-2xl mx-auto space-y-8" id="tab_quiz_view">
 
 <div className="text-center space-y-2">
 <span className="text-xs font-bold tracking-widest text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40/50 px-3 py-1.5 rounded-full uppercase">
 Интерактивная игра для родителей
 </span>
 <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100">
 Квиз: Педиатр против ОРВИ-мифов 🤒🛡️
 </h3>
 <p className="text-sm text-slate-500 dark:text-slate-500">
 Горячие карточки с каверзными вопросами про народную медицину, лекарства и уход за детьми во время простуды. Проверьте свои знания доказательной медицины!
 </p>
 </div>

 {/* Quiz Box */}
 <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md">
 
 {!quizCompleted ? (
 <div className="space-y-6">
 
 {/* Progress Header */}
 <div className="flex justify-between items-center border-b border-rose-50 pb-4 text-xs font-bold text-slate-400">
 <span>Вопрос {quizIndex + 1} из {MYTH_QUIZ_QUESTIONS.length}</span>
 <span className="text-emerald-600 uppercase tracking-widest">Очки: {quizScore}</span>
 </div>

 {/* Question Title */}
 <h4 className="text-md sm:text-lg font-bold text-slate-800 dark:text-slate-200 leading-relaxed font-display">
 {MYTH_QUIZ_QUESTIONS[quizIndex].question}
 </h4>

 {/* Options Stack */}
 <div className="space-y-3">
 {MYTH_QUIZ_QUESTIONS[quizIndex].options.map(option => {
 const isSelected = selectedAnswer === option.id;
 let optionBg = "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80";
 
 if (hasSubmittedAnswer) {
 if (option.isCorrect) {
 optionBg = "bg-emerald-50 dark:bg-emerald-900/20/70 border-emerald-500 text-emerald-950 font-medium";
 } else if (isSelected) {
 optionBg = "bg-rose-50/70 border-rose-500 text-rose-950";
 } else {
 optionBg = "bg-slate-50 dark:bg-slate-800/50/30 border-slate-100 dark:border-slate-800 text-slate-400";
 }
 } else if (isSelected) {
 optionBg = "bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold";
 }

 return (
 <button 
 key={option.id}
 onClick={() => handleSelectQuizOption(option.id)}
 className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 text-sm cursor-pointer ${optionBg}`}
 disabled={hasSubmittedAnswer}
 >
 <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase text-slate-500 dark:text-slate-500 shrink-0 mt-0.5">
 {option.id}
 </span>
 <span>{option.text}</span>
 </button>
 );
 })}
 </div>

 {/* Actions / Answers proof */}
 <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
 
 {/* Instantly loaded proof details box */}
 {hasSubmittedAnswer && (
 <div className="bg-[#F8FAF6] p-5 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-900 leading-relaxed animate-fade-in">
 <span className="font-extrabold text-emerald-950 block mb-1">✓ Разъяснение педиатра:</span>
 {MYTH_QUIZ_QUESTIONS[quizIndex].explanation}
 </div>
 )}

 <div className="flex justify-end">
 {!hasSubmittedAnswer ? (
 <button 
 onClick={handleSubmitQuizAnswer}
 disabled={!selectedAnswer}
 className="px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 disabled:opacity-40 text-white transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
 >
 Подтвердить ответ
 </button>
 ) : (
 <button 
 onClick={handleNextQuizQuestion}
 className="px-6 py-3 rounded-xl text-sm font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-all shadow-md shadow-indigo-600/10 cursor-pointer flex items-center gap-1"
 >
 <span>{quizIndex < MYTH_QUIZ_QUESTIONS.length - 1 ? "Следующий вопрос" : "Посмотреть итоги"}</span>
 <ChevronRight className="w-4 h-4" />
 </button>
 )}
 </div>

 </div>

 </div>
 ) : (
 <div className="text-center py-6 space-y-6">
 <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-5xl mx-auto shadow-inner animate-bounce">
 🏆
 </div>
 
 <div className="space-y-2">
 <h4 className="text-xl sm:text-2xl font-bold font-display text-slate-800 dark:text-slate-200">Квиз успешно пройден!</h4>
 <p className="text-sm text-slate-500 dark:text-slate-500">
 Ваш итоговый счет: <strong className="text-emerald-600 text-lg font-black">{quizScore} из {MYTH_QUIZ_QUESTIONS.length}</strong> очков.
 </p>
 </div>

 {/* Medal badge based on points */}
 <div className="bg-[#FAF8F3] p-6 rounded-2xl border border-amber-200/50 max-w-sm mx-auto space-y-2">
 <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">Присужденный статус:</span>
 <h5 className="text-lg font-black text-amber-900">
 {quizScore === 5 ? "👑 Образцовый доказательный родитель!" : quizScore >= 3 ? "🎓 Мудрый и бдительный родитель!" : "🍀 Начинающий доказательный педиатр"}
 </h5>
 <p className="text-xs text-slate-500 dark:text-slate-500">
 {quizScore === 5 
 ? "Великолепный результат! Вы отлично ориентируетесь в принципах доказательной медицины, бережете здоровье своего малыша и не поддаетесь на старые бабушкины опасные уловки." 
 : "Хороший результат! Вы доверяете науке и отлично заботитесь о здоровье. Пройдите квиз еще раз или пообщайтесь с нашим ИИ-Ассистентом, чтобы закрепить новые знания."}
 </p>
 </div>

 <button 
 onClick={handleRestartQuiz}
 className="px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white shadow-md cursor-pointer"
 >
 Пройти заново
 </button>
 </div>
 )}

 </div>

 </div>
 )}

 {/* TAB 5: Client Medical records (Day care tracker & appointment simulated scheduling) */}
 {activeTab === "cabinet" && (
 <div className="space-y-12" id="tab_cabinet_view">
 {!currentUser ? (
 /* Auth Gate Component */
 <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl rounded-3xl overflow-hidden mt-6">
 <div className="grid grid-cols-1 md:grid-cols-12">
 {/* Left branding col */}
 <div className="md:col-span-5 bg-gradient-to-br from-[#0c2e24] to-[#124d3a] p-8 text-white flex flex-col justify-between relative overflow-hidden min-h-[400px]">
 <div className="absolute top-0 right-0 p-4 opacity-10">
 <Building2 className="w-48 h-48 text-emerald-400" />
 </div>
 <div className="space-y-4 relative z-10">
 <span className="text-[10px] bg-emerald-500/20 text-[#C1FF72] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase border border-emerald-500/30">
 EBM Портал ❀
 </span>
 <h3 className="text-2xl font-black font-display tracking-tight leading-tight pt-2">
 Единый Кабинет Здоровья Детей
 </h3>
 <p className="text-xs text-slate-350 leading-relaxed">
 Интегрированная доказательная среда для частных родителей (B2C) и корпоративных партнёров/клиник (B2B).
 </p>
 </div>

 <div className="space-y-4 pt-8 border-t border-emerald-800/60 relative z-10 text-xs text-slate-200">
 <div className="flex items-start gap-2.5">
 <CheckCircle2 className="w-4 h-4 text-[#C1FF72] shrink-0 mt-0.5" />
 <span><strong>B2C:</strong> Ведите биометрию ребенка, календарь прививок и готовьте вопросы к доступным педиатрам.</span>
 </div>
 <div className="flex items-start gap-2.5">
 <CheckCircle2 className="w-4 h-4 text-[#C1FF72] shrink-0 mt-0.5" />
 <span><strong>B2B:</strong> Управляйте доступностью врачей, добавляйте детей сотрудников и получайте счета-фактуры.</span>
 </div>
 </div>

 <div className="text-[10px] text-emerald-350/60 mt-4">
 Демо-режим: локальное хранение, не вводите реальные медицинские данные
 </div>
 </div>

 {/* Right Form Col */}
 <div className="md:col-span-7 p-6 sm:p-10 space-y-6 text-slate-800 dark:text-slate-200">
 <div className="space-y-2">
 <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">Выберите категорию обслуживания:</label>
 <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
 <button
 type="button"
 onClick={() => { setAuthType("private"); setAuthError(null); }}
 className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
 authType === "private" 
 ? "bg-white dark:bg-slate-900 text-emerald-800 shadow-sm font-black" 
 : "text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:text-slate-200"
 }`}
 >
 <User className="w-3.5 h-3.5" />
 Родитель (B2C)
 </button>
 <button
 type="button"
 onClick={() => { setAuthType("company"); setAuthError(null); }}
 className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
 authType === "company" 
 ? "bg-white dark:bg-slate-900 text-emerald-800 shadow-sm font-black" 
 : "text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:text-slate-200"
 }`}
 >
 <Building2 className="w-3.5 h-3.5" />
 Организация (B2B)
 </button>
 </div>
 </div>

 {authError && (
 <div className="bg-rose-50 text-rose-950 p-3 rounded-xl border border-rose-200 text-xs font-medium flex gap-2.5 items-start">
 <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
 <div>
 <p className="font-bold">Ошибка входа</p>
 <p className="opacity-90">{authError}</p>
 </div>
 </div>
 )}

 {authSuccess && (
 <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-950 p-3 rounded-xl border border-emerald-200 text-xs font-medium flex gap-2.5 items-start">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
 <div>
 <p className="font-bold">Успешно</p>
 <p className="opacity-90">{authSuccess}</p>
 </div>
 </div>
 )}

 <div className="bg-amber-50 text-amber-950 p-3 rounded-xl border border-amber-200 text-xs font-medium flex gap-2.5 items-start">
 <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
 <div>
 <p className="font-bold">Демо-кабинет</p>
 <p className="opacity-90">Прототип: продакшен требует аккаунты, согласия, шифрование, аудит и хранение.</p>
 </div>
 </div>

 <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
 <div className="flex justify-between items-center">
 <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
 {authView === "login" ? "Вход в кабинет" : "Регистрация кабинета"}
 </h4>
 <button
 onClick={() => { setAuthView(authView === "login" ? "register" : "login"); setAuthError(null); }}
 className="text-xs text-emerald-700 hover:text-emerald-950 font-bold underline cursor-pointer"
 >
 {authView === "login" ? "Создать аккаунт" : "Уже есть аккаунт"}
 </button>
 </div>
 </div>

 {authView === "login" ? (
 <form onSubmit={handleLogin} className="space-y-4">
 <div className="space-y-1">
 <label className="block text-[10px] uppercase font-black text-slate-500 dark:text-slate-500">Адрес Электронной Почты</label>
 <input
 type="email"
 placeholder="mail@example.com"
 value={loginEmail}
 onChange={(e) => setLoginEmail(e.target.value)}
 className="w-full min-h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 dark:text-slate-200"
 required
 />
 </div>
 <div className="space-y-1">
 <label className="block text-[10px] uppercase font-black text-slate-500 dark:text-slate-500">Пароль</label>
 <input
 type="password"
 placeholder="Введите пароль (12345)"
 value={loginPassword}
 onChange={(e) => setLoginPassword(e.target.value)}
 className="w-full min-h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 dark:text-slate-200"
 required
 />
 </div>
 <button
 type="submit"
 className="w-full min-h-11 py-2.5 bg-[#0c2e24] hover:bg-[#124d3a] text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer transition-all active:scale-[0.99] uppercase tracking-wide font-sans"
 >
 Войти как {authType === "private" ? "Частное лицо" : "Представитель"}
 </button>
 </form>
 ) : (
 <form onSubmit={handleRegister} className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div className="space-y-1">
 <label className="block text-[10px] uppercase font-black text-slate-500 dark:text-slate-500">Email *</label>
 <input
 type="email"
 placeholder="mail@site.com"
 value={regEmail}
 onChange={(e) => setRegEmail(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-850"
 required
 />
 </div>
 <div className="space-y-1">
 <label className="block text-[10px] uppercase font-black text-slate-500 dark:text-slate-500">Пароль *</label>
 <input
 type="password"
 placeholder="Минимум 5 знаков"
 value={regPassword}
 onChange={(e) => setRegPassword(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-850"
 required
 />
 </div>
 </div>

 {authType === "private" ? (
 <div className="space-y-3 animate-fade-in">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div className="space-y-1">
 <label className="block text-[10px] uppercase font-black text-slate-500 dark:text-slate-500">Ваше ФИО *</label>
 <input
 type="text"
 placeholder="Иванова Елена"
 value={regName}
 onChange={(e) => setRegName(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-850"
 required
 />
 </div>
 <div className="space-y-1">
 <label className="block text-[10px] uppercase font-black text-slate-500 dark:text-slate-500">Телефон *</label>
 <input
 type="text"
 placeholder="+7 (999) 000-0000"
 value={regPhone}
 onChange={(e) => setRegPhone(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-850"
 required
 />
 </div>
 </div>
 <div className="bg-emerald-50 dark:bg-emerald-900/20/40 p-3 rounded-xl border border-emerald-100/50 space-y-2">
 <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1">👶 Сведения ребенка:</span>
 <div className="grid grid-cols-3 gap-2">
 <input
 type="text"
 placeholder="Имя"
 value={regChildName}
 onChange={(e) => setRegChildName(e.target.value)}
 className="bg-white dark:bg-slate-900 border text-xs p-1.5 rounded-lg text-slate-850"
 required
 />
 <select
 value={regChildGender}
 onChange={(e) => setRegChildGender(e.target.value as any)}
 className="bg-white dark:bg-slate-900 border text-xs p-1 rounded-lg text-slate-850 font-bold"
 >
 <option value="boy">Мальчик 👶</option>
 <option value="girl">Девочка 👧</option>
 </select>
 <input
 type="date"
 value={regChildBirthdate}
 onChange={(e) => setRegChildBirthdate(e.target.value)}
 className="bg-white dark:bg-slate-900 border text-xs p-1 rounded-lg text-slate-850 font-bold"
 required
 />
 </div>
 </div>
 </div>
 ) : (
 <div className="space-y-3 animate-fade-in text-xs text-slate-850">
 <div className="grid grid-cols-2 gap-3">
 <input
 type="text"
 placeholder="Название фирмы *"
 value={regCompName}
 onChange={(e) => setRegCompName(e.target.value)}
 className="bg-white dark:bg-slate-900 border p-1.5 rounded-lg text-slate-850 font-bold"
 required
 />
 <input
 type="text"
 placeholder="ИНН организации *"
 value={regCompInn}
 onChange={(e) => setRegCompInn(e.target.value)}
 className="bg-white dark:bg-slate-900 border p-1.5 rounded-lg text-slate-850 font-mono"
 required
 />
 </div>
 <div className="grid grid-cols-2 gap-3">
 <input
 type="text"
 placeholder="ФИО Ответственного лица *"
 value={regCompContact}
 onChange={(e) => setRegCompContact(e.target.value)}
 className="bg-white dark:bg-slate-900 border p-1.5 rounded-lg text-slate-850 font-bold"
 required
 />
 <select
 value={regCompRole}
 onChange={(e) => setRegCompRole(e.target.value as any)}
 className="bg-white dark:bg-slate-900 border p-1 rounded-lg font-bold text-slate-850"
 >
 <option value="partner_clinic">🏢 Клиника-Партнер</option>
 <option value="corporate_customer">💼 Корпоративный клиент</option>
 </select>
 </div>
 <input
 type="text"
 placeholder="Юридический адрес"
 value={regCompAddress}
 onChange={(e) => setRegCompAddress(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border p-1.5 rounded-lg text-slate-850"
 />
 </div>
 )}

 <button
 type="submit"
 className="w-full py-2 bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs uppercase cursor-pointer tracking-wider"
 >
 Регистрация кабинета
 </button>
 </form>
 )}

 {/* Quick review demo access buttons */}
 <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-150 space-y-2">
 <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1 text-[11px]">
 <Key className="w-3.5 h-3.5 text-emerald-600" />
 Быстрый доступ для проверки и рецензента (демо):
 </p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => {
 const demoParent: AppUser = {
 id: "u_b2c_demo", type: "private", email: "parent@example.com", name: "Елена Иванова",
 phone: "+7 (999) 888-77-66", childName: "Максим", childGender: "boy", childBirthdate: "2025-05-15"
 };
 void handleDemoSessionLogin(demoParent, { name: "Максим", gender: "boy", birthdate: "2025-05-15" });
 }}
 className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-950 rounded-lg text-xs font-bold text-left transition-all cursor-pointer flex items-center gap-2"
 >
 <span className="text-emerald-700 font-extrabold text-sm shrink-0">👶</span>
 <div className="truncate">
 <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 leading-tight">Родитель (B2C)</p>
 <p className="text-[8px] text-slate-400 font-mono">parent@example.com</p>
 </div>
 </button>

 <button
 type="button"
 onClick={() => {
 const demoClinic: AppUser = {
 id: "u_b2b_demo", type: "company", email: "clinic@example.com", name: "Доказательная Клиника «Звезда»",
 phone: "+7 (495) 111-22-33", inn: "7701234567", address: "Москва, Миусская площадь, д. 9",
 contactPerson: "Ольга Мальцева", role: "partner_clinic"
 };
 void handleDemoSessionLogin(demoClinic);
 }}
 className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-[#0c2e24] rounded-lg text-xs font-bold text-left transition-all cursor-pointer flex items-center gap-2"
 >
 <span className="text-indigo-700 font-extrabold text-sm shrink-0 font-sans">🏢</span>
 <div className="truncate">
 <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 leading-tight">Клиника & B2B</p>
 <p className="text-[8px] text-slate-400 font-mono">clinic@example.com</p>
 </div>
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 ) : currentUser.type === "company" ? (
 /* B2B COMPANY CONSOLE COMPONENTS */
 <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-200">
 <div className="bg-gradient-to-r from-emerald-800 to-indigo-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-1">
 <span className="text-[9px] bg-emerald-500/20 text-[#C1FF72] py-0.5 px-2 rounded-full font-black uppercase tracking-wider">Рабочее место B2B Партнёра</span>
 <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">{currentUser.name}</h3>
 <p className="text-xs text-slate-200">
 Ответственный: <strong>{currentUser.contactPerson}</strong> • ИНН: <strong className="font-mono bg-indigo-950/40 px-1 rounded">{currentUser.inn}</strong> • Адрес: {currentUser.address}
 </p>
 </div>
 <button onClick={handleLogout} className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md select-none font-sans uppercase tracking-wider">Выйти</button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Left stats columns */}
 <div className="lg:col-span-2 space-y-6">
 {/* Pediatric Availability slots toggles */}
 <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
 <div>
 <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">🩺 Доступность персонала филиала в Едином Реестре:</h4>
 <p className="text-[11px] text-slate-500 dark:text-slate-500">Управляйте возможностью записи к врачам ведения в режиме реального времени.</p>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 {doctorsList.map((doc: any) => (
 <div key={doc.id} className={`p-3 rounded-xl border transition-all ${doc.active ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800" : "bg-slate-50 dark:bg-slate-800/50/50 border-slate-100 dark:border-slate-800 opacity-70"}`}>
 <p className="text-xs font-black text-slate-900 dark:text-slate-100">{doc.name}</p>
 <p className="text-[10px] text-emerald-700 font-bold">{doc.role}</p>
 <div className="mt-2 pt-2 border-t flex justify-between items-center text-[10px]">
 <span className={doc.active ? "text-emerald-600 font-bold" : "text-slate-400"}>{doc.active ? "Приём" : "Выкл"}</span>
 <button onClick={() => { handleToggleDocActive(doc.id); playChime(); }} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:bg-emerald-900/20 text-[9px] font-bold rounded text-slate-700 dark:text-slate-300 hover:text-emerald-950 transition-all cursor-pointer">Переключить</button>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Insured children table ledger */}
 <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
 <div className="flex justify-between items-center">
 <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">👶 Застрахованные дети по корпоративной программе:</h4>
 <span className="text-xs bg-indigo-50 text-indigo-900 border px-2.5 py-0.5 rounded font-black font-sans">
 Всего: {corporateChildren.filter(c => c.clinicId === currentUser.id).length} защищено
 </span>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="border-b text-[9px] text-slate-400 font-black uppercase bg-slate-50 dark:bg-slate-800/50/50">
 <th className="p-2">ФИО Ребенка</th>
 <th className="p-2">Пол</th>
 <th className="p-2">Полных месяцев</th>
 <th className="p-2 font-display">Медицинский План</th>
 <th className="p-2 font-mono">Последний Осмотр</th>
 <th className="p-2">Действия</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {corporateChildren.filter(c => c.clinicId === currentUser.id).length === 0 ? (
 <tr>
 <td colSpan={6} className="text-center py-4 text-slate-400">Список пуст. Добавьте ребенка через форму справа.</td>
 </tr>
 ) : (
 corporateChildren.filter(c => c.clinicId === currentUser.id).map(child => (
 <tr key={child.id} className="hover:bg-slate-50 dark:bg-slate-800/50/30">
 <td className="p-2 font-extrabold text-slate-900 dark:text-slate-100">{child.name}</td>
 <td className="p-2 text-xs">{child.gender === "boy" ? "Мальчик 👶" : "Девочка 👧"}</td>
 <td className="p-2 font-mono text-slate-650">{child.ageInMonths} мес.</td>
 <td className="p-2">
 <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-slate-700 dark:text-slate-300 font-extrabold">{child.corporatePlan}</span>
 </td>
 <td className="p-2 font-mono text-slate-500 dark:text-slate-500">{child.lastCheckupDate}</td>
 <td className="p-2">
 <button
 onClick={() => {
 const updated = corporateChildren.map(c => c.id === child.id ? { ...c, lastCheckupDate: new Date().toISOString().split("T")[0] } : c);
 setCorporateChildren(updated);
 localStorage.setItem("pediatr_corporate_children", JSON.stringify(updated));
 addInAppToast("🧑‍⚕️ Диспетчер B2B", `Чек-ап для ${child.name} зафиксирован!`);
 playChime();
 }}
 className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:bg-emerald-900/40 text-[10px] font-black rounded text-emerald-800 cursor-pointer shadow-xs active:scale-95 transition-all"
 >
 Чек-ап ✓
 </button>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* Right side form block & billing invoices */}
 <div className="space-y-6">
 {/* Add child in corporate plan */}
 <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
 <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1"><Plus className="w-4 h-4 text-emerald-600" /> Прикрепить ребенка:</h4>
 <form onSubmit={handleAddCorporateChild} className="space-y-3">
 <input 
 type="text"
 placeholder="ФИО ребенка полностью"
 value={newCorpChildName}
 onChange={(e) => setNewCorpChildName(e.target.value)}
 className="w-full bg-slate-50 dark:bg-slate-800/50 border p-1.5 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200"
 required
 />
 <div className="grid grid-cols-2 gap-2">
 <input 
 type="date"
 value={newCorpChildBirth}
 onChange={(e) => setNewCorpChildBirth(e.target.value)}
 className="bg-slate-50 dark:bg-slate-800/50 border p-1 rounded-lg text-[10px] text-slate-800 dark:text-slate-200 font-bold"
 required
 />
 <select
 value={newCorpChildGender}
 onChange={(e) => setNewCorpChildGender(e.target.value as any)}
 className="bg-slate-55 border p-1 text-xs rounded-lg font-bold text-slate-850"
 >
 <option value="boy">Мальчик 👶</option>
 <option value="girl">Девочка 👧</option>
 </select>
 </div>
 <select
 value={newCorpChildPlan}
 onChange={(e) => setNewCorpChildPlan(e.target.value as any)}
 className="w-full bg-slate-50 dark:bg-slate-800/50 border p-1.5 text-xs rounded-lg font-bold text-slate-800 dark:text-slate-200"
 >
 <option value="Базовый Детский">Базовый Детский (25к/год)</option>
 <option value="Бизнес Премиум">Бизнес Премиум (45к/год)</option>
 <option value="VIP Развитие">VIP Развитие (75к/год)</option>
 </select>
 <button type="submit" className="w-full py-1.5 bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs uppercase cursor-pointer">Прикрепить ребенка</button>
 </form>
 </div>

 {/* Electronic Invoicing block */}
 <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
 <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">🧾 Финансовый Биллинг РФ и Акты:</h4>
 {(() => {
 const related = corporateChildren.filter(c => c.clinicId === currentUser.id);
 const totalSum = related.reduce((sum, k) => {
 if (k.corporatePlan === "Базовый Детский") return sum + 25000;
 if (k.corporatePlan === "Бизнес Премиум") return sum + 45000;
 if (k.corporatePlan === "VIP Развитие") return sum + 75000;
 return sum;
 }, 0);
 return (
 <div className="space-y-3">
 <div className="bg-[#FAF8F3] border border-amber-200 p-3 rounded-xl text-center">
 <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Сумма к оплате за медсопровождение:</span>
 <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">{totalSum.toLocaleString("ru-RU")} руб.</span>
 </div>
 <button
 type="button"
 onClick={() => {
 const text = `СЧЁТ-ФАКТУРА №${Math.floor(Math.random() * 899999 + 100000)} от ${new Date().toLocaleDateString("ru-RU")}\n` +
 `-----------------------------------------------------\n` +
 `Получатель: ООО Союз Доказательных Педиатров\n` +
 `ИНН Получателя: 7701234567 • КПП: 770101001\n` +
 `Банк: ПАО СБЕРБАНК Г.МОСКВА\n` +
 `БИК: 044525225\n` +
 `-----------------------------------------------------\n` +
 `Плательщик: ${currentUser.name}\n` +
 `ИНН Плательщика: ${currentUser.inn || "БЕЗ ИНН"}\n` +
 `Сумма услуг по договору: ${totalSum.toLocaleString("ru-RU")} рублей (без комиссии банка).\n` +
 `-----------------------------------------------------\n` +
 `Электронный документ подписан квалифицированной УКЭП.`;
 window.alert(text);
 addInAppToast("✉️ Счёт выставлен", "Официальный счёт-фактура с реквизитами выгружен!");
 }}
 className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
 >
 <FileText className="w-3.5 h-3.5 text-[#C1FF72]" />
 Сформировать и выписать счёт
 </button>
 </div>
 );
 })()}
 </div>
 </div>
 </div>
 </div>
 ) : (
 /* Original B2C Experience container starts here */
 <div className="space-y-12">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
 {/* Doctor Selection & Application Info */}
 <div className="lg:col-span-2 space-y-6">
 
 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
 
 <div className="border-b border-emerald-50 pb-4">
 <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-200 flex items-center gap-2">
 <Calendar className="w-5 h-5 text-emerald-600" />
 Запись к доказательному специалисту в кабинет
 </h3>
 <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
 Выберите специалиста, заполните симптомы вашего ребенка и забронируйте онлайн-телеконсультацию или очный визит в Москве.
 </p>
 </div>

 {/* Doctor cards selection list */}
 <div className="space-y-3">
 {DOCTORS.map(doc => (
 <div 
 key={doc.id}
 onClick={() => setBookDoctorId(doc.id)}
 className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
 bookDoctorId === doc.id 
 ? "bg-emerald-50 dark:bg-emerald-900/20/40 border-emerald-500" 
 : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:border-slate-700"
 }`}
 >
 <div className="flex items-center gap-3">
 <span className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 overflow-hidden flex items-center justify-center text-2xl shadow-sm">
 {doc.isImage ? (
 <img 
 src={doc.avatar} 
 alt={doc.name} 
 className="w-full h-full object-cover" 
 referrerPolicy="no-referrer"
 />
 ) : (
 doc.avatar
 )}
 </span>
 <div>
 <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{doc.name}</h4>
 <span className="text-xs text-emerald-700 font-semibold">{doc.role}</span>
 <span className="text-[10px] text-slate-400 block font-medium">{doc.exp} • {doc.detail}</span>
 </div>
 </div>

 {/* Radio box indicator */}
 <div>
 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bookDoctorId === doc.id ? "border-emerald-600" : "border-slate-300"}`}>
 {bookDoctorId === doc.id && (
 <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-700 animate-scale-up" />
 )}
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Dynamic Success Notification */}
 {bookingSuccessMessage && (
 <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-950 p-4 rounded-2xl border border-emerald-300 flex items-start gap-2.5 text-xs sm:text-sm animate-fade-in">
 <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
 <div>
 <p className="font-bold">Запись зарегистрирована в реестре!</p>
 <p>{bookingSuccessMessage}</p>
 <p className="mt-1.5 text-[10px] text-emerald-700 font-mono">
 Код вызова: PEDIATR-{(new Date().getTime() % 100000).toString().padStart(5, '0')}
 </p>
 </div>
 </div>
 )}

 {/* Booking Fields */}
 <form onSubmit={handleBookAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-4" id="booking_fields_form">
 
 <div className="space-y-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase">Дата приема</label>
 <input 
 type="date" 
 value={bookDate}
 onChange={(e) => setBookDate(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 dark:text-slate-200" 
 required
 />
 </div>

 <div className="space-y-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase">Время</label>
 <input 
 type="time" 
 value={bookTime}
 onChange={(e) => setBookTime(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 dark:text-slate-200" 
 required
 />
 </div>

 <div className="col-span-1 md:col-span-2 space-y-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase">Тип консультации</label>
 <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
 <button 
 type="button" 
 onClick={() => setBookType("offline")}
 className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer text-center transition-all ${bookType === "offline" ? "bg-white dark:bg-slate-900 text-emerald-800 shadow-sm" : "text-slate-600 dark:text-slate-400"}`}
 >
 🏥 Очный визит в Москве
 </button>
 <button 
 type="button" 
 onClick={() => setBookType("online")}
 className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer text-center transition-all ${bookType === "online" ? "bg-white dark:bg-slate-900 text-emerald-800 shadow-sm" : "text-slate-600 dark:text-slate-400"}`}
 >
 💻 Онлайн видео-приём
 </button>
 </div>
 </div>

 <div className="col-span-1 md:col-span-2 space-y-1">
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase">Основные симптомы или повод</label>
 <textarea 
 rows={2}
 value={bookSymptom}
 onChange={(e) => setBookSymptom(e.target.value)}
 placeholder="Опишите в 2 словах жалобы или плановые вопросы..."
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 dark:text-slate-200" 
 required
 />
 </div>

 <div className="col-span-1 md:col-span-2">
 <button 
 type="submit"
 className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer"
 id="btn_confirm_book"
 >
 Записаться на указанное время
 </button>
 </div>

 </form>

 </div>

 {/* BIOMETRICS ANALYSIS & WHO CHART (GROWTH TRACKER) */}
 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 mt-8" id="growth_tracker_widget">
 <div className="border-b border-emerald-50 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-200 flex items-center gap-2">
 <TrendingUp className="w-5 h-5 text-emerald-600" />
 График физического развития (ВОЗ)
 </h3>
 <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
 Мониторинг массы тела и роста ребенка в сравнении с рекомендованными эталонами ВОЗ (Всемирной организации здравоохранения).
 </p>
 </div>
 {childProfile && (
 <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-xl self-start sm:self-center border border-emerald-200">
 Гармоничность развития: {childProfile.gender === "boy" ? "Мальчик 👶" : "Девочка 👧"}
 </span>
 )}
 </div>

 {!childProfile ? (
 <div className="text-center py-10 space-y-4">
 <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 border border-slate-150 rounded-full flex items-center justify-center mx-auto shadow-inner">
 <Baby className="w-8 h-8 text-slate-400" />
 </div>
 <div className="max-w-md mx-auto space-y-2">
 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Профиль ребенка не заполнен</h4>
 <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
 Пожалуйста, настройте профиль ребенка на Главной вкладке. Это позволит построить персонализированный график развития начиная со дня рождения.
 </p>
 <button
 onClick={() => setActiveTab("home")}
 className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-md shadow-emerald-600/10 transition-all cursor-pointer"
 >
 Заполнить сейчас
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 ) : (
 <div className="space-y-6">
 
 {/* Sickness Tracker Log Scanned Notification */}
 {scanSicknessLogsForBiometrics().length > 0 && (
 <div className="bg-emerald-50 dark:bg-emerald-900/20/70 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
 <div className="flex items-start gap-2.5">
 <span className="text-lg shrink-0 mt-0.5">🧠</span>
 <div>
 <p className="font-bold text-emerald-950">EBM-анализатор: найдены замеры в дневнике!</p>
 <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-relaxed">
 В записях симптомов ребенка упомянут вес или рост. Вы можете импортировать их на график в один клик.
 </p>
 </div>
 </div>
 <button
 type="button"
 onClick={handleImportSicknessBiometrics}
 className="w-full sm:w-auto px-4 py-1.5 bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold cursor-pointer transition-all active:scale-95 text-center shrink-0"
 >
 Импортировать ({scanSicknessLogsForBiometrics().length})
 </button>
 </div>
 )}

 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
 
 {/* CHART COLUMN */}
 <div className="xl:col-span-2 space-y-4">
 
 {/* Segmented metric filter switcher */}
 <div className="flex items-center justify-between flex-wrap gap-3">
 <div className="flex bg-slate-150/60 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/50">
 <button
 type="button"
 onClick={() => setGrowthActiveMetric("weight")}
 className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
 growthActiveMetric === "weight" 
 ? "bg-white dark:bg-slate-900 text-emerald-800 shadow-sm" 
 : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
 }`}
 >
 ⚖️ Динамика веса (кг)
 </button>
 <button
 type="button"
 onClick={() => setGrowthActiveMetric("height")}
 className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
 growthActiveMetric === "height" 
 ? "bg-white dark:bg-slate-900 text-emerald-800 shadow-sm" 
 : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100"
 }`}
 >
 📏 Динамика роста (см)
 </button>
 </div>

 <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Фактически
 <span className="w-2.5 h-2.5 border-b-2 border-dashed border-slate-300 inline-block"></span> Медиана ВОЗ
 </div>
 </div>

 {/* Recharts Render */}
 {growthLogs.length === 0 ? (
 <div className="h-72 w-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50/50">
 <p className="text-xs text-slate-400">Нет сохраненных точек. Добавьте значение справа.</p>
 </div>
 ) : (
 <div className="h-72 w-full text-slate-800 dark:text-slate-200" id="growth_chart_recharts_container">
 <React.Suspense
 fallback={
 <div className="h-full w-full flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-500">
 Загрузка графика развития...
 </div>
 }
 >
 <GrowthChart
 activeMetric={growthActiveMetric}
 data={[...growthLogs]
 .sort((a, b) => a.ageInMonths - b.ageInMonths)
 .map(log => ({
 ageInMonths: log.ageInMonths,
 ageLabel: `${log.ageInMonths} мес`,
 date: log.date,
 weight: log.weight,
 height: log.height,
 whoWeight: getWhoMedianForAge(log.ageInMonths, childProfile?.gender || "boy", "weight"),
 whoHeight: getWhoMedianForAge(log.ageInMonths, childProfile?.gender || "boy", "height"),
 }))}
 />
 </React.Suspense>
 </div>
 )}

 {/* Scientific explanatory disclaimer */}
 <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-[10px] text-slate-500 dark:text-slate-500 leading-relaxed">
 <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
 <div>
 <p className="font-bold text-slate-600 dark:text-slate-400">Оценка гармоничности по ВОЗ:</p>
 <p>
 Небольшие отклонения от медианной линии являются эталоном нормы. Главное в развитии — это плавный тренд, без резких замедлений или падений. Поделитесь этим графиком с Анной Сергеевной на приёме для глубокого профессионального анализа.
 </p>
 </div>
 </div>

 </div>

 {/* INPUT FORM AND TABLE LOG LIST */}
 <div className="space-y-5">
 
 {/* Mini Add Biometric Form */}
 <form onSubmit={handleAddGrowthRecord} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-4">
 <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
 <Plus className="w-4 h-4 text-emerald-600" />
 Добавить замер
 </h4>

 <div className="grid grid-cols-2 gap-3">
 <div className="space-y-1 col-span-1">
 <label className="block text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase">Возраст (мес)</label>
 <input
 type="number"
 min={0}
 max={36}
 value={newGrowthAge}
 onChange={(e) => setNewGrowthAge(parseInt(e.target.value) || 0)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-bold"
 required
 />
 </div>

 <div className="space-y-1 col-span-1">
 <label className="block text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase">Дата замера</label>
 <input
 type="date"
 value={newGrowthDate || ""}
 onChange={(e) => setNewGrowthDate(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-semibold"
 required
 />
 </div>

 <div className="space-y-1 col-span-1">
 <label className="block text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase">Вес (кг)</label>
 <input
 type="number"
 step="0.01"
 min={1}
 max={40}
 placeholder="Имя: 9.5"
 value={newGrowthWeight}
 onChange={(e) => setNewGrowthWeight(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-bold"
 required
 />
 </div>

 <div className="space-y-1 col-span-1">
 <label className="block text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase">Рост (см)</label>
 <input
 type="number"
 step="0.1"
 min={30}
 max={140}
 placeholder="Имя: 74"
 value={newGrowthHeight}
 onChange={(e) => setNewGrowthHeight(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-bold"
 required
 />
 </div>
 </div>

 <button
 type="submit"
 className="w-full py-1.5 bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 font-sans"
 >
 Внести измерения
 </button>
 </form>

 {/* Historical records list with deletability */}
 <div className="space-y-2">
 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
 История измерений ({growthLogs.length})
 </h4>

 <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
 {growthLogs.length === 0 ? (
 <p className="text-center text-slate-400 italic py-4">Список пуст.</p>
 ) : (
 [...growthLogs]
 .sort((a, b) => b.ageInMonths - a.ageInMonths)
 .map((log) => {
 const defaultLabel = log.id.startsWith("g_default_") ? " (По умолчанию)" : "";
 return (
 <div
 key={log.id}
 className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-800/50 shadow-xs group transition-all"
 >
 <div className="space-y-0.5">
 <p className="font-bold text-slate-800 dark:text-slate-200">
 {log.ageInMonths} мес. <span className="text-[9px] text-slate-400 font-normal font-mono">{log.date}</span>
 {defaultLabel && <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 font-semibold px-1 rounded ml-1">ВОЗ</span>}
 </p>
 <p className="text-[10px] text-slate-500 dark:text-slate-500">
 ⚖️ <strong>{log.weight} кг</strong> | 📏 <strong>{log.height} см</strong>
 </p>
 </div>
 <button
 type="button"
 onClick={() => handleDeleteGrowthRecord(log.id)}
 className="p-1 px-2 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded bg-transparent opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-[10px] font-bold shrink-0"
 title="Удалить замер"
 >
 Удалить
 </button>
 </div>
 );
 })
 )}
 </div>
 </div>

 </div>

 </div>

 </div>
 )}
 </div>

 </div>

 {/* Right sidebar active booked cards */}
 <div className="space-y-6">

 {/* ВАКЦИНАЦИЯ - НАПОМИНАНИЯ (Vaccination Reminders) */}
 <div className="bg-white dark:bg-slate-900 border-2 border-emerald-50 p-6 rounded-3xl shadow-xs space-y-4" id="vaccine_reminders_card">
 <div className="border-b border-emerald-50 pb-3 flex items-center justify-between">
 <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
 <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
 Напоминания о прививках
 </h4>
 {childProfile && reminders.totalUpcoming > 0 && (
 <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
 {reminders.totalUpcoming}
 </span>
 )}
 </div>

 {!childProfile ? (
 <div className="text-center py-4 space-y-3">
 <p className="text-xs text-slate-500 dark:text-slate-500 leading-snug">
 Создайте профиль ребенка на Главной вкладке, чтобы рассчитывать график прививок и получать своевременные уведомления.
 </p>
 <button
 onClick={() => setActiveTab("home")}
 className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20/50 px-3 py-1.5 rounded-xl cursor-pointer"
 id="btn_go_home_profile"
 >
 Заполнить профиль ребенка
 <ArrowRight className="w-3" />
 </button>
 </div>
 ) : (
 <div className="space-y-4">
 <div className="bg-emerald-50 dark:bg-emerald-900/20/40 px-3 py-2 rounded-xl text-[11px] text-emerald-800 border border-emerald-100 flex items-center justify-between">
 <span>Профиль: <strong>{childProfile.name}</strong></span>
 <span>Возраст: <strong>{childAge} мес.</strong></span>
 </div>

 {/* Vaccine notifications controller */}
 <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-150 p-3 rounded-2xl space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
 Умные Оповещения
 </span>
 <span className="text-[8px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 px-1.5 py-0.5 rounded font-black uppercase">EBM</span>
 </div>
 
 <div className="flex gap-2">
 <button
 type="button"
 onClick={() => {
 const newVal = !vaccineAudioEnabled;
 setVaccineAudioEnabled(newVal);
 if (newVal) playChime();
 }}
 className={`flex-1 py-1.5 px-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
 vaccineAudioEnabled 
 ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 text-emerald-800 shadow-xs" 
 : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-650"
 }`}
 title={vaccineAudioEnabled ? "Звуковое оповещение включено" : "Звуковое оповещение выключено"}
 >
 {vaccineAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-450" />}
 Звук: {vaccineAudioEnabled ? "Вкл" : "Выкл"}
 </button>
 
 <button
 type="button"
 onClick={handleToggleBrowserNotifications}
 className={`flex-1 py-1.5 px-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
 vaccineBrowserNotificationsEnabled
 ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 text-emerald-800 shadow-xs" 
 : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-650"
 }`}
 title={vaccineBrowserNotificationsEnabled ? "Браузерные уведомления включены" : "Браузерные уведомления выключены"}
 >
 {vaccineBrowserNotificationsEnabled ? <Bell className="w-3.5 h-3.5 text-emerald-600 animate-swing" /> : <BellOff className="w-3.5 h-3.5 text-slate-450" />}
 Браузер: {vaccineBrowserNotificationsEnabled ? "Вкл" : "Выкл"}
 </button>

 <button
 type="button"
 onClick={() => {
 playChime();
 addInAppToast("📢 Тест уведомлений", `Напоминания о вакцинах настроены! Аудиосигналы активны.`);
 }}
 className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:text-emerald-700 py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer active:scale-95"
 title="Проверить звуковой сигнал"
 >
 Тест ⚡
 </button>
 </div>
 </div>

 {reminders.totalUpcoming === 0 ? (
 <div className="text-center py-5 border border-dashed border-emerald-100 rounded-xl bg-emerald-50 dark:bg-emerald-900/20/20 text-xs text-emerald-850 p-3 space-y-2">
 <Check className="w-6 h-6 text-emerald-500 mx-auto" />
 <p className="font-bold text-emerald-950">Все прививки по возрасту сделаны!</p>
 <p className="text-[10px] text-slate-500 dark:text-slate-500">Вы заслуживаете звание образцового родителя.</p>
 </div>
 ) : (
 <div className="space-y-3">
 <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-snug">
 Основываясь на возрасте малыша ({childAge} мес.), вот прививки, на которые стоит обратить внимание:
 </p>

 {/* Overdue */}
 {reminders.overdue.length > 0 && (
 <div className="space-y-2">
 <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block">⚠️ Пропущенные вакцины:</span>
 <div className="space-y-1.5">
 <AnimatePresence initial={false}>
 {reminders.overdue.map(v => (
 <motion.div 
 key={v.id} 
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ 
 opacity: 0, 
 scale: 0.9, 
 height: 0, 
 marginBottom: 0, 
 paddingTop: 0, 
 paddingBottom: 0, 
 marginTop: 0,
 borderWidth: 0,
 overflow: "hidden", 
 transition: { duration: 0.25 } 
 }}
 className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs flex flex-col justify-between gap-2"
 >
 <div>
 <h5 className="font-bold text-slate-900 dark:text-slate-100 leading-tight">{v.name}</h5>
 <p className="text-[9px] text-slate-500 dark:text-slate-500 font-medium mt-0.5">Оптимальный возраст: {v.ageLabel}</p>
 <p className="text-[9px] text-rose-700 font-semibold mt-0.5">Защищает от: {v.diseases}</p>
 </div>
 <div className="flex justify-between items-center pt-1.5 border-t border-slate-200 dark:border-slate-700/40">
 <span className="text-[8px] text-rose-600 font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-rose-100 uppercase tracking-wide">ПРОСРОЧЕНО</span>
 <button 
 onClick={() => handleToggleVaccine(v.id)}
 className="py-1 px-2 rounded bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white text-[9px] font-bold cursor-pointer transition-all active:scale-95"
 >
 Сделано ✓
 </button>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 </div>
 )}

 {/* Due Soon */}
 {reminders.dueSoon.length > 0 && (
 <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
 <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">⏳ Подходит срок (ближайший месяц):</span>
 <div className="space-y-1.5">
 <AnimatePresence initial={false}>
 {reminders.dueSoon.map(v => (
 <motion.div 
 key={v.id} 
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ 
 opacity: 0, 
 scale: 0.9, 
 height: 0, 
 marginBottom: 0, 
 paddingTop: 0, 
 paddingBottom: 0, 
 marginTop: 0,
 borderWidth: 0,
 overflow: "hidden", 
 transition: { duration: 0.25 } 
 }}
 className="p-2.5 rounded-xl bg-amber-50/40 border border-amber-100/70 text-xs flex flex-col justify-between gap-2"
 >
 <div>
 <h5 className="font-bold text-slate-900 dark:text-slate-100 leading-tight">{v.name}</h5>
 <p className="text-[9px] text-slate-500 dark:text-slate-500 font-medium mt-0.5">Оптимальный возраст: {v.ageLabel}</p>
 <p className="text-[9px] text-emerald-700 font-semibold mt-0.5">Защищает от: {v.diseases}</p>
 </div>
 <div className="flex justify-between items-center pt-1.5 border-t border-slate-200 dark:border-slate-700/40">
 <span className="text-[8px] text-amber-600 font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-amber-100 uppercase tracking-wide">ПРИБЛИЖАЕТСЯ</span>
 <button 
 onClick={() => handleToggleVaccine(v.id)}
 className="py-1 px-2 rounded bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white text-[9px] font-bold cursor-pointer transition-all active:scale-95"
 >
 Сделано ✓
 </button>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 </div>
 )}

 <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800/85">
 <button
 type="button"
 onClick={handleViewVaccineCalendar}
 className="w-full py-2 px-4 bg-rose-50 hover:bg-rose-100 text-rose-750 hover:text-rose-850 text-[11px] font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-rose-150/60 shadow-2xs hover:shadow-xs hover:scale-[1.01] active:scale-95"
 id="btn_view_full_calendar"
 >
 <span>Посмотреть весь календарь</span>
 <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
 </button>
 </div>

 </div>
 )}
 </div>
 )}
 </div>
 
 {/* Active Appointments list widget */}
 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-4">
 <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
 <Clock className="w-4 h-4 text-emerald-500" />
 Предстоящие приёмы ({appointments.length})
 </h4>

 {appointments.length === 0 ? (
 <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50/20">
 У вас нет запланированных приёмов.
 </div>
 ) : (
 <div className="space-y-3" id="appointments_list">
 {appointments.map(ap => (
 <div key={ap.id} className="bg-[#FAFDF9] p-4 rounded-xl border border-emerald-100 shadow-inner flex flex-col justify-between gap-3 relative">
 <div>
 <span className="text-[8px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded uppercase block w-max mb-1">
 {ap.type === "online" ? "Онлайн видео-вызов" : "Очный приём"}
 </span>
 <h5 className="text-xs font-black text-slate-900 dark:text-slate-100">{ap.doctorName}</h5>
 <span className="text-[10px] text-slate-500 dark:text-slate-500">{ap.doctorRole}</span>
 
 <div className="mt-2 text-[10px] text-slate-600 dark:text-slate-400 space-y-0.5">
 <p>🗓 Дата: <strong className="font-bold">{ap.date} в {ap.time}</strong></p>
 <p>👶 Малыш: {ap.childName}</p>
 <p>🦷 Жалоба: {ap.symptom}</p>
 </div>
 </div>

 <div className="flex gap-2">
 <button 
 onClick={() => handleCancelAppointment(ap.id)}
 className="w-full py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded border border-rose-200 cursor-pointer"
 >
 Отменить визит
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Sickness tracker logs */}
 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-4">
 <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
 <Activity className="w-4 h-4 text-emerald-500" />
 Дневник ОРВИ & Наблюдения
 </h4>

 <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-snug">
 Сюда вы можете фиксировать течение ОРВИ ребенка, чтобы при очном посетителе Анна Сергеевна смогла точно оценить хронологию симптомов.
 </p>

 <form onSubmit={handleAddSicknessLog} className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50" id="sickness_logger_form">
 <input 
 type="text"
 placeholder="Симптомы сегодня (темп. 37.8, сопли...)"
 value={newSymptomText}
 onChange={(e) => setNewSymptomText(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
 required
 />
 <input 
 type="text"
 placeholder="ГВ кормления, частота мочеиспусканий..."
 value={newNotesText}
 onChange={(e) => setNewNotesText(e.target.value)}
 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
 />
 <button 
 type="submit"
 className="w-full py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold rounded cursor-pointer"
 >
 Записать симптомы в медкарту
 </button>
 </form>

 {/* Log stream list */}
 <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1" id="sickness_logs_stream">
 {sicknessLogs.map(log => (
 <div key={log.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs text-xs space-y-1 relative group">
 <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
 <span>{log.date}</span>
 <span className={`px-1.5 py-0.5 rounded ${
 log.status === "Вылечен" 
 ? "bg-emerald-100 dark:bg-emerald-900/40/50 text-emerald-800" 
 : log.status === "Наблюдение" 
 ? "bg-amber-100/50 text-amber-800" 
 : "bg-red-50 text-red-800"
 }`}>
 {log.status}
 </span>
 </div>
 <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{log.symptoms}</p>
 <p className="text-slate-500 dark:text-slate-500 text-[10px] bg-slate-50 dark:bg-slate-800/50/50 p-1.5 rounded">{log.doctorNotes}</p>
 
 <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800/60 mt-1.5">
 <button 
 type="button"
 onClick={() => handleUpdateRecordStatus(log.id, log.status === "Вылечен" ? "Активно" : "Вылечен")}
 className="text-[9px] font-bold text-slate-500 dark:text-slate-500 hover:text-emerald-700 underline cursor-pointer"
 >
 Изменить статус
 </button>
 <button 
 type="button"
 onClick={() => handleDeleteRecord(log.id)}
 className="text-[9px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
 title="Удалить лог"
 >
 Удалить
 </button>
 </div>
 </div>
 ))}
 </div>

 </div>

 {/* CLINICAL PDF EXPORT PROMPT */}
 {childProfile && (
 <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-lg border border-emerald-500/20 relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-3 text-emerald-505 opacity-20 group-hover:scale-110 transition-transform">
 <FileText className="w-16 h-16" />
 </div>
 <div className="relative z-10 space-y-2">
 <span className="text-[9px] text-[#C1FF72] font-black uppercase tracking-widest bg-emerald-800/80 px-2.5 py-0.5 rounded">PDF ЭКСПОРТ</span>
 <h4 className="text-sm font-bold font-display text-white font-sans">Клиническая медицинская карта</h4>
 <p className="text-[10px] text-slate-300 leading-relaxed">
 Скачайте медицинскую карту ребенка <strong>{childProfile.name}</strong> со всеми прививками и дневником наблюдений в официальном педиатрическом формате.
 </p>
 
 <button
 onClick={handleExportPDF}
 disabled={isExportingPDF}
 className="w-full mt-2 py-2 px-4 rounded-xl text-xs font-bold bg-[#C1FF72] hover:bg-[#b0f55d] text-slate-900 dark:text-slate-100 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 active:scale-98 disabled:opacity-50"
 >
 {isExportingPDF ? (
 <>
 <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
 Генерация карты...
 </>
 ) : (
 <>
 <Download className="w-3.5 h-3.5" /> Экспортировать в PDF
 </>
 )}
 </button>
 </div>
 </div>
 )}

 </div>

 </div>

 </div>
 )}
 </div>
 )}

 </main>

 {/* SYSTEMATIC BRAND FOOTER */}
 <footer className="bg-slate-900 text-slate-300 py-10 mt-16 border-t-4 border-emerald-500" id="brand_footer">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
 
 <div className="space-y-3">
 <h4 className="text-white font-bold font-display text-base tracking-tight">Заботливый Педиатр ❀</h4>
 <p className="text-xs text-slate-400 leading-relaxed">
 Современная медицина заботы и уважения. Сопровождаем развитие вашего ребенка от роддома до совершеннолетия. Без лишних химических нагрузок, бесполезных анализов и опасных мифологических прогреваний.
 </p>
 <p className="text-[11px] text-slate-500 dark:text-slate-500">
 © 2026 Врач-педиатр А. С. Ковалева. Все права защищены. <br />
 Создано на принципах Evidence-Based Medicine (EBM).
 </p>
 </div>

 <div className="space-y-3">
 <h4 className="text-white font-bold font-display text-xs uppercase tracking-wider">Кабинеты и Осмотры</h4>
 <ul className="text-xs text-slate-400 space-y-2">
 <li className="flex items-center gap-1.5">
 <ChevronRight className="w-3 h-3 text-emerald-500" /> Консультации по бережному прикорму детей
 </li>
 <li className="flex items-center gap-1.5">
 <ChevronRight className="w-3 h-3 text-emerald-500" /> Ведение детей первого года жизни (Неонатолог)
 </li>
 <li className="flex items-center gap-1.5">
 <ChevronRight className="w-3 h-3 text-emerald-500" /> Индивидуальный календарь пропущенных прививок
 </li>
 <li className="flex items-center gap-1.5">
 <ChevronRight className="w-3 h-3 text-emerald-500" /> Диагностика ОРВИ, кашля, пищевых непереносимостей
 </li>
 </ul>
 </div>

 <div className="space-y-3 bg-white dark:bg-slate-900/5 p-4 rounded-xl border border-white/5">
 <h4 className="text-white font-bold font-display text-xs uppercase tracking-wider flex items-center gap-1 text-emerald-400">
 <Heart className="w-4 h-4 text-emerald-400 animate-pulse fill-emerald-500" />
 Поддержите здоровье детей!
 </h4>
 <p className="text-[11px] text-slate-400 leading-relaxed">
 Не болейте! Самый важный ресурс мамы и папы — спокойствие и информированность. Увлажняйте воздух в детской до 50%, проветривайте, и всегда используйте наш ИИ-помощник перед принятием решений о приеме таблеток!
 </p>
 <div className="pt-1 flex gap-2">
 <span className="bg-white dark:bg-slate-900/10 px-2 py-1 text-[10px] uppercase font-bold text-white rounded">ВОЗ</span>
 <span className="bg-white dark:bg-slate-900/10 px-2 py-1 text-[10px] uppercase font-bold text-white rounded">EBM Союз Педиатров</span>
 </div>
 </div>

 </div>
 </footer>

 </div>
 );
}
