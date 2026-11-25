import React from 'react';
import { ShieldCheck, Code2, PlusCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAndroidCode: () => void;
  isDemoMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAndroidCode,
  isDemoMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-none">
                Mahallam AI
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                Xalq Nazorati & Infratuzilma
              </span>
            </div>
          </button>

          {isDemoMode && (
            <span className="hidden sm:inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              Demo rejim
            </span>
          )}
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-slate-900 ${
              activeTab === 'home'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : ''
            }`}
          >
            Bosh sahifa
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-slate-900 ${
              activeTab === 'map'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : ''
            }`}
          >
            Xarita
          </button>
          <button
            onClick={() => setActiveTab('my_reports')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-slate-900 ${
              activeTab === 'my_reports'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : ''
            }`}
          >
            Mening murojaatlarim
          </button>
          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-slate-900 flex items-center gap-1.5 ${
              activeTab === 'ai_assistant'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            AI Yordamchi
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-slate-900 ${
              activeTab === 'stats'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : ''
            }`}
          >
            Statistika
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-slate-900 ${
              activeTab === 'profile'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : ''
            }`}
          >
            Profil
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAndroidCode}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
            title="Kotlin / Jetpack Compose Android loyihasi"
          >
            <Code2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Android</span> Kodlari
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/25 rounded-xl transition-all whitespace-nowrap active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Murojaat yuborish</span>
          </button>
        </div>
      </div>
    </header>
  );
};
