import React from 'react';
import { Baby, Stethoscope, Heart, ShieldAlert, CheckCircle2, Calendar, User, MessageCircle, Activity, Trophy, Apple, Sparkles, BookOpen, Clock, ChevronRight, Calculator, Check, X, Award, AlertCircle, PhoneCall, MapPin, FileText, Download, Plus, Trash2, CheckSquare, Square, HelpCircle, TrendingUp, ArrowRight, Info, Volume2, VolumeX, Bell, BellOff, Building2, Lock, LogOut, Key, Users, Briefcase } from 'lucide-react';
const GrowthChart = React.lazy(() => import("../components/GrowthChart"));

export default function ChatTab(props: any) {
  const {  } = props;
  
  return (
    <>
      <div className="space-y-6" id="tab_ai_chat_view">
            
            <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-xs flex flex-col md:flex-row min-h-[550px]" id="chat_box_container">
              
              {/* Left sidebar: Guidelines and warm recommendations */}
              <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 p-6 flex flex-col justify-between gap-6" id="chat_sidebar_info">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase">Интерактивный ИИ</span>
                    <h3 className="text-lg font-bold font-display text-slate-800 flex items-center gap-1.5">
                      Чат с педиатром <Sparkles className="w-4 h-4 text-amber-500" />
                    </h3>
                    <p className="text-xs text-slate-500">
                      Умная нейросетевая модель с осторожными подсказками на принципах доказательной медицины.
                    </p>
                  </div>

                  {/* Red Alert Disclaimer inside chat */}
                  <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-2 text-xs text-amber-900">
                    <p className="font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-700" /> Важная оговорка!
                    </p>
                    <p className="leading-relaxed">
                      ИИ-помощник не заменяет полноценного живого доктора и не выписывает рецепты. Он помогает успокоиться, найти правильный вектор ухода и отделить мифы от реальности.
                    </p>
                  </div>

                  <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4" id="structured_intake_rail">
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Перед отправкой</span>
                      <h4 className="mt-1 text-sm font-black text-slate-900">Мини-intake для педиатра</h4>
                    </div>

                    <div className="grid gap-2">
                      <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-start gap-2">
                          <Baby className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                          <div>
                            <p className="text-xs font-black text-slate-900">Возраст и вес</p>
                            <p className="text-[11px] leading-4 text-slate-500 md:hidden xl:block">Месяцы/годы, примерный вес, хронические состояния.</p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-start gap-2">
                          <Activity className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                          <div>
                            <p className="text-xs font-black text-slate-900">Температура и динамика</p>
                            <p className="text-[11px] leading-4 text-slate-500 md:hidden xl:block">Сколько градусов, как измеряли, сколько часов длится.</p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-start gap-2">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
                          <div>
                            <p className="text-xs font-black text-slate-900">Фото/видео симптома</p>
                            <p className="text-[11px] leading-4 text-slate-500 md:hidden xl:block">Сыпь, дыхание, ухо, горло — если это безопасно и уместно.</p>
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
                        className="flex min-h-11 items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 text-left text-xs font-bold text-slate-800 transition-all hover:border-amber-300 hover:bg-amber-50"
                      >
                        <span>Температура + сыпь</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSendPromptHelper("У ребенка температура 38.5, насморк. Что делать на первом этапе ОРВИ?")}
                        className="flex min-h-11 items-center justify-between rounded-lg border border-emerald-200 bg-white px-3 py-2 text-left text-xs font-bold text-slate-800 transition-all hover:border-emerald-300 hover:bg-emerald-50"
                      >
                        <span>ОРВИ без красных флагов</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSendPromptHelper("Прививки в 3 месяца: какие делать и как подготовиться?")}
                        className="flex min-h-11 items-center justify-between rounded-lg border border-sky-200 bg-white px-3 py-2 text-left text-xs font-bold text-slate-800 transition-all hover:border-sky-300 hover:bg-sky-50"
                      >
                        <span>Подготовка к прививкам</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center p-3 border-t border-slate-100/80">
                  <span className="text-[10px] block text-slate-400">Врач-педиатр Д-р Ковалева А. С.</span>
                  <span className="text-xs font-bold text-slate-700">Официальный веб-ассистент</span>
                </div>
              </div>

              {/* Right side: Real Chat Window */}
              <div className="flex-1 flex flex-col justify-between bg-white h-[560px]" id="chat_messages_panel">
                
                {/* Chat window top header */}
                <div className="px-6 py-4 border-b border-rose-50/50 bg-[#FDFBF7]/85 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-lg shadow-inner">
                      👩‍⚕️
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Анна Сергеевна (ИИ-Ассистент)</h4>
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
                    className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
                  >
                    Очистить диалог
                  </button>
                </div>

                {/* Messages Box Stream */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20" id="chat_scroll_area">
                  {chatMessages.map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                        m.role === "user" 
                          ? "bg-emerald-600 text-white rounded-tr-none" 
                          : m.emergencyTriage
                            ? "bg-red-50 border border-red-200 text-red-950 rounded-tl-none"
                            : m.careRoute?.level === "urgent_same_day"
                              ? "bg-amber-50 border border-amber-200 text-amber-950 rounded-tl-none"
                            : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
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
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[85%] space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                          <span>Врач думает...</span>
                        </div>
                        <div className="flex gap-1.5 items-center py-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Chat Form */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-[#FDFBF8] flex gap-2 items-center" id="chat_submit_form">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Например: Покраснение кожи у младенца 6 месяцев, не чешется..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800" 
                    disabled={isChatLoading}
                    id="chat_input_field"
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm transition-all focus:ring-2 focus:ring-emerald-400 cursor-pointer flex items-center gap-1 shrink-0"
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
    </>
  );
}
