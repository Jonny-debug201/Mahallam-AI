import React, { useState } from 'react';
import {
  MahallaReport,
  UserProfile,
  StatusKey,
} from '../types';
import { CATEGORIES, STATUSES } from '../data/categories';
import {
  CheckCircle2,
  Clock,
  MapPin,
  PlusCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  Sparkles,
  Car,
  Trash2,
  Lightbulb,
  Droplets,
  Zap,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface HomeScreenProps {
  reports: MahallaReport[];
  userProfile: UserProfile;
  isDemoMode: boolean;
  onNavigateToReport: () => void;
  onNavigateToMap: () => void;
  onNavigateToMyReports: () => void;
  onNavigateToAI: () => void;
  onSelectReport: (report: MahallaReport) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  reports,
  userProfile,
  isDemoMode,
  onNavigateToReport,
  onNavigateToMap,
  onNavigateToMyReports,
  onNavigateToAI,
  onSelectReport,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | StatusKey>('ALL');

  const totalReports = reports.length;
  const resolvedCount = reports.filter((r) => r.status === 'RESOLVED').length;
  const inProgressCount = reports.filter(
    (r) => r.status === 'IN_PROGRESS' || r.status === 'IN_REVIEW'
  ).length;

  const filteredReports = reports.filter((r) => {
    if (selectedFilter === 'ALL') return true;
    return r.status === selectedFilter;
  });

  const getCategoryIcon = (key: string) => {
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

  const formatRelativeTime = (timestamp: number) => {
    const diffHours = Math.round((Date.now() - timestamp) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Hozirgina';
    if (diffHours < 24) return `${diffHours} soat oldin`;
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} kun oldin`;
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Welcome Banner Card */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-48 h-48 rounded-full bg-emerald-400/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-medium">
              <Shield className="w-4 h-4 text-emerald-300" />
              <span>{userProfile.region} · {userProfile.district}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
              Assalomu alaykum, {userProfile.fullName}!
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl">
              <span className="font-semibold text-white">{userProfile.mahallaName}</span> hududidagi har qanday muammoni suratga oling va Google Gemini AI yordamida tezkor yuboring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToReport}
              className="px-5 py-3 bg-white text-emerald-800 hover:bg-emerald-50 font-semibold rounded-2xl text-sm transition-transform active:scale-[0.98] shadow-md flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Muammo haqida xabar berish</span>
            </button>
            <button
              onClick={onNavigateToAI}
              className="px-4 py-3 bg-emerald-600/40 hover:bg-emerald-600/60 text-white font-medium rounded-2xl text-sm border border-emerald-400/30 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-sky-300" />
              <span>AI Maslahatchi</span>
            </button>
          </div>
        </div>
      </section>

      {/* Demo Mode Notice */}
      {isDemoMode && (
        <section className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold block text-amber-950 mb-0.5">
              Sinov va Demo rejimi faol
            </span>
            Ilovadagi barcha xabarlar va ko‘rsatkichlar namuna (demo) ma’lumotlaridir. Haqiqiy davlat organlariga yoki tuman hokimiyatiga to‘g‘ridan-to‘g‘ri yuborilmaydi.
          </div>
        </section>
      )}

      {/* Statistics Strip */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Jami murojaatlar</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center">
              <Layers className="w-4 h-4 text-sky-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {totalReports}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Mahallada qayd etilgan</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Hal qilingan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums">
              {resolvedCount}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              {totalReports > 0 ? `${Math.round((resolvedCount / totalReports) * 100)}% samaradorlik` : '0%'}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="col-span-2 md:col-span-1 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Jarayonda va Ko‘rib chiqilmoqda</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 tabular-nums">
              {inProgressCount}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Mas’ullar ishlamoqda</span>
          </div>
        </div>
      </section>

      {/* Main Content Feed Header & Filters */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Mahalladagi so‘nggi holatlar
            </h2>
            <p className="text-xs text-slate-500">
              Fuqarolar tomonidan yuborilgan va ijrosi nazoratdagi muammolar
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToMap}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xaritada ochish</span>
            </button>
            <button
              onClick={onNavigateToMyReports}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <span>Mening murojaatlarim</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Barchasi ({totalReports})
          </button>
          <button
            onClick={() => setSelectedFilter('NEW')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedFilter === 'NEW'
                ? 'bg-sky-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Yangi ({reports.filter((r) => r.status === 'NEW').length})
          </button>
          <button
            onClick={() => setSelectedFilter('IN_PROGRESS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedFilter === 'IN_PROGRESS'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Jarayonda ({reports.filter((r) => r.status === 'IN_PROGRESS').length})
          </button>
          <button
            onClick={() => setSelectedFilter('RESOLVED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedFilter === 'RESOLVED'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Hal qilindi ({resolvedCount})
          </button>
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-700">Ushbu holatda murojaatlar yo‘q</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Siz birinchi bo‘lib mahallangizdagi muammo haqida xabar qoldirishingiz mumkin.
            </p>
            <button
              onClick={onNavigateToReport}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Xabar berish</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredReports.map((report) => {
              const cat = CATEGORIES[report.category] || CATEGORIES.OTHER;
              const statusObj = STATUSES[report.status] || STATUSES.NEW;

              return (
                <div
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Category & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: cat.bgColor }}
                        >
                          {getCategoryIcon(report.category)}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 truncate">
                          {cat.titleUz}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap ${statusObj.badgeClass}`}
                      >
                        {statusObj.titleUz}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {report.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {report.description}
                      </p>
                    </div>

                    {/* AI Recommendation Snippet */}
                    {report.aiRecommendation && (
                      <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-600 border border-slate-100 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 italic">
                          AI tavsiyasi: {report.aiRecommendation}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer: Address, Time & Arrow */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1 truncate max-w-[220px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{report.address}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span>{formatRelativeTime(report.createdAt)}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
