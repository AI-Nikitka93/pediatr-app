import React from 'react';
import { Baby, Stethoscope, Heart, ShieldAlert, CheckCircle2, Calendar, User, MessageCircle, Activity, Trophy, Apple, Sparkles, BookOpen, Clock, ChevronRight, Calculator, Check, X, Award, AlertCircle, PhoneCall, MapPin, FileText, Download, Plus, Trash2, CheckSquare, Square, HelpCircle, TrendingUp, ArrowRight, Info, Volume2, VolumeX, Bell, BellOff, Building2, Lock, LogOut, Key, Users, Briefcase } from 'lucide-react';
const GrowthChart = React.lazy(() => import("../components/GrowthChart"));

export default function QuizTab(props: any) {
  const {  } = props;
  
  return (
    <>
      <div className="max-w-2xl mx-auto space-y-8" id="tab_quiz_view">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-emerald-600 bg-emerald-100/50 px-3 py-1.5 rounded-full uppercase">
                Интерактивная игра для родителей
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
                Квиз: Педиатр против ОРВИ-мифов 🤒🛡️
              </h3>
              <p className="text-sm text-slate-500">
                Горячие карточки с каверзными вопросами про народную медицину, лекарства и уход за детьми во время простуды. Проверьте свои знания доказательной медицины!
              </p>
            </div>

            {/* Quiz Box */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-8 shadow-md">
              
              {!quizCompleted ? (
                <div className="space-y-6">
                  
                  {/* Progress Header */}
                  <div className="flex justify-between items-center border-b border-rose-50 pb-4 text-xs font-bold text-slate-400">
                    <span>Вопрос {quizIndex + 1} из {MYTH_QUIZ_QUESTIONS.length}</span>
                    <span className="text-emerald-600 uppercase tracking-widest">Очки: {quizScore}</span>
                  </div>

                  {/* Question Title */}
                  <h4 className="text-md sm:text-lg font-bold text-slate-800 leading-relaxed font-display">
                    {MYTH_QUIZ_QUESTIONS[quizIndex].question}
                  </h4>

                  {/* Options Stack */}
                  <div className="space-y-3">
                    {MYTH_QUIZ_QUESTIONS[quizIndex].options.map(option => {
                      const isSelected = selectedAnswer === option.id;
                      let optionBg = "bg-white hover:bg-slate-50 border-slate-200/80";
                      
                      if (hasSubmittedAnswer) {
                        if (option.isCorrect) {
                          optionBg = "bg-emerald-50/70 border-emerald-500 text-emerald-950 font-medium";
                        } else if (isSelected) {
                          optionBg = "bg-rose-50/70 border-rose-500 text-rose-950";
                        } else {
                          optionBg = "bg-slate-50/30 border-slate-100 text-slate-400";
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
                          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black uppercase text-slate-500 shrink-0 mt-0.5">
                            {option.id}
                          </span>
                          <span>{option.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions / Answers proof */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    
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
                          className="px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
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
                    <h4 className="text-xl sm:text-2xl font-bold font-display text-slate-800">Квиз успешно пройден!</h4>
                    <p className="text-sm text-slate-500">
                      Ваш итоговый счет: <strong className="text-emerald-600 text-lg font-black">{quizScore} из {MYTH_QUIZ_QUESTIONS.length}</strong> очков.
                    </p>
                  </div>

                  {/* Medal badge based on points */}
                  <div className="bg-[#FAF8F3] p-6 rounded-2xl border border-amber-200/50 max-w-sm mx-auto space-y-2">
                    <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">Присужденный статус:</span>
                    <h5 className="text-lg font-black text-amber-900">
                      {quizScore === 5 ? "👑 Образцовый доказательный родитель!" : quizScore >= 3 ? "🎓 Мудрый и бдительный родитель!" : "🍀 Начинающий доказательный педиатр"}
                    </h5>
                    <p className="text-xs text-slate-500">
                      {quizScore === 5 
                        ? "Великолепный результат! Вы отлично ориентируетесь в принципах доказательной медицины, бережете здоровье своего малыша и не поддаетесь на старые бабушкины опасные уловки." 
                        : "Хороший результат! Вы доверяете науке и отлично заботитесь о здоровье. Пройдите квиз еще раз или пообщайтесь с нашим ИИ-Ассистентом, чтобы закрепить новые знания."}
                    </p>
                  </div>

                  <button 
                    onClick={handleRestartQuiz}
                    className="px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer"
                  >
                    Пройти заново
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 5: Client Medical records (Day care tracker & appointment simulated scheduling) */}
    </>
  );
}
