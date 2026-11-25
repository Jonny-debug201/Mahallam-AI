import React from 'react';
import { Home, MapPin, Plus, Sparkles, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg shadow-slate-900/10">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-h-[50px] min-w-[44px] transition-colors ${
            activeTab === 'home' ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Bosh sahifa</span>
        </button>

        {/* Tab 2: Map */}
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center min-h-[50px] min-w-[44px] transition-colors ${
            activeTab === 'map' ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className={`w-5 h-5 ${activeTab === 'map' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Xarita</span>
        </button>

        {/* Tab 3: Quick Report (Center CTA) */}
        <button
          onClick={() => setActiveTab('report')}
          className="flex flex-col items-center justify-center -mt-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-600 group-active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-600/35 border-2 border-white transition-transform">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className={`text-[10px] mt-1 font-semibold ${activeTab === 'report' ? 'text-emerald-700' : 'text-slate-600'}`}>
            Murojaat
          </span>
        </button>

        {/* Tab 4: AI Assistant */}
        <button
          onClick={() => setActiveTab('ai_assistant')}
          className={`flex flex-col items-center justify-center min-h-[50px] min-w-[44px] transition-colors ${
            activeTab === 'ai_assistant' ? 'text-sky-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${activeTab === 'ai_assistant' ? 'stroke-[2.5] text-sky-600' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">AI Yordamchi</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center min-h-[50px] min-w-[44px] transition-colors ${
            activeTab === 'profile' ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Profil</span>
        </button>
      </div>
    </nav>
  );
};
