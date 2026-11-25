import React, { useState, useRef } from 'react';
import { apiService } from '../services/api';
import { AIAnalysisResult } from '../types';
import { CATEGORIES } from '../data/categories';
import {
  Sparkles,
  Upload,
  Send,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
  Shield,
  Loader2,
  ArrowRight,
  Info,
  Car,
  Trash2,
  Lightbulb,
  Droplets,
  Zap,
  Layers,
} from 'lucide-react';

interface AIAssistantScreenProps {
  onApplyToReport: (analysis: AIAnalysisResult, imageBase64?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: number;
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({ onApplyToReport }) => {
  const [activeMode, setActiveMode] = useState<'photo' | 'chat'>('photo');

  // Photo analysis state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userNote, setUserNote] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Chat consultation state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'gemini',
      text: 'Assalomu alaykum! Men "Mahallam AI" sun’iy intellekt maslahatchisiman. Mahallangizdagi yo‘l, suv, elektr, chiqindi va obodonlashtirish bo‘yicha har qanday savolingizga javob berishim yoki suratni tahlil qilib berishim mumkin.',
      timestamp: Date.now(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Suggested quick prompts in Uzbek
  const QUICK_QUESTIONS = [
    'Ichimlik suvi quvuri yorilsa qayerga xabar berish kerak?',
    'Ko‘cha chiroqlari ta’mirlanishi uchun qancha muddat beriladi?',
    'Chiqindilarni o‘z vaqtida olib ketish me’yorlari qanday?',
    'Mahallada daraxt kesish yoki butash tartibi qanday?',
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      runAnalysis(base64, userNote);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (imgBase64: string, note?: string) => {
    setIsAnalyzing(true);
    setErrorNotice(null);
    setAnalysisResult(null);

    try {
      const result = await apiService.analyzePhoto(imgBase64, note);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorNotice('Suratni tahlil qilishda xatolik yuz berdi. Iltimos qayta urinib ko‘ring.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Chat message submit
  const handleSendChat = async (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const history = chatMessages.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const res = await apiService.sendChatMessage(query, history);

      const geminiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'gemini',
        text: res.reply,
        timestamp: Date.now(),
      };

      setChatMessages((prev) => [...prev, geminiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingChat(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const getCategoryIcon = (key?: string) => {
    switch (key) {
      case 'ROAD':
        return <Car className="w-4 h-4 text-sky-600" />;
      case 'WASTE':
        return <Trash2 className="w-4 h-4 text-amber-600" />;
      case 'LIGHTING':
        return <Lightbulb className="w-4 h-4 text-yellow-600" />;
      case 'WATER':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'ELECTRICITY':
        return <Zap className="w-4 h-4 text-purple-600" />;
      default:
        return <Layers className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Screen Title */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Google Gemini AI Yordamchi
            </h1>
            <p className="text-xs text-slate-500">
              Surat tahlili, rasmiy murojaat matnini tuzish va kommunal huquqiy maslahat
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveMode('photo')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'photo'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Surat Tahlili
          </button>
          <button
            onClick={() => setActiveMode('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'chat'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Savol-Javob (Chat)
          </button>
        </div>
      </div>

      {/* Mode 1: Photo Analysis */}
      {activeMode === 'photo' && (
        <div className="space-y-6">
          {/* Upload and analysis card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />

            <div className="text-center space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                Mahalla muammosi fotosuratini yuklang
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Gemini sun’iy intellekti suratni ko‘rib chiqadi, toifasini aniqlaydi va idoraviy qonunchilikka mos professional tavsif yozib beradi.
              </p>
            </div>

            {selectedImage ? (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-80 flex items-center justify-center bg-slate-950">
                  <img
                    src={selectedImage}
                    alt="Yuklangan rasm"
                    className="max-h-80 w-auto object-contain"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                      <span className="text-xs font-semibold">Gemini AI vizual tahlil qilmoqda...</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Boshqa surat tanlash
                  </button>
                  <button
                    type="button"
                    onClick={() => runAnalysis(selectedImage, userNote)}
                    disabled={isAnalyzing}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                    <span>Qayta tahlil qilish</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-10 text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 transition-all space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 block">
                    Fotosuratni bu yerga yuklang
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    yoki qurilma fayllari orasidan tanlang (JPG, PNG, WebP)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Sun’iy Intellekt Tahlili Natijalari
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                  {analysisResult.severityLevel} xavf darajasi
                </span>
              </div>

              {/* Verified Disclaimer Notice (CRITICAL REQUIREMENT) */}
              <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold block mb-0.5">XOLISLIK VA XAVFSIZLIK ESLATMASI:</span>
                  {analysisResult.confidenceNote}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Card */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Aniqlangan toifa
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs">
                      {getCategoryIcon(analysisResult.categoryKey)}
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {analysisResult.categoryTitleUz}
                    </span>
                  </div>
                </div>

                {/* Short Title */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Tavsiya etilgan sarlavha
                  </span>
                  <div className="text-sm font-bold text-slate-800 pt-1">
                    {analysisResult.issueTitleUz}
                  </div>
                </div>
              </div>

              {/* Professional Description */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span>Rasmiy Murojaat Matni (Davlat organlariga taqdim etish uchun):</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{analysisResult.professionalDescriptionUz}"
                </div>
              </div>

              {/* Safety Recommendation */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Aholi uchun tavsiyalar va xavfsizlik choralari:</span>
                </div>
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-900 leading-relaxed">
                  {analysisResult.safetyRecommendationUz}
                </div>
              </div>

              {/* Action Button: Apply to Report */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onApplyToReport(analysisResult, selectedImage || undefined)}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <span>Ushbu ma’lumotlar bilan rasmiy murojaat yaratish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Chat Consultation */}
      {activeMode === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
          {/* Chat Messages View */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {msg.sender === 'gemini' && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 mb-1.5">
                      <Sparkles className="w-3 h-3 text-sky-600" />
                      <span>Mahallam AI Maslahatchi</span>
                    </div>
                  )}
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>
              </div>
            ))}

            {isSendingChat && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 flex items-center gap-2 text-xs text-slate-500 shadow-xs">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>Gemini AI o‘ylamoqda...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendChat(q)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Mahalla muammosi yoki idoralarga murojaat bo‘yicha savol bering..."
              className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => handleSendChat()}
              disabled={isSendingChat || !chatInput.trim()}
              className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-sm disabled:opacity-40"
              title="Yuborish"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
