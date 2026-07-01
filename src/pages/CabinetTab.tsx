import React from 'react';
import { Baby, Stethoscope, Heart, ShieldAlert, CheckCircle2, Calendar, User, MessageCircle, Activity, Trophy, Apple, Sparkles, BookOpen, Clock, ChevronRight, Calculator, Check, X, Award, AlertCircle, PhoneCall, MapPin, FileText, Download, Plus, Trash2, CheckSquare, Square, HelpCircle, TrendingUp, ArrowRight, Info, Volume2, VolumeX, Bell, BellOff, Building2, Lock, LogOut, Key, Users, Briefcase } from 'lucide-react';
const GrowthChart = React.lazy(() => import("../components/GrowthChart"));

export default function CabinetTab(props: any) {
  const { currentUser, usersStore, handleLogin, handleRegister, handleLogout } = props;
  
  return (
    <>
      <div className="space-y-12" id="tab_cabinet_view">
            {!currentUser ? (
              /* Auth Gate Component */
              <div className="max-w-4xl mx-auto bg-white border border-slate-100 shadow-xl rounded-3xl overflow-hidden mt-6">
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
                  <div className="md:col-span-7 p-6 sm:p-10 space-y-6 text-slate-800">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">Выберите категорию обслуживания:</label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => { setAuthType("private"); setAuthError(null); }}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            authType === "private" 
                              ? "bg-white text-emerald-800 shadow-sm font-black" 
                              : "text-slate-500 hover:text-slate-800"
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
                              ? "bg-white text-emerald-800 shadow-sm font-black" 
                              : "text-slate-500 hover:text-slate-800"
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
                      <div className="bg-emerald-50 text-emerald-950 p-3 rounded-xl border border-emerald-200 text-xs font-medium flex gap-2.5 items-start">
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

                    <div className="border-b border-slate-100 pb-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-bold text-slate-900 font-display">
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
                          <label className="block text-[10px] uppercase font-black text-slate-500">Адрес Электронной Почты</label>
                          <input
                            type="email"
                            placeholder="mail@example.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full min-h-11 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-black text-slate-500">Пароль</label>
                          <input
                            type="password"
                            placeholder="Введите пароль (12345)"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full min-h-11 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
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
                            <label className="block text-[10px] uppercase font-black text-slate-500">Email *</label>
                            <input
                              type="email"
                              placeholder="mail@site.com"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-850"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] uppercase font-black text-slate-500">Пароль *</label>
                            <input
                              type="password"
                              placeholder="Минимум 5 знаков"
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-850"
                              required
                            />
                          </div>
                        </div>

                        {authType === "private" ? (
                          <div className="space-y-3 animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="block text-[10px] uppercase font-black text-slate-500">Ваше ФИО *</label>
                                <input
                                  type="text"
                                  placeholder="Иванова Елена"
                                  value={regName}
                                  onChange={(e) => setRegName(e.target.value)}
                                  className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-850"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] uppercase font-black text-slate-500">Телефон *</label>
                                <input
                                  type="text"
                                  placeholder="+7 (999) 000-0000"
                                  value={regPhone}
                                  onChange={(e) => setRegPhone(e.target.value)}
                                  className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-850"
                                  required
                                />
                              </div>
                            </div>
                            <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/50 space-y-2">
                              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1">👶 Сведения ребенка:</span>
                              <div className="grid grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  placeholder="Имя"
                                  value={regChildName}
                                  onChange={(e) => setRegChildName(e.target.value)}
                                  className="bg-white border text-xs p-1.5 rounded-lg text-slate-850"
                                  required
                                />
                                <select
                                  value={regChildGender}
                                  onChange={(e) => setRegChildGender(e.target.value as any)}
                                  className="bg-white border text-xs p-1 rounded-lg text-slate-850 font-bold"
                                >
                                  <option value="boy">Мальчик 👶</option>
                                  <option value="girl">Девочка 👧</option>
                                </select>
                                <input
                                  type="date"
                                  value={regChildBirthdate}
                                  onChange={(e) => setRegChildBirthdate(e.target.value)}
                                  className="bg-white border text-xs p-1 rounded-lg text-slate-850 font-bold"
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
                                className="bg-white border p-1.5 rounded-lg text-slate-850 font-bold"
                                required
                              />
                              <input
                                type="text"
                                placeholder="ИНН организации *"
                                value={regCompInn}
                                onChange={(e) => setRegCompInn(e.target.value)}
                                className="bg-white border p-1.5 rounded-lg text-slate-850 font-mono"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="ФИО Ответственного лица *"
                                value={regCompContact}
                                onChange={(e) => setRegCompContact(e.target.value)}
                                className="bg-white border p-1.5 rounded-lg text-slate-850 font-bold"
                                required
                              />
                              <select
                                value={regCompRole}
                                onChange={(e) => setRegCompRole(e.target.value as any)}
                                className="bg-white border p-1 rounded-lg font-bold text-slate-850"
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
                              className="w-full bg-white border p-1.5 rounded-lg text-slate-850"
                            />
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs uppercase cursor-pointer tracking-wider"
                        >
                          Регистрация кабинета
                        </button>
                      </form>
                    )}

                    {/* Quick review demo access buttons */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 text-[11px]">
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
                          className="p-2 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-950 rounded-lg text-xs font-bold text-left transition-all cursor-pointer flex items-center gap-2"
                        >
                          <span className="text-emerald-700 font-extrabold text-sm shrink-0">👶</span>
                          <div className="truncate">
                            <p className="text-[11px] font-black text-slate-900 leading-tight">Родитель (B2C)</p>
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
                          className="p-2 bg-white border border-slate-200 hover:border-emerald-500 hover:text-[#0c2e24] rounded-lg text-xs font-bold text-left transition-all cursor-pointer flex items-center gap-2"
                        >
                          <span className="text-indigo-700 font-extrabold text-sm shrink-0 font-sans">🏢</span>
                          <div className="truncate">
                            <p className="text-[11px] font-black text-slate-900 leading-tight">Клиника & B2B</p>
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
              <div className="space-y-6 animate-fade-in text-slate-800">
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
                    <div className="bg-white border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                      <div>
                        <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">🩺 Доступность персонала филиала в Едином Реестре:</h4>
                        <p className="text-[11px] text-slate-500">Управляйте возможностью записи к врачам ведения в режиме реального времени.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {doctorsList.map((doc: any) => (
                          <div key={doc.id} className={`p-3 rounded-xl border transition-all ${doc.active ? "bg-white border-slate-100" : "bg-slate-50/50 border-slate-100 opacity-70"}`}>
                            <p className="text-xs font-black text-slate-900">{doc.name}</p>
                            <p className="text-[10px] text-emerald-700 font-bold">{doc.role}</p>
                            <div className="mt-2 pt-2 border-t flex justify-between items-center text-[10px]">
                              <span className={doc.active ? "text-emerald-600 font-bold" : "text-slate-400"}>{doc.active ? "Приём" : "Выкл"}</span>
                              <button onClick={() => { handleToggleDocActive(doc.id); playChime(); }} className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 text-[9px] font-bold rounded text-slate-700 hover:text-emerald-950 transition-all cursor-pointer">Переключить</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Insured children table ledger */}
                    <div className="bg-white border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">👶 Застрахованные дети по корпоративной программе:</h4>
                        <span className="text-xs bg-indigo-50 text-indigo-900 border px-2.5 py-0.5 rounded font-black font-sans">
                          Всего: {corporateChildren.filter(c => c.clinicId === currentUser.id).length} защищено
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b text-[9px] text-slate-400 font-black uppercase bg-slate-50/50">
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
                                <tr key={child.id} className="hover:bg-slate-50/30">
                                  <td className="p-2 font-extrabold text-slate-900">{child.name}</td>
                                  <td className="p-2 text-xs">{child.gender === "boy" ? "Мальчик 👶" : "Девочка 👧"}</td>
                                  <td className="p-2 font-mono text-slate-650">{child.ageInMonths} мес.</td>
                                  <td className="p-2">
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 border text-slate-700 font-extrabold">{child.corporatePlan}</span>
                                  </td>
                                  <td className="p-2 font-mono text-slate-500">{child.lastCheckupDate}</td>
                                  <td className="p-2">
                                    <button
                                      onClick={() => {
                                        const updated = corporateChildren.map(c => c.id === child.id ? { ...c, lastCheckupDate: new Date().toISOString().split("T")[0] } : c);
                                        setCorporateChildren(updated);
                                        localStorage.setItem("pediatr_corporate_children", JSON.stringify(updated));
                                        addInAppToast("🧑‍⚕️ Диспетчер B2B", `Чек-ап для ${child.name} зафиксирован!`);
                                        playChime();
                                      }}
                                      className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-[10px] font-black rounded text-emerald-800 cursor-pointer shadow-xs active:scale-95 transition-all"
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
                    <div className="bg-white border rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1"><Plus className="w-4 h-4 text-emerald-600" /> Прикрепить ребенка:</h4>
                      <form onSubmit={handleAddCorporateChild} className="space-y-3">
                        <input 
                          type="text"
                          placeholder="ФИО ребенка полностью"
                          value={newCorpChildName}
                          onChange={(e) => setNewCorpChildName(e.target.value)}
                          className="w-full bg-slate-50 border p-1.5 rounded-lg text-xs font-bold text-slate-800"
                          required
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="date"
                            value={newCorpChildBirth}
                            onChange={(e) => setNewCorpChildBirth(e.target.value)}
                            className="bg-slate-50 border p-1 rounded-lg text-[10px] text-slate-800 font-bold"
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
                          className="w-full bg-slate-50 border p-1.5 text-xs rounded-lg font-bold text-slate-800"
                        >
                          <option value="Базовый Детский">Базовый Детский (25к/год)</option>
                          <option value="Бизнес Премиум">Бизнес Премиум (45к/год)</option>
                          <option value="VIP Развитие">VIP Развитие (75к/год)</option>
                        </select>
                        <button type="submit" className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs uppercase cursor-pointer">Прикрепить ребенка</button>
                      </form>
                    </div>

                    {/* Electronic Invoicing block */}
                    <div className="bg-white border rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">🧾 Финансовый Биллинг РФ и Акты:</h4>
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
                              <span className="text-xl font-black text-slate-900 font-mono">{totalSum.toLocaleString("ru-RU")} руб.</span>
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
                
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  
                  <div className="border-b border-emerald-50 pb-4">
                    <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      Запись к доказательному специалисту в кабинет
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
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
                            ? "bg-emerald-50/40 border-emerald-500" 
                            : "bg-white border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-12 h-12 rounded-xl bg-white border border-slate-200/60 overflow-hidden flex items-center justify-center text-2xl shadow-sm">
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
                            <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                            <span className="text-xs text-emerald-700 font-semibold">{doc.role}</span>
                            <span className="text-[10px] text-slate-400 block font-medium">{doc.exp} • {doc.detail}</span>
                          </div>
                        </div>

                        {/* Radio box indicator */}
                        <div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bookDoctorId === doc.id ? "border-emerald-600" : "border-slate-300"}`}>
                            {bookDoctorId === doc.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-scale-up" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Success Notification */}
                  {bookingSuccessMessage && (
                    <div className="bg-emerald-50 text-emerald-950 p-4 rounded-2xl border border-emerald-300 flex items-start gap-2.5 text-xs sm:text-sm animate-fade-in">
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
                      <label className="block text-xs font-bold text-slate-500 uppercase">Дата приема</label>
                      <input 
                        type="date" 
                        value={bookDate}
                        onChange={(e) => setBookDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800" 
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Время</label>
                      <input 
                        type="time" 
                        value={bookTime}
                        onChange={(e) => setBookTime(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800" 
                        required
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Тип консультации</label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                        <button 
                          type="button" 
                          onClick={() => setBookType("offline")}
                          className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer text-center transition-all ${bookType === "offline" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600"}`}
                        >
                          🏥 Очный визит в Москве
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setBookType("online")}
                          className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer text-center transition-all ${bookType === "online" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600"}`}
                        >
                          💻 Онлайн видео-приём
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Основные симптомы или повод</label>
                      <textarea 
                        rows={2}
                        value={bookSymptom}
                        onChange={(e) => setBookSymptom(e.target.value)}
                        placeholder="Опишите в 2 словах жалобы или плановые вопросы..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800" 
                        required
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <button 
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer"
                        id="btn_confirm_book"
                      >
                        Записаться на указанное время
                      </button>
                    </div>

                  </form>

                </div>

                {/* BIOMETRICS ANALYSIS & WHO CHART (GROWTH TRACKER) */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 mt-8" id="growth_tracker_widget">
                  <div className="border-b border-emerald-50 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        График физического развития (ВОЗ)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Мониторинг массы тела и роста ребенка в сравнении с рекомендованными эталонами ВОЗ (Всемирной организации здравоохранения).
                      </p>
                    </div>
                    {childProfile && (
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-xl self-start sm:self-center border border-emerald-200">
                        Гармоничность развития: {childProfile.gender === "boy" ? "Мальчик 👶" : "Девочка 👧"}
                      </span>
                    )}
                  </div>

                  {!childProfile ? (
                    <div className="text-center py-10 space-y-4">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-150 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <Baby className="w-8 h-8 text-slate-400" />
                      </div>
                      <div className="max-w-md mx-auto space-y-2">
                        <h4 className="text-sm font-bold text-slate-700">Профиль ребенка не заполнен</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Пожалуйста, настройте профиль ребенка на Главной вкладке. Это позволит построить персонализированный график развития начиная со дня рождения.
                        </p>
                        <button
                          onClick={() => setActiveTab("home")}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-md shadow-emerald-600/10 transition-all cursor-pointer"
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
                        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                          <div className="flex items-start gap-2.5">
                            <span className="text-lg shrink-0 mt-0.5">🧠</span>
                            <div>
                              <p className="font-bold text-emerald-950">EBM-анализатор: найдены замеры в дневнике!</p>
                              <p className="text-[10px] text-slate-500 leading-relaxed">
                                В записях симптомов ребенка упомянут вес или рост. Вы можете импортировать их на график в один клик.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleImportSicknessBiometrics}
                            className="w-full sm:w-auto px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold cursor-pointer transition-all active:scale-95 text-center shrink-0"
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
                            <div className="flex bg-slate-150/60 p-1 rounded-2xl border border-slate-200/50">
                              <button
                                type="button"
                                onClick={() => setGrowthActiveMetric("weight")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  growthActiveMetric === "weight" 
                                    ? "bg-white text-emerald-800 shadow-sm" 
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                ⚖️ Динамика веса (кг)
                              </button>
                              <button
                                type="button"
                                onClick={() => setGrowthActiveMetric("height")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  growthActiveMetric === "height" 
                                    ? "bg-white text-emerald-800 shadow-sm" 
                                    : "text-slate-600 hover:text-slate-900"
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
                            <div className="h-72 w-full flex items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                              <p className="text-xs text-slate-400">Нет сохраненных точек. Добавьте значение справа.</p>
                            </div>
                          ) : (
                            <div className="h-72 w-full text-slate-800" id="growth_chart_recharts_container">
                              <React.Suspense
                                fallback={
                                  <div className="h-full w-full flex items-center justify-center rounded-2xl bg-slate-50 text-xs font-semibold text-slate-500">
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
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-2.5 text-[10px] text-slate-500 leading-relaxed">
                            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-600">Оценка гармоничности по ВОЗ:</p>
                              <p>
                                Небольшие отклонения от медианной линии являются эталоном нормы. Главное в развитии — это плавный тренд, без резких замедлений или падений. Поделитесь этим графиком с Анной Сергеевной на приёме для глубокого профессионального анализа.
                              </p>
                            </div>
                          </div>

                        </div>

                        {/* INPUT FORM AND TABLE LOG LIST */}
                        <div className="space-y-5">
                          
                          {/* Mini Add Biometric Form */}
                          <form onSubmit={handleAddGrowthRecord} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-4">
                            <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                              <Plus className="w-4 h-4 text-emerald-600" />
                              Добавить замер
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1 col-span-1">
                                <label className="block text-[10px] font-black text-slate-500 uppercase">Возраст (мес)</label>
                                <input
                                  type="number"
                                  min={0}
                                  max={36}
                                  value={newGrowthAge}
                                  onChange={(e) => setNewGrowthAge(parseInt(e.target.value) || 0)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-bold"
                                  required
                                />
                              </div>

                              <div className="space-y-1 col-span-1">
                                <label className="block text-[10px] font-black text-slate-500 uppercase">Дата замера</label>
                                <input
                                  type="date"
                                  value={newGrowthDate || ""}
                                  onChange={(e) => setNewGrowthDate(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-semibold"
                                  required
                                />
                              </div>

                              <div className="space-y-1 col-span-1">
                                <label className="block text-[10px] font-black text-slate-500 uppercase">Вес (кг)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min={1}
                                  max={40}
                                  placeholder="Имя: 9.5"
                                  value={newGrowthWeight}
                                  onChange={(e) => setNewGrowthWeight(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-bold"
                                  required
                                />
                              </div>

                              <div className="space-y-1 col-span-1">
                                <label className="block text-[10px] font-black text-slate-500 uppercase">Рост (см)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  min={30}
                                  max={140}
                                  placeholder="Имя: 74"
                                  value={newGrowthHeight}
                                  onChange={(e) => setNewGrowthHeight(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-bold"
                                  required
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 font-sans"
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
                                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 shadow-xs group transition-all"
                                      >
                                        <div className="space-y-0.5">
                                          <p className="font-bold text-slate-800">
                                            {log.ageInMonths} мес. <span className="text-[9px] text-slate-400 font-normal font-mono">{log.date}</span>
                                            {defaultLabel && <span className="text-[8px] bg-slate-100 text-slate-500 font-semibold px-1 rounded ml-1">ВОЗ</span>}
                                          </p>
                                          <p className="text-[10px] text-slate-500">
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
                <div className="bg-white border-2 border-emerald-50 p-6 rounded-3xl shadow-xs space-y-4" id="vaccine_reminders_card">
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
                      <p className="text-xs text-slate-500 leading-snug">
                        Создайте профиль ребенка на Главной вкладке, чтобы рассчитывать график прививок и получать своевременные уведомления.
                      </p>
                      <button
                        onClick={() => setActiveTab("home")}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 border border-emerald-200 bg-emerald-50/50 px-3 py-1.5 rounded-xl cursor-pointer"
                        id="btn_go_home_profile"
                      >
                        Заполнить профиль ребенка
                        <ArrowRight className="w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-emerald-50/40 px-3 py-2 rounded-xl text-[11px] text-emerald-800 border border-emerald-100 flex items-center justify-between">
                        <span>Профиль: <strong>{childProfile.name}</strong></span>
                        <span>Возраст: <strong>{childAge} мес.</strong></span>
                      </div>

                      {/* Vaccine notifications controller */}
                      <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                            Умные Оповещения
                          </span>
                          <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black uppercase">EBM</span>
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
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs" 
                                : "bg-white border-slate-200 text-slate-400 hover:text-slate-650"
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
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs" 
                                : "bg-white border-slate-200 text-slate-400 hover:text-slate-650"
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
                            className="bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                            title="Проверить звуковой сигнал"
                          >
                            Тест ⚡
                          </button>
                        </div>
                      </div>

                      {reminders.totalUpcoming === 0 ? (
                        <div className="text-center py-5 border border-dashed border-emerald-100 rounded-xl bg-emerald-50/20 text-xs text-emerald-850 p-3 space-y-2">
                          <Check className="w-6 h-6 text-emerald-500 mx-auto" />
                          <p className="font-bold text-emerald-950">Все прививки по возрасту сделаны!</p>
                          <p className="text-[10px] text-slate-500">Вы заслуживаете звание образцового родителя.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-[11px] text-slate-500 leading-snug">
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
                                        <h5 className="font-bold text-slate-900 leading-tight">{v.name}</h5>
                                        <p className="text-[9px] text-slate-500 font-medium mt-0.5">Оптимальный возраст: {v.ageLabel}</p>
                                        <p className="text-[9px] text-rose-700 font-semibold mt-0.5">Защищает от: {v.diseases}</p>
                                      </div>
                                      <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/40">
                                        <span className="text-[8px] text-rose-600 font-bold bg-white px-1.5 py-0.5 rounded border border-rose-100 uppercase tracking-wide">ПРОСРОЧЕНО</span>
                                        <button 
                                          onClick={() => handleToggleVaccine(v.id)}
                                          className="py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold cursor-pointer transition-all active:scale-95"
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
                            <div className="space-y-2 pt-1 border-t border-slate-100">
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
                                        <h5 className="font-bold text-slate-900 leading-tight">{v.name}</h5>
                                        <p className="text-[9px] text-slate-500 font-medium mt-0.5">Оптимальный возраст: {v.ageLabel}</p>
                                        <p className="text-[9px] text-emerald-700 font-semibold mt-0.5">Защищает от: {v.diseases}</p>
                                      </div>
                                      <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/40">
                                        <span className="text-[8px] text-amber-600 font-bold bg-white px-1.5 py-0.5 rounded border border-amber-100 uppercase tracking-wide">ПРИБЛИЖАЕТСЯ</span>
                                        <button 
                                          onClick={() => handleToggleVaccine(v.id)}
                                          className="py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold cursor-pointer transition-all active:scale-95"
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

                          <div className="text-center pt-3 border-t border-slate-100/85">
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
                <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    Предстоящие приёмы ({appointments.length})
                  </h4>

                  {appointments.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-100 rounded-xl bg-slate-50/20">
                      У вас нет запланированных приёмов.
                    </div>
                  ) : (
                    <div className="space-y-3" id="appointments_list">
                      {appointments.map(ap => (
                        <div key={ap.id} className="bg-[#FAFDF9] p-4 rounded-xl border border-emerald-100 shadow-inner flex flex-col justify-between gap-3 relative">
                          <div>
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded uppercase block w-max mb-1">
                              {ap.type === "online" ? "Онлайн видео-вызов" : "Очный приём"}
                            </span>
                            <h5 className="text-xs font-black text-slate-900">{ap.doctorName}</h5>
                            <span className="text-[10px] text-slate-500">{ap.doctorRole}</span>
                            
                            <div className="mt-2 text-[10px] text-slate-600 space-y-0.5">
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
                <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Дневник ОРВИ & Наблюдения
                  </h4>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    Сюда вы можете фиксировать течение ОРВИ ребенка, чтобы при очном посетителе Анна Сергеевна смогла точно оценить хронологию симптомов.
                  </p>

                  <form onSubmit={handleAddSicknessLog} className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/50" id="sickness_logger_form">
                    <input 
                      type="text"
                      placeholder="Симптомы сегодня (темп. 37.8, сопли...)"
                      value={newSymptomText}
                      onChange={(e) => setNewSymptomText(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                      required
                    />
                    <input 
                      type="text"
                      placeholder="ГВ кормления, частота мочеиспусканий..."
                      value={newNotesText}
                      onChange={(e) => setNewNotesText(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
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
                      <div key={log.id} className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs text-xs space-y-1 relative group">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                          <span>{log.date}</span>
                          <span className={`px-1.5 py-0.5 rounded ${
                            log.status === "Вылечен" 
                              ? "bg-emerald-100/50 text-emerald-800" 
                              : log.status === "Наблюдение" 
                              ? "bg-amber-100/50 text-amber-800" 
                              : "bg-red-50 text-red-800"
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <p className="font-bold text-slate-800 leading-snug">{log.symptoms}</p>
                        <p className="text-slate-500 text-[10px] bg-slate-50/50 p-1.5 rounded">{log.doctorNotes}</p>
                        
                        <div className="pt-2 flex justify-between items-center border-t border-slate-100/60 mt-1.5">
                          <button 
                            type="button"
                            onClick={() => handleUpdateRecordStatus(log.id, log.status === "Вылечен" ? "Активно" : "Вылечен")}
                            className="text-[9px] font-bold text-slate-500 hover:text-emerald-700 underline cursor-pointer"
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
                        className="w-full mt-2 py-2 px-4 rounded-xl text-xs font-bold bg-[#C1FF72] hover:bg-[#b0f55d] text-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 active:scale-98 disabled:opacity-50"
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
            <p className="text-[11px] text-slate-500">
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

          <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <h4 className="text-white font-bold font-display text-xs uppercase tracking-wider flex items-center gap-1 text-emerald-400">
              <Heart className="w-4 h-4 text-emerald-400 animate-pulse fill-emerald-500" />
              Поддержите здоровье детей!
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Не болейте! Самый важный ресурс мамы и папы — спокойствие и информированность. Увлажняйте воздух в детской до 50%, проветривайте, и всегда используйте наш ИИ-помощник перед принятием решений о приеме таблеток!
            </p>
            <div className="pt-1 flex gap-2">
              <span className="bg-white/10 px-2 py-1 text-[10px] uppercase font-bold text-white rounded">ВОЗ</span>
              <span className="bg-white/10 px-2 py-1 text-[10px] uppercase font-bold text-white rounded">EBM Союз Педиатров</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
    </>
  );
}
