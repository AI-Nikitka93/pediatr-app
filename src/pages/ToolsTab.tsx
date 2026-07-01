import React from 'react';
import { Baby, Stethoscope, Heart, ShieldAlert, CheckCircle2, Calendar, User, MessageCircle, Activity, Trophy, Apple, Sparkles, BookOpen, Clock, ChevronRight, Calculator, Check, X, Award, AlertCircle, PhoneCall, MapPin, FileText, Download, Plus, Trash2, CheckSquare, Square, HelpCircle, TrendingUp, ArrowRight, Info, Volume2, VolumeX, Bell, BellOff, Building2, Lock, LogOut, Key, Users, Briefcase } from 'lucide-react';
const GrowthChart = React.lazy(() => import("../components/GrowthChart"));

export default function ToolsTab(props: any) {
  const {  } = props;
  
  return (
    <>
      <div className="space-y-12" id="tab_tools_view">
            
            {/* SUB-SECTION 1: Dynamic Child growth calculator */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="growth_calculator">
              <div className="border-b border-emerald-50 pb-4">
                <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-emerald-600 animate-pulse" />
                  Интеллектуальный калькулятор физического развития (по нормам ВОЗ)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Оцените соотношение роста, веса и индекса массы тела (ИМТ) вашего ребенка. Данный алгоритм анализирует стандартные центильные таблицы доказательной педиатрии.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Calculator parameters Form */}
                <form onSubmit={handleCalculateGrowth} className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100" id="calc_inner_form">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Пол ребенка</label>
                      <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={() => setCalcGender("boy")}
                          className={`py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer transition-all ${calcGender === "boy" ? "bg-indigo-500 text-white" : "text-slate-600"}`}
                        >
                          👦 Мальчик
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setCalcGender("girl")}
                          className={`py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer transition-all ${calcGender === "girl" ? "bg-pink-400 text-white" : "text-slate-600"}`}
                        >
                          👧 Девочка
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Возраст (в месяцах)</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="180"
                        value={calcAgeMonths}
                        onChange={(e) => setCalcAgeMonths(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" 
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Вес ребенка (кг)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        min="1"
                        max="100"
                        value={calcWeight}
                        onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Рост ребенка (см)</label>
                      <input 
                        type="number" 
                        step="0.5"
                        min="30"
                        max="180"
                        value={calcHeight}
                        onChange={(e) => setCalcHeight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/15 cursor-pointer text-center"
                    id="btn_calculate_growth"
                  >
                    Вычислить показатели развития
                  </button>
                </form>

                {/* Calculator Results Display */}
                <div>
                  {!calcResult ? (
                    <div className="h-full border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-2 bg-[#FDFDFD]">
                      <Calculator className="w-10 h-10 text-slate-300" />
                      <p className="text-sm font-bold text-slate-600">Введите показатели и получите мгновенный вердикт</p>
                      <p className="text-xs text-slate-400">Данные генерируются без отправки на сервер, сохраняя конфиденциальность медицинской информации.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 bg-[#FAFDF9] p-6 rounded-2xl border border-emerald-100">
                      
                      {/* Interactive score visual bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                          <span>Расчитанный ИМТ ребенка</span>
                          <span className="font-mono text-emerald-600 text-sm font-extrabold">{calcResult.bmi} кг/м²</span>
                        </div>
                        <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden flex relative">
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
                        <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Статус веса</span>
                            <span className="text-sm font-bold text-slate-800">{calcResult.weightStatus}</span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Статус роста</span>
                            <span className="text-sm font-bold text-slate-800">{calcResult.heightStatus}</span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-start gap-2">
                          <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0" />
                          <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Мнение ИМТ</span>
                            <span className="text-sm font-semibold text-slate-700">{calcResult.bmiStatus}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
                        <span className="font-bold text-emerald-950 block mb-1">❀ Рекомендация доктора Ковалевой:</span>
                        {calcResult.generalAdvise}
                      </div>

                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* SUB-SECTION 2: Interactive Vaccination Planner (RF guidelines vaccine table) */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="vaccine_calendar">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-50 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-rose-500" />
                    Интерактивный календарь прививок (Национальный календарь РФ + ВОЗ)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
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
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Прогресс вакцинации ребенка</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-rose-600">{completedVaccines.length} / {VACCINE_DATABASE.length}</span>
                    <span className="text-xs text-slate-500 font-medium">прививок выполнено</span>
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
                          ? "bg-emerald-50/30 border-emerald-500/40 hover:border-emerald-500 hover:shadow-emerald-100/50" 
                          : isRecommendedNow 
                          ? "bg-amber-50/20 border-amber-400 hover:border-amber-500 shadow-md shadow-amber-100/30 hover:shadow-lg hover:shadow-amber-200/40" 
                          : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-slate-200/50"
                      }`}
                    >
                      {/* Interactive click helper */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 px-2 py-1 rounded text-slate-600">
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
                          <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-tight line-clamp-1 group-hover:text-emerald-800 transition-all">
                            {vaccine.name}
                          </h4>
                          <span className="text-[10px] text-rose-600 font-semibold uppercase tracking-wider block mt-0.5">
                            Защита: {vaccine.diseases}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-snug line-clamp-3">
                          {vaccine.description}
                        </p>
                      </div>

                      {/* Recommend notification footer badge */}
                      {isRecommendedNow && (
                        <div className="absolute top-1.5 right-[35px] bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md animate-pulse">
                          РЕКОМЕНДУЕМ СЕЙЧАС
                        </div>
                      )}

                      <div className="pt-2 flex justify-between items-center border-t border-slate-100/60 mt-2 relative">
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
                              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors cursor-help"
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
    </>
  );
}
