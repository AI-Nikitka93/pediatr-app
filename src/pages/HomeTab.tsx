import React from 'react';
import { Baby, Stethoscope, Heart, ShieldAlert, CheckCircle2, Calendar, User, MessageCircle, Activity, Trophy, Apple, Sparkles, BookOpen, Clock, ChevronRight, Calculator, Check, X, Award, AlertCircle, PhoneCall, MapPin, FileText, Download, Plus, Trash2, CheckSquare, Square, HelpCircle, TrendingUp, ArrowRight, Info, Volume2, VolumeX, Bell, BellOff, Building2, Lock, LogOut, Key, Users, Briefcase } from 'lucide-react';
const GrowthChart = React.lazy(() => import("../components/GrowthChart"));

export default function HomeTab(props: any) {
  const {  } = props;
  
  return (
    <>
      <div className="space-y-12" id="tab_home_view">
            
            {/* TASK-FIRST CARE COCKPIT */}
            <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-[#f7fbf8] p-5 sm:p-8 lg:p-10" id="care_cockpit_hero">
              <div className="grid gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)] md:items-start lg:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
                <div className="flex flex-col gap-5">
                  <div className="space-y-5">
                    <span className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
                      <ShieldAlert className="h-4 w-4" /> Безопасная маршрутизация перед советом
                    </span>
                    <div className="space-y-3">
                      <h2 className="max-w-3xl text-3xl font-black leading-[1.12] tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
                        Сначала определим уровень помощи.
                      </h2>
                      <p className="max-w-2xl text-base leading-7 text-slate-600">
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
                      className="group min-h-[96px] rounded-lg border border-red-200 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md lg:min-h-[132px] lg:p-4"
                    >
                      <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-700 lg:mb-3 lg:h-9 lg:w-9">
                        <PhoneCall className="h-5 w-5" />
                      </span>
                      <span className="block text-sm font-black text-red-900">Экстренно</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-600 md:hidden lg:block">Судороги, дыхание, синие губы, не просыпается. Не ждать чат.</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("ai-chat");
                        setChatInput("Ребенку 4 года, температура 38.6 и появилась непонятная сыпь на теле");
                      }}
                      className="group min-h-[96px] rounded-lg border border-amber-200 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md lg:min-h-[132px] lg:p-4"
                    >
                      <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-700 lg:mb-3 lg:h-9 lg:w-9">
                        <Clock className="h-5 w-5" />
                      </span>
                      <span className="block text-sm font-black text-amber-900">Сегодня к педиатру</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-600 md:hidden lg:block">Младенец с температурой, сыпь, рвота/диарея, ухудшение.</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("tools")}
                      className="group min-h-[96px] rounded-lg border border-sky-200 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md lg:min-h-[132px] lg:p-4"
                    >
                      <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 text-sky-700 lg:mb-3 lg:h-9 lg:w-9">
                        <Calendar className="h-5 w-5" />
                      </span>
                      <span className="block text-sm font-black text-sky-950">Планово</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-600 md:hidden lg:block">Рост, прививки, дневник ОРВИ, вопросы перед приемом.</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center">
                    <button
                      onClick={() => setActiveTab("ai-chat")}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                      id="hero_btn_ai"
                    >
                      Какой следующий шаг <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab("cabinet")}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-800"
                      id="hero_btn_cabinet"
                    >
                      Открыть карту ребенка <FileText className="h-4 w-4 text-emerald-600" />
                    </button>
                  </div>
                </div>

                <div className="grid content-start gap-3" id="hero_avatar_section">
                  <div className="relative h-[260px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 lg:h-[320px]">
                    <img
                      src="/src/assets/images/pediatrician_cabinet_1779444025164.png"
                      alt="Педиатрический кабинет и подготовка к консультации"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/82 via-slate-950/35 to-transparent p-4 text-white">
                      <div className="max-w-sm space-y-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-white/12 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em]">
                          <Lock className="h-3 w-3" /> demo-safe режим
                        </span>
                        <p className="text-sm font-bold leading-5">Перед консультацией соберите возраст, вес, температуру, динамику симптомов и фото/видео, если это уместно.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">ИИ</span>
                      <span className="mt-1 block text-sm font-black text-slate-900">Только подготовка</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Врач</span>
                      <span className="mt-1 block text-sm font-black text-slate-900">Финальное решение</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Данные</span>
                      <span className="mt-1 block text-sm font-black text-slate-900">Без реальных PHI в demo</span>
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
                <p className="text-white text-xs sm:text-xs font-bold bg-emerald-600/90 backdrop-blur-xs px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-xs">
                  Индивидуальный подход к каждому ребенку ❀
                </p>
              </div>
            </div>

            {/* INTERACTIVE CHILD CARD QUICK WIDGET (Direct Proof of Personalization) */}
            <section className="bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6" id="quick_profile_dashboard">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                    <Baby className="w-5 h-5 text-indigo-500" />
                    Личная медицинская карта Вашего малыша
                  </h3>
                  <p className="text-sm text-slate-500">Заполните профиль ребенка, чтобы персонализировать календари прививок и другие калькуляторы!</p>
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
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Имя малыша</label>
                    <input 
                      type="text" 
                      placeholder="Маша, Даня..." 
                      value={inputChildName}
                      onChange={(e) => setInputChildName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium" 
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Пол ребенка</label>
                    <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border border-slate-200">
                      <button 
                        type="button" 
                        onClick={() => setInputChildGender("boy")}
                        className={`min-h-11 rounded-lg px-2 py-2 text-center text-xs font-bold transition-all cursor-pointer ${inputChildGender === "boy" ? "bg-indigo-500 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"}`}
                      >
                        Мальчик
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setInputChildGender("girl")}
                        className={`min-h-11 rounded-lg px-2 py-2 text-center text-xs font-bold transition-all cursor-pointer ${inputChildGender === "girl" ? "bg-pink-400 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"}`}
                      >
                        Девочка
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Дата рождения</label>
                    <input 
                      type="date" 
                      value={inputChildBirthdate}
                      onChange={(e) => setInputChildBirthdate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium" 
                      required
                    />
                  </div>
                  <div>
                    <button 
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/10 cursor-pointer text-center"
                    >
                      Создать медкарту
                    </button>
                  </div>
                  {serverProfileStatus && (
                    <div className="md:col-span-4 text-[11px] font-semibold text-slate-600 bg-white/70 border border-amber-100 rounded-xl px-3 py-2">
                      {serverProfileStatus}
                    </div>
                  )}
                </form>
              ) : (
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6" id="profile_details_widget">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-4xl shadow-xs">
                      {childProfile.gender === "boy" ? "👶" : "👧"}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-display text-slate-900">{childProfile.name}</h4>
                      <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                        <span>Пол: {childProfile.gender === "boy" ? "мальчик" : "девочка"}</span>
                        <span>•</span>
                        <span>Родился/родилась: {new Date(childProfile.birthdate).toLocaleDateString()}</span>
                      </p>
                      
                      {/* Age calculation */}
                      <span className="inline-block mt-2 px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-md">
                        Возраст: {Math.floor(Math.abs(new Date().getTime() - new Date(childProfile.birthdate).getTime()) / (1000 * 60 * 60 * 24 * 30.4375))} месяцев
                      </span>
                      {serverProfileStatus && (
                        <p className="mt-2 text-[11px] font-semibold text-emerald-900 bg-white/70 border border-emerald-100 rounded-xl px-3 py-2">
                          {serverProfileStatus}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick tracker status */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setActiveTab("cabinet")}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 hover:text-emerald-700 border border-slate-200 flex items-center gap-2 hover:-translate-y-0.5 transition-all cursor-pointer"
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
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
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
              <h3 className="text-2xl font-bold font-display text-slate-900 text-center">Почему наша педиатрия — особенная?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">Бережность и здравый смысл</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    90% ОРВИ требуют только времени, увлажнения носа и любви. Мы не прописываем бесполезные горчичники, иммуностимуляторы для галочки или сиропы от кашля, опасные для детей до 4-х лет.
                  </p>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">Доказанная безопасность</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Мы опираемся только на современные международные мета-анализы и рекомендации (Союз Педиатров России, ВОЗ, UpToDate). Антибиотики назначаются исключительно по строгим показаниям и после анализа крови.
                  </p>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">Психологический комфорт</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Прием должен проходить без слез! Анна Сергеевна находит подход к любому непоседе при помощи игр, стетоскопа с веселой подсветкой и ласковых вопросов.
                  </p>
                </div>

              </div>
            </section>

            {/* CLINIC LOCATION & FEEDBACKS */}
            <section className="bg-[#FAF8F3] border border-amber-100/40 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8" id="clinic_footer_info">
              <div className="space-y-6">
                <h3 className="text-xl font-bold font-display text-slate-900">Бережные очные осмотры в Москве</h3>
                <p className="text-sm text-slate-600">
                  Если вашему ребенку требуется плановый осмотр, измерение параметров роста, аускультация легких или составление индивидуального календаря прививок, вы всегда можете записаться в нашу клинику доказательной медицины &quot;Малыш и Мама&quot;!
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>г. Москва, ул. Ленинский проспект, д. 45, корпус 2</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>+7 (495) 777-66-55 (Регистратура)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
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
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Отзывы благодарных родителей</h4>
                
                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 space-y-2">
                  <p className="text-xs text-slate-600 italic">
                    &quot;Пример сценария: родитель фиксирует симптомы, температуру и вопросы перед визитом. Врач видит хронологию и быстрее понимает, что произошло за последние сутки.&quot;
                  </p>
                  <span className="block text-xs font-bold text-slate-900 text-right">— демонстрационный сценарий карты ребенка</span>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 space-y-2">
                  <p className="text-xs text-slate-600 italic">
                    &quot;Пример сценария: календарь прививок подсвечивает пропущенные и ближайшие позиции, но финальное решение остается за врачом после очной или телемедицинской консультации.&quot;
                  </p>
                  <span className="block text-xs font-bold text-slate-900 text-right">— демонстрационный сценарий вакцинации</span>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: AI CONSULTING DOC CHAT (highly persistent backend prompt) */}
    </>
  );
}
